import React, { useState } from 'react';
import { EvaluationResult } from '../types';
import { Copy, Check, Download, Layers, ShieldCheck, Terminal, Cpu } from 'lucide-react';

interface ArchitectureSpecProps {
  evaluation: EvaluationResult;
}

export const ArchitectureSpec: React.FC<ArchitectureSpecProps> = ({ evaluation }) => {
  const [hasCopiedPrompt, setHasCopiedPrompt] = useState(false);
  const spec = evaluation.recommendedToolSpec;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(spec.suggestedPromptTemplate);
    setHasCopiedPrompt(true);
    setTimeout(() => setHasCopiedPrompt(false), 2000);
  };

  const handleDownloadSpec = () => {
    const markdownContent = `# Product Requirements Document (PRD) & Architecture Blueprint
# App Name: ${spec.appName}
**Tagline**: ${spec.tagline}
**Evaluated Role**: Professional Workflow Automation
**Target Task**: ${evaluation.winningTaskName}
**Expected Weekly Time Saved**: ~${spec.expectedWeeklyHoursSaved} hours/week

---

## 1. Executive Summary & Problem Statement
${evaluation.verdictSummary}

### Why This Task is the Optimal AI Target
${evaluation.whyWinnerWins.deepDive}

---

## 2. Recommended System Architecture

\`\`\`
+-------------------------------------------------------------+
| 1. DATA INGESTION LAYER                                     |
|    - Slack App API (Events & Thread History)                |
|    - Jira REST API (Sprint changelogs, blocker comments)    |
|    - Manual Paste / Webhook Input                           |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
| 2. CONTEXT PREPARATION & NORMALIZATION                      |
|    - Strip bot noise, duplicate greetings, reaction spam     |
|    - Group updates by contributor / workstream               |
|    - Inject project baseline milestones & OKRs              |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
| 3. REASONING & EXTRACTION ENGINE (Gemini 3.8 Flash)         |
|    - Extract Health status (Green / Amber / Red)            |
|    - Detect active blockers and mitigation owners           |
|    - Synthesize cross-cutting risks                         |
|    - Generate persona-tailored drafts (C-Suite vs Team)     |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
| 4. HUMAN-IN-THE-LOOP APPROVAL GATE                          |
|    - Single-screen 30-second review & edit UI               |
|    - Visual blocker verification flags                      |
|    - One-click approval                                     |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
| 5. DISPATCH & SYNC                                          |
|    - Post to #leadership-briefing Slack channel             |
|    - Update Notion / Confluence sprint page                 |
|    - Send Executive Email Digest                            |
+-------------------------------------------------------------+
\`\`\`

---

## 3. Production System Prompt Template
\`\`\`
${spec.suggestedPromptTemplate}
\`\`\`

---

## 4. Safeguards & Hallucination Mitigations
${spec.safeguardsAndMitigations.map((s, idx) => `${idx + 1}. ${s}`).join('\n')}

---

## 5. Implementation Roadmap
${spec.coreWorkflowSteps.map((step, idx) => `Step ${idx + 1}: ${step}`).join('\n')}
`;

    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${spec.appName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-prd-spec.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Overview Card */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
          <span>ENGINEERING BLUEPRINT</span>
          <span aria-hidden="true">·</span>
          <span>HOW TO BUILD THIS APP</span>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              {spec.appName} Blueprint
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              {spec.tagline}. Follow this reference architecture to turn this evaluation into a production application.
            </p>
          </div>
          <button
            onClick={handleDownloadSpec}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            Download Complete PRD (.md)
          </button>
        </div>

        {/* Core Workflow Steps */}
        <div className="pt-6">
          <h3 className="text-sm font-bold text-slate-900 mb-4">
            Core Workflow Pipeline Steps
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {spec.coreWorkflowSteps.map((step, idx) => (
              <div
                key={idx}
                className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-slate-400 mb-1 block">
                    STAGE 0{idx + 1}
                  </span>
                  <p className="text-xs font-semibold text-slate-800 leading-relaxed">
                    {step}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Production Prompt Starter Kit */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
              <span>SYSTEM PROMPT STARTER KIT</span>
              <span aria-hidden="true">·</span>
              <span>CALIBRATED FOR GEMINI 3.8 FLASH</span>
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Production System Instruction
            </h3>
          </div>
          <button
            onClick={handleCopyPrompt}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            {hasCopiedPrompt ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy Prompt
              </>
            )}
          </button>
        </div>

        <div className="bg-slate-900 text-slate-100 p-4 rounded-xl text-xs font-mono leading-relaxed overflow-x-auto">
          {spec.suggestedPromptTemplate}
        </div>
      </section>

      {/* Safeguards & Mitigations */}
      <section className="bg-slate-50 border border-slate-200 rounded-2xl p-6 lg:p-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
          <span>RELIABILITY SAFEGUARDS</span>
          <span aria-hidden="true">·</span>
          <span>PREVENTING HALLUCINATIONS</span>
        </div>
        <h3 className="text-base font-bold text-slate-900 mb-4">
          Crucial Guardrails for Production Deployment
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {spec.safeguardsAndMitigations.map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-xl p-4 space-y-2"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Guardrail 0{idx + 1}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {item}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
