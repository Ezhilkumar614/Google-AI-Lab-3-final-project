import { RolePreset } from '../types';

export const ROLE_PRESETS: RolePreset[] = [
  {
    id: 'project-manager',
    roleTitle: 'Project Manager',
    description: 'Coordinating cross-functional engineering deliverables, sprint schedules, and stakeholder alignments.',
    iconName: 'LayoutGrid',
    tasks: [
      {
        id: 'pm-task-1',
        name: 'Weekly Executive Status & Risk Synthesis',
        description: 'Aggregating messy Slack updates, Jira ticket status changes, and standup notes into a polished weekly progress briefing for leadership.',
        hoursPerWeek: 4.5,
        currentPain: 'Takes 4 hours every Friday parsing 40+ ticket comments, chasing nuance, and reformatting into executive bullet points.',
        inputFormat: 'Messy text, Slack threads, Jira changelogs',
        outputFormat: 'Structured executive brief with Red/Amber/Green status & blockers',
      },
      {
        id: 'pm-task-2',
        name: 'Sprint Story Point & Velocity Estimation',
        description: 'Predicting story point complexity and estimating sprint velocity from backlog ticket descriptions.',
        hoursPerWeek: 3.0,
        currentPain: 'Team debates estimates in refinement; historical velocity fluctuations make manual sizing inconsistent.',
        inputFormat: 'User story descriptions and acceptance criteria',
        outputFormat: 'Numerical story points and sprint capacity forecast',
      },
      {
        id: 'pm-task-3',
        name: 'Chasing Assignees on Overdue Tickets',
        description: 'Direct-messaging engineers about overdue tickets and updating estimated completion dates in the project tracker.',
        hoursPerWeek: 3.5,
        currentPain: 'Awkward manual reminder pings across Slack and repeatedly adjusting due dates in Jira.',
        inputFormat: 'Ticket due dates and assignee usernames',
        outputFormat: 'Reminder messages and date field updates',
      },
    ],
    evaluation: {
      winningTaskId: 'pm-task-1',
      winningTaskName: 'Weekly Executive Status & Risk Synthesis',
      verdictSummary:
        'Weekly Executive Status & Risk Synthesis is unequivocally the highest-leverage fit for an AI-powered tool. It combines high unstructured data complexity with high generative tolerance and an ultra-fast human verification loop. The other tasks are either better solved by deterministic rules (ticket reminders) or carry too high an error penalty (story point estimation).',
      taskEvaluations: [
        {
          taskId: 'pm-task-1',
          taskName: 'Weekly Executive Status & Risk Synthesis',
          overallFitScore: 94,
          fitVerdict: 'Prime AI Tool Candidate',
          scores: {
            unstructuredData: 9.5,
            synthesisReasoning: 9.2,
            generativeTolerance: 9.0,
            verificationSpeed: 9.4,
            deterministicFailure: 9.5,
            timeRoi: 9.2,
          },
          strengths: [
            'Exceptional at extracting high-signal summaries from chaotic, multi-channel inputs (Slack, Jira, meeting transcripts).',
            'High tolerance for generative language: minor wording differences carry zero negative consequence.',
            'Human verification takes < 60 seconds: a PM can scan the generated brief and immediately confirm accuracy.',
            'Deterministic tools (Zapier/regex) fail completely because they cannot distinguish a strategic blocker from a routine bug.',
          ],
          drawbacksOrRisks: [
            'Risk of missing an unstated political subtlety unless provided in raw context notes.',
            'Requires clear team tagging to avoid attributing a blocker to the wrong lead.',
          ],
          automationAlternative: 'Traditional static dashboards fail because executives want narrative context, not raw ticket tables.',
        },
        {
          taskId: 'pm-task-2',
          taskName: 'Sprint Story Point & Velocity Estimation',
          overallFitScore: 48,
          fitVerdict: 'Keep Human-Led',
          scores: {
            unstructuredData: 5.5,
            synthesisReasoning: 7.0,
            generativeTolerance: 3.2,
            verificationSpeed: 3.8,
            deterministicFailure: 6.0,
            timeRoi: 4.5,
          },
          strengths: [
            'Can reference historical velocity patterns and flag vague acceptance criteria.',
          ],
          drawbacksOrRisks: [
            'Very low tolerance for error: hallucinating 3 story points vs 13 story points ruins sprint commitments and breaks engineering trust.',
            'Verification friction is high: engineers must still read and debate the codebase dependencies regardless of what AI predicts.',
            'AI lacks visibility into undocumented technical debt and individual engineer domain familiarity.',
          ],
          automationAlternative: 'Keep as a collaborative team planning poker exercise; use AI only to audit whether acceptance criteria are missing.',
        },
        {
          taskId: 'pm-task-3',
          taskName: 'Chasing Assignees on Overdue Tickets',
          overallFitScore: 36,
          fitVerdict: 'Better for Deterministic Automation',
          scores: {
            unstructuredData: 2.5,
            synthesisReasoning: 2.0,
            generativeTolerance: 6.0,
            verificationSpeed: 8.5,
            deterministicFailure: 2.0,
            timeRoi: 6.0,
          },
          strengths: [
            'Can phrase reminder messages with contextual politeness.',
          ],
          drawbacksOrRisks: [
            'Massive overkill for an LLM: this is a simple boolean condition (dueDate < today && status != done).',
            'LLM API costs and latency are unnecessary when native Jira Automation or Slack bot webhooks do this with 100% uptime and $0 token cost.',
          ],
          automationAlternative: 'Jira Automation Rule -> Trigger Slack webhook notification on overdue date. Zero AI needed.',
        },
      ],
      whyWinnerWins: {
        headline: 'Natural Language Synthesis has the highest leverage with near-zero verification cost',
        deepDive:
          'Project Managers spend hours every week functioning as human routers: reading hundreds of lines of developer updates, filtering out noise, and translating technical jargon into leadership-ready executive summaries. Because language models excel at compression, tone modulation, and extracting cross-cutting blockers, an AI tool can draft a 1-page brief in 5 seconds. Crucially, the PM already holds the mental model of the project, meaning they can review, tweak, and approve the output in under a minute.',
        keyAiLever: 'Semantic Information Compression & Multi-Source Cross-Referencing',
      },
      whyOthersLose: [
        {
          taskName: 'Chasing Assignees on Overdue Tickets',
          reason:
            'This is a deterministic logic problem. A simple native Jira/Zapier webhook executes this for free with zero risk of conversational drift. Using an LLM adds unnecessary complexity and cost to what is essentially an if-then trigger.',
        },
        {
          taskName: 'Sprint Story Point & Velocity Estimation',
          reason:
            'Estimation has high stakes and low tolerance for variance. If the AI guesses wrong, the team misses sprint commitments. Because engineers still have to scrutinize the task architecture to verify the AI estimate, the tool saves almost zero net cognitive effort.',
        },
      ],
      recommendedToolSpec: {
        appName: 'SprintPulse Executive Synthesizer',
        tagline: 'Transform chaotic weekly Slack threads and Jira updates into a crisp leadership brief in 30 seconds',
        coreWorkflowSteps: [
          'Ingest weekly notes: Paste raw standup notes, Jira changelog exports, or Slack thread snippets',
          'Intelligent extraction: Model isolates completed wins, active blockers, and high-impact risks',
          'Multi-perspective drafting: Generates tailored versions for C-Suite, Cross-Team Leads, and Team Recap',
          'One-click export: Copy formatted Markdown or send to Slack/Notion',
        ],
        suggestedPromptTemplate: `You are an elite Technical Program Manager. Synthesize the provided raw project notes into an executive briefing. Format strictly with: 1) Executive Health (Green/Amber/Red with 1-line justification), 2) Top 3 Milestones Delivered, 3) Critical Blockers with assigned owners, 4) Next Week Critical Path. Eliminate engineering jargon and prioritize strategic customer and revenue impact.`,
        safeguardsAndMitigations: [
          'Explicit Blocker Attribution: Never assign a mitigation owner without evidence in the source text.',
          'Source Traceability: Provide collapsible source snippets beside each synthesized milestone.',
          'Tone Calibration: Allow toggling between Formal Executive, Candid Internal, and Partner-Facing.',
        ],
        expectedWeeklyHoursSaved: 4.0,
      },
    },
    sampleInput: `Weekly Team Raw Dump - Oct 17:
- Sarah (Backend): Got the Stripe migration PR merged yesterday! Payment latency dropped from 850ms to 210ms in staging. Ran into a snag with recurring subscription webhooks throwing 500s when tax is zero; Alex from billing is helping debug, need this resolved before Monday beta.
- David (Frontend): Built the new checkout redesign. Tested on iOS Safari and Chrome. Look & feel is approved by Design. Waiting on Sarah's webhook fix to do full end-to-end checkout test.
- Maya (DevOps): Database migration script is ready. Staging DB upgraded cleanly. Scheduled maintenance window for production DB migration is Sunday 2:00 AM UTC. Downtime expected: ~15 mins.
- Kevin (QA): Blocked on automated end-to-end checkout testing until Sarah's webhook bug is patched. Found 2 minor UI bugs in mobile layout (ticket #402, #405), already assigned to David.
- Overall: Team feels good about Friday launch IF the subscription webhook bug doesn't spill over into Monday.`,
    prototypeTitle: 'SprintPulse Executive Synthesizer',
    prototypeDescription: 'Try this live prototype: paste messy team notes below and generate a structured executive brief.',
  },
  {
    id: 'product-manager',
    roleTitle: 'Product Manager',
    description: 'Defining product strategy, user discovery research, feature roadmaps, and PRD specifications.',
    iconName: 'Compass',
    tasks: [
      {
        id: 'pmgr-task-1',
        name: 'Synthesizing User Interview Transcripts into Opportunity Themes',
        description: 'Analyzing 10+ hours of raw customer call transcripts to extract recurring pain points, quote snippets, and feature requests.',
        hoursPerWeek: 5.0,
        currentPain: 'Re-reading transcripts takes entire days; manual tagging in spreadsheets leads to cognitive fatigue.',
        inputFormat: 'Long-form interview transcripts and notes',
        outputFormat: 'Categorized pain point matrix with customer verbatim quotes',
      },
      {
        id: 'pmgr-task-2',
        name: 'Drafting Comprehensive PRD Acceptance Criteria',
        description: 'Writing detailed edge-case scenarios and Gherkin-style Given/When/Then acceptance criteria for engineering tickets.',
        hoursPerWeek: 3.5,
        currentPain: 'Engineers report missing edge cases during development, requiring mid-sprint PRD updates.',
        inputFormat: 'User story summary and feature requirements',
        outputFormat: 'Numbered edge cases and Given/When/Then specifications',
      },
      {
        id: 'pmgr-task-3',
        name: 'Calculating Feature RICE Priority Scores',
        description: 'Entering Reach, Impact, Confidence, and Effort numbers into a prioritization spreadsheet formula.',
        hoursPerWeek: 2.0,
        currentPain: 'Manual data entry and recalculating formula scores whenever team votes change.',
        inputFormat: 'Spreadsheet numbers for R, I, C, E',
        outputFormat: 'Ranked numerical prioritization table',
      },
    ],
    evaluation: {
      winningTaskId: 'pmgr-task-1',
      winningTaskName: 'Synthesizing User Interview Transcripts into Opportunity Themes',
      verdictSummary:
        'User Interview Transcript Synthesis is the standout winner. Sifting through 20,000 words of messy customer conversation requires massive semantic pattern matching where AI excels. In contrast, RICE score calculations are basic arithmetic (better for spreadsheets), and PRD criteria writing is a secondary assist.',
      taskEvaluations: [
        {
          taskId: 'pmgr-task-1',
          taskName: 'Synthesizing User Interview Transcripts into Opportunity Themes',
          overallFitScore: 92,
          fitVerdict: 'Prime AI Tool Candidate',
          scores: {
            unstructuredData: 9.8,
            synthesisReasoning: 9.4,
            generativeTolerance: 8.8,
            verificationSpeed: 8.9,
            deterministicFailure: 9.8,
            timeRoi: 9.5,
          },
          strengths: [
            'Handles high-volume qualitative text that exceeds human working memory.',
            'Clustering themes and extracting verbatim quotes saves 5-8 hours per research cycle.',
            'Surfaces non-obvious patterns across disparate interviews without cognitive bias.',
          ],
          drawbacksOrRisks: [
            'Risk of over-weighting a vocal customer quote unless frequency weighting is enforced.',
          ],
          automationAlternative: 'Keyword search or regex misses semantic synonyms (e.g., "confusing" vs "felt lost").',
        },
        {
          taskId: 'pmgr-task-2',
          taskName: 'Drafting Comprehensive PRD Acceptance Criteria',
          overallFitScore: 78,
          fitVerdict: 'Moderate AI Assist',
          scores: {
            unstructuredData: 6.5,
            synthesisReasoning: 8.0,
            generativeTolerance: 7.0,
            verificationSpeed: 7.5,
            deterministicFailure: 8.0,
            timeRoi: 7.0,
          },
          strengths: [
            'Great at prompting "what about offline mode?" or "what about session expiry?" edge cases.',
          ],
          drawbacksOrRisks: [
            'Requires human PM validation against business logic and compliance rules.',
          ],
          automationAlternative: 'Standard PRD template checklists.',
        },
        {
          taskId: 'pmgr-task-3',
          taskName: 'Calculating Feature RICE Priority Scores',
          overallFitScore: 32,
          fitVerdict: 'Better for Deterministic Automation',
          scores: {
            unstructuredData: 2.0,
            synthesisReasoning: 3.0,
            generativeTolerance: 3.0,
            verificationSpeed: 9.0,
            deterministicFailure: 1.0,
            timeRoi: 3.5,
          },
          strengths: ['Can auto-sort columns.'],
          drawbacksOrRisks: [
            'Formula = (R * I * C) / E is basic spreadsheet math. An LLM introduces hallucination risk into basic multiplication.',
          ],
          automationAlternative: 'Google Sheets or Airtable formula column: `= (B2*C2*D2)/E2`.',
        },
      ],
      whyWinnerWins: {
        headline: 'Qualitative customer research synthesis gives 10x leverage on unstructured voice data',
        deepDive:
          'Product managers love talking to users but dread spending entire weekends tagging transcripts. LLMs excel at cross-interview clustering: recognizing that Customer A saying "it takes too many clicks" and Customer B saying "the navigation feels clunky" are reporting the same UX friction point.',
        keyAiLever: 'Qualitative Theme Clustering & Verbatim Evidence Attribution',
      },
      whyOthersLose: [
        {
          taskName: 'Calculating Feature RICE Priority Scores',
          reason: 'Pure arithmetic belongs in a spreadsheet formula. Using an LLM to multiply numbers is expensive, slow, and prone to precision errors.',
        },
        {
          taskName: 'Drafting Comprehensive PRD Acceptance Criteria',
          reason: 'Solid secondary assist, but the PM still needs to define the actual product behavior and business boundaries first.',
        },
      ],
      recommendedToolSpec: {
        appName: 'VoiceOfCustomer Opportunity Miner',
        tagline: 'Turn hours of messy user transcripts into prioritized problem themes and direct quote cards',
        coreWorkflowSteps: [
          'Upload raw Zoom/Gong transcript text',
          'Extract recurring friction points, workflow workarounds, and unmet needs',
          'Cluster by opportunity frequency and tag with verbatim customer quotes',
          'Export directly to product backlog / opportunity solution tree',
        ],
        suggestedPromptTemplate: `Analyze these customer interview transcripts. Group findings into: 1) Core Functional Blockers, 2) Workflow Workarounds users currently rely on, 3) High-impact feature desires with exact supporting quotes. Tag each theme with frequency count.`,
        safeguardsAndMitigations: [
          'Quote Verification: Every insight must anchor to a direct timestamped quote in the text.',
          'Quantified Frequency: State how many unique participants raised the issue.',
        ],
        expectedWeeklyHoursSaved: 5.0,
      },
    },
    sampleInput: `Customer Interview Notes - B2B Billing Portal Feedback:
- User 1 (Finance Director at TechCorp): "Every month our accounting team spends 3 hours downloading individual PDF invoices one by one. If we have 45 client accounts, we have to click into each account, open the tab, hit download, and rename the file. It's maddening. We just need a bulk download button or automated monthly ZIP file."
- User 2 (Controller at MediaHub): "The invoice search only lets us filter by date, but our clients always pay by purchase order number. When a check arrives with PO #8841, I have to open a dozen invoices manually to match the reference. It delays our reconciliation."
- User 3 (VP Operations at RetailWorks): "We love the dashboard graphs, but we can never give our external auditor temporary view-only access without exposing all our payment credentials. So I end up taking screenshots and emailing them."
- User 4 (Accounting Manager): "Same issue with downloading receipts in bulk. It's our number one pet peeve at month-end close."`,
    prototypeTitle: 'VoiceOfCustomer Opportunity Miner',
    prototypeDescription: 'Try this live prototype: paste customer feedback or call notes to extract prioritized themes and verbatim quotes.',
  },
  {
    id: 'engineering-lead',
    roleTitle: 'Engineering Lead',
    description: 'Managing technical architecture, pull request velocity, incident retrospectives, and code hygiene.',
    iconName: 'Terminal',
    tasks: [
      {
        id: 'eng-task-1',
        name: 'Drafting Incident Retrospectives & Root-Cause Summaries',
        description: 'Synthesizing chaotic Slack incident channels, PagerDuty alerts, and post-mortem logs into a blameless post-mortem report.',
        hoursPerWeek: 3.5,
        currentPain: 'Reconstructing the exact incident timeline from 200 Slack messages across multiple channels is painful and takes hours.',
        inputFormat: 'Slack incident war room logs and timestamped alerts',
        outputFormat: 'Chronological timeline, root cause breakdown, and action items',
      },
      {
        id: 'eng-task-2',
        name: 'Writing PR Descriptions & Architecture Decision Records (ADR)',
        description: 'Translating git diffs and code commit histories into clear change summaries and architecture decision context.',
        hoursPerWeek: 4.0,
        currentPain: 'Developers write "fixes bug" or leave empty PR descriptions, leaving reviewers without context.',
        inputFormat: 'Git diffs and commit messages',
        outputFormat: 'Structured PR summary, testing checklist, and architectural rationale',
      },
      {
        id: 'eng-task-3',
        name: 'Weekly On-Call Shift Scheduling & Rotation Swaps',
        description: 'Assigning engineers to on-call shifts while juggling PTO, holidays, and swap requests.',
        hoursPerWeek: 1.5,
        currentPain: 'Back-and-forth messages about who can cover weekend shifts when someone takes vacation.',
        inputFormat: 'Calendar PTO dates and rotation rules',
        outputFormat: 'Updated on-call calendar schedule',
      },
    ],
    evaluation: {
      winningTaskId: 'eng-task-1',
      winningTaskName: 'Drafting Incident Retrospectives & Root-Cause Summaries',
      verdictSummary:
        'Incident Retrospective Drafting is the highest-value AI opportunity. It requires ingesting messy, multi-party war-room chat logs and structuring them into a coherent chronological timeline with root-cause insights. PR description drafting is a close second, while on-call scheduling is a constraint satisfaction problem best handled by PagerDuty/Opsgenie rules.',
      taskEvaluations: [
        {
          taskId: 'eng-task-1',
          taskName: 'Drafting Incident Retrospectives & Root-Cause Summaries',
          overallFitScore: 91,
          fitVerdict: 'Prime AI Tool Candidate',
          scores: {
            unstructuredData: 9.6,
            synthesisReasoning: 9.3,
            generativeTolerance: 8.5,
            verificationSpeed: 8.8,
            deterministicFailure: 9.6,
            timeRoi: 9.0,
          },
          strengths: [
            'Converts chaotic Slack war-room chatter into a crisp chronological timeline.',
            'Identifies the trigger event, mitigation steps, and lingering follow-up action items.',
            'Enforces a healthy blameless tone automatically.',
          ],
          drawbacksOrRisks: [
            'Timestamps must be strictly verified against server logs before publication.',
          ],
          automationAlternative: 'Impossible with deterministic scripts due to fragmented conversational context.',
        },
        {
          taskId: 'eng-task-2',
          taskName: 'Writing PR Descriptions & Architecture Decision Records (ADR)',
          overallFitScore: 84,
          fitVerdict: 'Prime AI Tool Candidate',
          scores: {
            unstructuredData: 8.0,
            synthesisReasoning: 8.5,
            generativeTolerance: 8.2,
            verificationSpeed: 9.0,
            deterministicFailure: 8.5,
            timeRoi: 8.0,
          },
          strengths: [
            'Transforms git diffs into human-readable summaries and test checklists.',
            'Reviewers get instant context on why architectural changes were made.',
          ],
          drawbacksOrRisks: [
            'Needs access to local git diff or GitHub webhook.',
          ],
          automationAlternative: 'Manual author drafting.',
        },
        {
          taskId: 'eng-task-3',
          taskName: 'Weekly On-Call Shift Scheduling & Rotation Swaps',
          overallFitScore: 35,
          fitVerdict: 'Better for Deterministic Automation',
          scores: {
            unstructuredData: 3.0,
            synthesisReasoning: 4.0,
            generativeTolerance: 2.0,
            verificationSpeed: 8.0,
            deterministicFailure: 2.0,
            timeRoi: 4.0,
          },
          strengths: ['Can draft notification emails.'],
          drawbacksOrRisks: [
            'Scheduling conflicts are hard logic constraints. A single AI hallucination results in unmonitored production outages.',
          ],
          automationAlternative: 'PagerDuty native schedule override rules or calendar sync.',
        },
      ],
      whyWinnerWins: {
        headline: 'Incident timeline synthesis saves 3+ hours of high-stress retroactive forensic analysis',
        deepDive:
          'After an outage, engineering leads are exhausted. Reconstructing who noticed what at 03:14 AM, when the rollback was initiated, and what the root cause was from hundreds of fragmented Slack messages is painful cognitive overhead. An AI tool digests the war-room transcript, builds the exact incident chronology, highlights the contributing factors, and drafts the initial 5-Whys analysis in seconds.',
        keyAiLever: 'Multi-Stream Timeline Reconstruction & Blameless Synthesis',
      },
      whyOthersLose: [
        {
          taskName: 'Weekly On-Call Shift Scheduling & Rotation Swaps',
          reason: 'Hard mathematical constraint problem. If an LLM hallucinates an on-call slot, production alerts go unheeded. Dedicated tools like PagerDuty handle rotations deterministically with zero risk.',
        },
        {
          taskName: 'Writing PR Descriptions & Architecture Decision Records (ADR)',
          reason: 'A strong candidate, but incident post-mortems carry 3x more time savings and emotional relief after high-stress incidents.',
        },
      ],
      recommendedToolSpec: {
        appName: 'PostMortem Copilot',
        tagline: 'Transform chaotic incident Slack channels into publication-ready blameless post-mortems in 60 seconds',
        coreWorkflowSteps: [
          'Paste Slack incident war room log or transcript',
          'Model builds timestamped timeline: Detection -> Diagnosis -> Mitigation -> Resolution',
          'Extracts Root Cause hypothesis, Contributing Factors, and Follow-up Prevention Tickets',
          'Review, edit, and push to Confluence/Notion',
        ],
        suggestedPromptTemplate: `You are a Principal Reliability Engineer. Review the following incident room transcript. Produce a blameless post-mortem report containing: 1) Incident Summary & Severity, 2) Timestamped Timeline of Key Events, 3) Primary Root Cause & Trigger, 4) What Went Well vs Where We Got Lucky, 5) Action Items with Owners.`,
        safeguardsAndMitigations: [
          'Chronology Lock: Never reorder events out of timestamp sequence.',
          'Blameless Language Filter: Replace personal accusatory phrasing with systemic/procedural safeguards.',
        ],
        expectedWeeklyHoursSaved: 3.5,
      },
    },
    sampleInput: `Incident War Room Transcript - Service Outage [INC-921]:
[14:02:11] CloudWatchBot: ALERT - API Gateway 5xx rate exceeded 12% in us-east-1.
[14:03:45] Jake (DevOps): Looking into this now. Seeing high CPU spikes on auth-service cluster.
[14:05:20] Elena (Backend): Did anyone deploy recently?
[14:06:05] Marcus (Platform): Yes, we just merged PR #1142 updating Redis connection pool configuration 10 minutes ago.
[14:07:30] Jake: The Redis pods are crash-looping with connection timeout errors. Traffic is failing open and overwhelming fallback auth DB.
[14:08:45] Elena: I am initiating immediate rollback of PR #1142 in staging first.
[14:10:12] Marcus: Staging rollback passed. Deploying rollback commit to production cluster now.
[14:13:22] Jake: Production rollback deployment complete. Redis pods stabilizing. 5xx rate dropping to 0.4%.
[14:15:00] Elena: All health checks green. Customer impact: ~11 minutes of degraded login and checkout sessions.
[14:16:30] Jake: Need to add automated connection pool stress testing to CI pipeline so this never reaches prod.`,
    prototypeTitle: 'PostMortem Copilot',
    prototypeDescription: 'Try this live prototype: paste an incident log to generate a clean blameless retrospective and timeline.',
  },
  {
    id: 'customer-support',
    roleTitle: 'Customer Support Lead',
    description: 'Managing customer escalations, response SLAs, satisfaction scores, and support knowledge bases.',
    iconName: 'Headphones',
    tasks: [
      {
        id: 'cs-task-1',
        name: 'Synthesizing Angry Customer Escalations & Drafting Personalized De-escalation Replies',
        description: 'Analyzing multi-paragraph upset customer emails with complex billing/service histories to draft calm, empathetic, solution-oriented replies.',
        hoursPerWeek: 5.5,
        currentPain: 'High emotional fatigue; taking 20 minutes per email to research history and balance empathy with company policy.',
        inputFormat: 'Long customer complaint emails and account logs',
        outputFormat: 'Empathetic de-escalation response with verified policy concessions',
      },
      {
        id: 'cs-task-2',
        name: 'Auto-Tagging Support Tickets by Product Category',
        description: 'Classifying incoming tickets into billing, bug, feature request, or account setup.',
        hoursPerWeek: 3.0,
        currentPain: 'Agents forget to tag tickets, skewing analytics and reporting.',
        inputFormat: 'Short ticket subject and first message',
        outputFormat: 'Category tag name',
      },
      {
        id: 'cs-task-3',
        name: 'Calculating Weekly SLA First-Response Times',
        description: 'Exporting CSV ticket logs and computing median time-to-first-response for the executive dashboard.',
        hoursPerWeek: 2.0,
        currentPain: 'Manually filtering business hours vs weekends in Excel formulas.',
        inputFormat: 'CSV ticket export',
        outputFormat: 'SLA percentage table',
      },
    ],
    evaluation: {
      winningTaskId: 'cs-task-1',
      winningTaskName: 'Synthesizing Angry Customer Escalations & Drafting Personalized De-escalation Replies',
      verdictSummary:
        'Personalized De-escalation Drafting is the prime AI tool opportunity. It transforms high-stress, emotionally draining text into empathetic, calibrated solutions while preserving agent energy. SLA calculations are pure spreadsheet math, and basic ticket tagging can be done by simple keyword classifiers.',
      taskEvaluations: [
        {
          taskId: 'cs-task-1',
          taskName: 'Synthesizing Angry Customer Escalations & Drafting Personalized De-escalation Replies',
          overallFitScore: 93,
          fitVerdict: 'Prime AI Tool Candidate',
          scores: {
            unstructuredData: 9.5,
            synthesisReasoning: 9.4,
            generativeTolerance: 8.8,
            verificationSpeed: 9.2,
            deterministicFailure: 9.7,
            timeRoi: 9.4,
          },
          strengths: [
            'Directly reduces support agent burnout and emotional fatigue.',
            'Synthesizes multifaceted grievances (e.g. billing bug + delayed shipment + rude agent) into structured, step-by-step remedies.',
            'Maintains flawless brand tone and de-escalation psychology without getting defensive.',
          ],
          drawbacksOrRisks: [
            'Agent must always review before sending to verify financial refund promises.',
          ],
          automationAlternative: 'Standard canned macros feel cold and make upset customers even angrier.',
        },
        {
          taskId: 'cs-task-2',
          taskName: 'Auto-Tagging Support Tickets by Product Category',
          overallFitScore: 68,
          fitVerdict: 'Moderate AI Assist',
          scores: {
            unstructuredData: 5.0,
            synthesisReasoning: 6.0,
            generativeTolerance: 7.0,
            verificationSpeed: 8.0,
            deterministicFailure: 5.0,
            timeRoi: 5.5,
          },
          strengths: ['Handles ambiguous queries with semantic understanding.'],
          drawbacksOrRisks: ['Native Zendesk/Freshdesk ML tools already do this out of the box.'],
          automationAlternative: 'Zendesk built-in AI triage or rule-based keyword match.',
        },
        {
          taskId: 'cs-task-3',
          taskName: 'Calculating Weekly SLA First-Response Times',
          overallFitScore: 28,
          fitVerdict: 'Better for Deterministic Automation',
          scores: {
            unstructuredData: 1.5,
            synthesisReasoning: 2.0,
            generativeTolerance: 2.0,
            verificationSpeed: 9.0,
            deterministicFailure: 1.0,
            timeRoi: 3.0,
          },
          strengths: ['None for generative AI.'],
          drawbacksOrRisks: ['High risk of arithmetic hallucination; spreadsheets or native analytics do this instantly.'],
          automationAlternative: 'Native helpdesk reporting dashboard or SQL query.',
        },
      ],
      whyWinnerWins: {
        headline: 'Emotional de-escalation drafting removes human cognitive drain and preserves agent retention',
        deepDive:
          'Reading angry, hostile emails takes a severe psychological toll on support leads. A de-escalation AI assistant reads the angry customer email, separates the raw emotion from the substantive facts, and generates a warm, empathetic, solutions-oriented draft that addresses each concern point-by-point. The lead spends 30 seconds reviewing and approving the draft instead of 20 minutes stewing in stress.',
        keyAiLever: 'Tone Modulation, Conflict De-escalation & Multi-Point Grievance Extraction',
      },
      whyOthersLose: [
        {
          taskName: 'Calculating Weekly SLA First-Response Times',
          reason: 'Calculating time intervals is a mathematical database query. LLMs should never be used for date-math aggregations when native BI tools calculate it with zero error.',
        },
        {
          taskName: 'Auto-Tagging Support Tickets by Product Category',
          reason: 'Most modern helpdesks have built-in classification models; building a custom tool yields marginal improvement compared to high-friction email drafting.',
        },
      ],
      recommendedToolSpec: {
        appName: 'DeEscalate Empathy Assistant',
        tagline: 'Turn vitriolic customer complaints into calm, customer-retaining resolutions in 30 seconds',
        coreWorkflowSteps: [
          'Paste customer complaint and account tenure/history',
          'Tool extracts: 1) Underlying pain points, 2) Eligible policy concessions, 3) Recommended tone',
          'Generates high-empathy response draft with clear solution steps',
          'One-click agent review, tweak, and send',
        ],
        suggestedPromptTemplate: `You are an empathetic Head of Customer Experience. Read this escalated customer message. Draft a warm, reassuring, highly professional reply that: 1) Validates their frustration without sounding defensive, 2) Summarizes our understanding of what went wrong, 3) Outlines concrete corrective actions, 4) Offers a clear path forward.`,
        safeguardsAndMitigations: [
          'Policy Guardrail: Never promise refunds over $100 without an explicit manager approval badge.',
          'No AI Bot Disclosure Trap: Writes authentically from a human agent persona.',
        ],
        expectedWeeklyHoursSaved: 5.0,
      },
    },
    sampleInput: `Escalated Customer Message - Account #88192:
"I have been a loyal customer for 4 years and I am absolutely disgusted with how your company handled our billing migration. On Tuesday your system charged our business credit card THREE TIMES for the same enterprise annual plan ($4,500 x 3 = $13,500). This triggered a fraud freeze from Chase on our primary business card, which subsequently declined our payroll software charge yesterday morning! 

I spent 2 hours on hold with your chat support yesterday and an agent named "Sam" told me it would take 7-10 business days to reverse the duplicate charges and offered me a generic $25 credit. This is unacceptable. Our payroll was delayed by 6 hours because of your double billing. 

If this $9,000 duplicate charge is not reversed immediately today and if I don't get a proper explanation from someone who actually cares, I will be canceling all 85 seats across our organization and taking our story to LinkedIn."`,
    prototypeTitle: 'DeEscalate Empathy Assistant',
    prototypeDescription: 'Try this live prototype: paste an escalated customer complaint to generate a calm, de-escalating response.',
  },
];
