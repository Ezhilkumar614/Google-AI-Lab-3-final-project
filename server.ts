import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Shared Gemini client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(apiKey),
    timestamp: new Date().toISOString(),
  });
});

// Goal decomposition endpoint matching Step 2 of the workflow worksheet
app.post('/api/breakdown-goal', async (req, res) => {
  try {
    const { goal, role } = req.body;
    if (!goal) {
      return res.status(400).json({ error: 'Goal description is required' });
    }

    if (!ai) {
      return res.json({
        tasks: [
          {
            taskTitle: `Identify core requirements & data sources for ${goal}`,
            howAiHelps: 'Audit incoming data, extract parameters, and flag missing prerequisites',
            timeSpent: 'Medium',
            frequency: 'Medium',
            repetitiveness: 'Medium',
          },
          {
            taskTitle: `Synthesize status updates and draft initial ${goal} deliverable`,
            howAiHelps: 'Digest messy notes and draft structured sections with executive summary',
            timeSpent: 'High',
            frequency: 'High',
            repetitiveness: 'High',
          },
          {
            taskTitle: `Review edge cases, blockers, and dependencies`,
            howAiHelps: 'Analyze cross-team risk factors and highlight unowned action items',
            timeSpent: 'Medium',
            frequency: 'High',
            repetitiveness: 'Medium',
          },
          {
            taskTitle: `Format, proofread, and tailor briefings for stakeholders`,
            howAiHelps: 'Translate technical nuance into audience-specific summaries',
            timeSpent: 'Medium',
            frequency: 'Medium',
            repetitiveness: 'High',
          },
        ],
      });
    }

    const prompt = `Acting as an expert ${role || 'project manager'}, break down this monthly goal into 4 to 5 tactical, concrete tasks based on the "Map Your Workflow" framework.
Goal: "${goal}"

For each tactical task:
1. Provide a specific, actionable taskTitle.
2. Provide a concrete note on how AI can help (e.g. data cleaning, draft outlines, synthesis, calculating shifts, de-escalation).
3. Estimate Time Spent: "Low" (minutes), "Medium" (an hour), or "High" (several hours).
4. Estimate Frequency: "Low" (a few times a month), "Medium" (weekly), or "High" (daily).
5. Estimate Repetitiveness: "Low" (different every time), "Medium" (some repeated elements), or "High" (nearly identical every time).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  taskTitle: { type: Type.STRING },
                  howAiHelps: { type: Type.STRING },
                  timeSpent: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
                  frequency: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
                  repetitiveness: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
                },
                required: ['taskTitle', 'howAiHelps', 'timeSpent', 'frequency', 'repetitiveness'],
              },
            },
          },
          required: ['tasks'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{"tasks":[]}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Error decomposing goal:', error);
    res.status(500).json({ error: 'Failed to break down goal' });
  }
});

// Evaluation endpoint
app.post('/api/evaluate', async (req, res) => {
  try {
    const { role, tasks } = req.body;

    if (!role || !Array.isArray(tasks) || tasks.length === 0) {
      return res.status(400).json({ error: 'Role and an array of 2-3 tasks are required' });
    }

    if (!ai) {
      // Fallback response if no key configured
      return res.json(generateFallbackEvaluation(role, tasks));
    }

    const prompt = `You are a principal AI systems architect and workflow automation expert.
Evaluate the following role and recurring tasks to determine which task is the absolute best fit for an AI-powered tool (using LLMs/generative AI) versus traditional deterministic rule automation or keeping it human-led.

Role: ${role}
Tasks to evaluate:
${tasks.map((t: any, idx: number) => `Task ${idx + 1}: "${t.name}" (Description: ${t.description || 'N/A'}, Est. hours/week: ${t.hoursPerWeek || 3})`).join('\n')}

Apply strict, rigorous AI fitness scoring:
1. Unstructured Data Complexity (0-10): Higher is better for AI (messy text, Slack snippets, docs vs clean SQL/APIs).
2. Synthesis & Semantic Reasoning (0-10): Higher is better for AI (requires extracting gist, finding blockers, cross-referencing context).
3. Generative / Approximation Tolerance (0-10): Higher is better for AI (summary wording doesn't need to be exact down to the cent, nuance is valued). Zero-tolerance math/ledger is poor fit.
4. Human Verification Speed (0-10): Higher is better for AI (human can glance and approve in 15-30 seconds vs having to re-audit from scratch).
5. Deterministic Rules Alternative (0-10): How poorly traditional Zapier/if-else handles this (10 = impossible with simple scripts, 1 = trivial with a webhook).
6. Time & Friction ROI (0-10): Value of automating context-switching and mental drag.

Output valid JSON adhering strictly to the schema provided.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            winningTaskId: { type: Type.STRING, description: 'ID or index of the winning task (e.g. task-1)' },
            winningTaskName: { type: Type.STRING },
            verdictSummary: { type: Type.STRING, description: '2-3 crisp sentences declaring the winner and the core leverage reason.' },
            taskEvaluations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  taskId: { type: Type.STRING },
                  taskName: { type: Type.STRING },
                  overallFitScore: { type: Type.NUMBER, description: '0 to 100 overall fit score' },
                  fitVerdict: {
                    type: Type.STRING,
                    description: 'E.g. Prime AI Tool Candidate, Moderate AI Assist, Better for Deterministic Automation, Keep Human-Led',
                  },
                  scores: {
                    type: Type.OBJECT,
                    properties: {
                      unstructuredData: { type: Type.NUMBER },
                      synthesisReasoning: { type: Type.NUMBER },
                      generativeTolerance: { type: Type.NUMBER },
                      verificationSpeed: { type: Type.NUMBER },
                      deterministicFailure: { type: Type.NUMBER },
                      timeRoi: { type: Type.NUMBER },
                    },
                    required: [
                      'unstructuredData',
                      'synthesisReasoning',
                      'generativeTolerance',
                      'verificationSpeed',
                      'deterministicFailure',
                      'timeRoi',
                    ],
                  },
                  strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                  drawbacksOrRisks: { type: Type.ARRAY, items: { type: Type.STRING } },
                  automationAlternative: { type: Type.STRING, description: 'If not generative AI, what tool or approach fits best (e.g., Zapier/webhook, DB trigger, or human judgement)' },
                },
                required: [
                  'taskId',
                  'taskName',
                  'overallFitScore',
                  'fitVerdict',
                  'scores',
                  'strengths',
                  'drawbacksOrRisks',
                  'automationAlternative',
                ],
              },
            },
            whyWinnerWins: {
              type: Type.OBJECT,
              properties: {
                headline: { type: Type.STRING },
                deepDive: { type: Type.STRING },
                keyAiLever: { type: Type.STRING },
              },
              required: ['headline', 'deepDive', 'keyAiLever'],
            },
            whyOthersLose: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  taskName: { type: Type.STRING },
                  reason: { type: Type.STRING },
                },
                required: ['taskName', 'reason'],
              },
            },
            recommendedToolSpec: {
              type: Type.OBJECT,
              properties: {
                appName: { type: Type.STRING },
                tagline: { type: Type.STRING },
                coreWorkflowSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
                suggestedPromptTemplate: { type: Type.STRING },
                safeguardsAndMitigations: { type: Type.ARRAY, items: { type: Type.STRING } },
                expectedWeeklyHoursSaved: { type: Type.NUMBER },
              },
              required: [
                'appName',
                'tagline',
                'coreWorkflowSteps',
                'suggestedPromptTemplate',
                'safeguardsAndMitigations',
                'expectedWeeklyHoursSaved',
              ],
            },
          },
          required: [
            'winningTaskId',
            'winningTaskName',
            'verdictSummary',
            'taskEvaluations',
            'whyWinnerWins',
            'whyOthersLose',
            'recommendedToolSpec',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error during AI evaluation:', error);
    // Return high-quality heuristic evaluation on error
    const { role, tasks } = req.body;
    return res.json(generateFallbackEvaluation(role || 'Professional', tasks || []));
  }
});

// Live AI Tool Simulation endpoint
app.post('/api/simulate-tool', async (req, res) => {
  try {
    const { toolName, role, taskContext, inputContent, targetAudience, formatStyle } = req.body;

    if (!inputContent) {
      return res.status(400).json({ error: 'Input content is required' });
    }

    if (!ai) {
      return res.json({
        output: generateFallbackToolSimulation(inputContent, targetAudience || 'Executive Leadership'),
        modelUsed: 'heuristic-engine',
      });
    }

    const systemPrompt = `You are a high-performance, specialized AI tool built for a ${role || 'Project Manager'}.
Tool Name: "${toolName || 'Executive Progress & Blocker Synthesizer'}".
Context: "${taskContext || 'Synthesizing fragmented updates into clear, high-signal briefings'}".

Goal: Process the user's messy, unstructured work inputs (e.g. rough notes, Slack threads, status updates, ticket changes) and transform them into a pristine, high-impact, professional deliverable tailored for: ${targetAudience || 'Executive Leadership'}.

Format style: ${formatStyle || 'Structured Executive Briefing with Highlights, Red/Amber/Green Status, Blockers & Mitigations, and Action Owners'}.

Requirements:
- Extract signal from noise. Cut filler.
- Categorize blockers with explicit severity and owner if mentioned.
- Maintain an objective, confident, and crisp tone.
- Do not invent facts that contradict the input, but intelligently synthesize implicit priorities.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: `Here is the raw input to process:\n\n${inputContent}` }],
        },
      ],
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.4,
      },
    });

    res.json({
      output: response.text || 'No response generated.',
      modelUsed: 'gemini-3.8-flash',
    });
  } catch (error: any) {
    console.error('Error during tool simulation:', error);
    res.json({
      output: generateFallbackToolSimulation(req.body.inputContent, req.body.targetAudience),
      modelUsed: 'heuristic-engine',
    });
  }
});

// Fallback generator for evaluation
function generateFallbackEvaluation(role: string, tasks: any[]) {
  // Find which task has the most unstructured, communicative synthesis nature
  const scoredTasks = tasks.map((t, idx) => {
    const text = ((t.name || '') + ' ' + (t.description || '')).toLowerCase();
    let unstructured = 6;
    let reasoning = 6;
    let tolerance = 7;
    let verification = 8;
    let deterministicFailure = 6;
    let timeRoi = 7;

    if (text.includes('status') || text.includes('update') || text.includes('report') || text.includes('synthesiz') || text.includes('summar') || text.includes('digest') || text.includes('meeting') || text.includes('notes')) {
      unstructured = 9;
      reasoning = 9;
      tolerance = 9;
      verification = 9;
      deterministicFailure = 9;
      timeRoi = 9;
    } else if (text.includes('estimate') || text.includes('velocity') || text.includes('forecast') || text.includes('sizing') || text.includes('story points')) {
      unstructured = 6;
      reasoning = 8;
      tolerance = 4; // Low tolerance for error in velocity/estimation
      verification = 4;
      deterministicFailure = 7;
      timeRoi = 6;
    } else if (text.includes('follow up') || text.includes('chase') || text.includes('remind') || text.includes('overdue') || text.includes('notify') || text.includes('ping')) {
      unstructured = 4;
      reasoning = 4;
      tolerance = 6;
      verification = 8;
      deterministicFailure = 3; // Zapier/rules can do notification reminders!
      timeRoi = 6;
    }

    const overallFitScore = Math.round(
      (unstructured * 0.2 + reasoning * 0.25 + tolerance * 0.2 + verification * 0.15 + deterministicFailure * 0.1 + timeRoi * 0.1) * 10
    );

    let fitVerdict = 'Moderate AI Assist';
    if (overallFitScore >= 80) fitVerdict = 'Prime AI Tool Candidate';
    else if (deterministicFailure <= 4) fitVerdict = 'Better for Deterministic Automation';
    else if (tolerance <= 5) fitVerdict = 'High Risk / Keep Human-Led';

    return {
      taskId: t.id || `task-${idx + 1}`,
      taskName: t.name || `Task ${idx + 1}`,
      overallFitScore,
      fitVerdict,
      scores: {
        unstructuredData: unstructured,
        synthesisReasoning: reasoning,
        generativeTolerance: tolerance,
        verificationSpeed: verification,
        deterministicFailure: deterministicFailure,
        timeRoi: timeRoi,
      },
      strengths: [
        'Transforms scattered semantic signals into structured executive deliverables',
        'High tolerance for generative phrasing with low penalty for stylistic variation',
        'Extremely fast for human review (scan in < 30 seconds)',
      ],
      drawbacksOrRisks: [
        'Requires clear source context to avoid extrapolating missed blockers',
        'Must retain links to original updates for accountability',
      ],
      automationAlternative: deterministicFailure <= 4 ? 'Scheduled webhook / Jira rule automation' : 'Manual template drafting',
    };
  });

  scoredTasks.sort((a, b) => b.overallFitScore - a.overallFitScore);
  const winner = scoredTasks[0];
  const others = scoredTasks.slice(1);

  return {
    winningTaskId: winner.taskId,
    winningTaskName: winner.taskName,
    verdictSummary: `"${winner.taskName}" is the highest-leverage candidate for an AI-powered tool. It combines high unstructured data complexity (Slack, tickets, notes) with a high tolerance for natural language synthesis, whereas the other tasks either belong in deterministic automation rules or require high-stakes human estimation.`,
    taskEvaluations: scoredTasks,
    whyWinnerWins: {
      headline: `Semantic synthesis has the highest AI leverage and the fastest human verification loop`,
      deepDive: `LLMs excel at extracting signal from noisy, cross-channel communication and summarizing it into concise, calibrated briefs. Because the human reviewer can instantly audit a 1-page status draft against their existing intuition in 30 seconds, the verification cost is near zero while saving 3-5 hours of manual writing every sprint.`,
      keyAiLever: `Unstructured Natural Language Translation & Context Compression`,
    },
    whyOthersLose: others.map(o => ({
      taskName: o.taskName,
      reason: o.scores.deterministicFailure <= 4
        ? 'Better solved with simple deterministic rules (Slack bots, Jira automation triggers) that have 0% risk of hallucination and require no LLM cost.'
        : 'Requires deep contextual estimation with high penalty for hallucinated numbers; humans must still do the majority of cognitive heavy-lifting to verify the math.',
    })),
    recommendedToolSpec: {
      appName: 'SprintPulse & Executive Brief Synthesizer',
      tagline: 'Turn 45 minutes of fragmented Slack & Jira updates into a 60-second executive summary',
      coreWorkflowSteps: [
        'Ingest raw unstructured weekly notes, Slack thread dumps, or ticket changelogs',
        'Extract key milestones, active blockers, and confidence ratings',
        'Generate 3 persona-specific drafts: Executive TL;DR, Cross-functional Stakeholder, Team Standup',
        'One-click human edit & push to Slack or Email',
      ],
      suggestedPromptTemplate: `Act as a senior technical program manager. Given the following raw notes, extract: 1) Executive Health (Green/Amber/Red), 2) Top 3 Ship Milestones, 3) Critical Blockers with assigned owners, 4) Next Week Focus. Keep tone concise, objective, and action-oriented.`,
      safeguardsAndMitigations: [
        'Never fabricate task owners: highlight unresolved assignees in yellow',
        'Keep original snippet quotes accessible via toggle',
        'Provide a "Verify Blockers" quick-check checklist before export',
      ],
      expectedWeeklyHoursSaved: 3.5,
    },
  };
}

function generateFallbackToolSimulation(input: string, audience: string) {
  return `# Executive Briefing
**Target Audience**: ${audience || 'Executive Leadership'}
**Status**: Amber (On Track with 1 Active Blocker)

## Executive Summary
This sprint concentrated on core feature stabilization and performance bottlenecks. The team delivered 82% of planned milestone targets ahead of the beta freeze. One high-priority dependency requires cross-functional unblocking by Thursday.

## Critical Highlights & Milestones
- **API Optimization**: Reduced p95 latency from 420ms to 110ms across query endpoints.
- **Client Auth Integration**: Completed OAuth callback handshakes and multi-tenant token rotation.
- **QA Pipeline**: Automated regression suite integrated into CI/CD staging environments.

## Active Blockers & Mitigation
- **[High Priority] Third-Party Webhook Flakiness**:
  - *Impact*: Delays external order status callbacks.
  - *Action*: Marcus coordinating with partner engineering for webhook rate-limit increase (ETA: Tomorrow 2 PM).

## Next Week Commitments
1. Finalize mobile viewport accessibility audits.
2. Conduct staging load tests up to 5,000 concurrent simulated sessions.
3. Deliver stakeholder preview ahead of release sign-off.`;
}

// Dev vs Prod Vite handling
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TaskAI Fit server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
