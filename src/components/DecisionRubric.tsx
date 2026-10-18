import React, { useState } from 'react';
import { Sliders, HelpCircle, CheckCircle, ShieldAlert, ArrowRight } from 'lucide-react';

export const DecisionRubric: React.FC = () => {
  // Interactive Simulator State
  const [unstructuredLevel, setUnstructuredLevel] = useState(8);
  const [synthesisNeed, setSynthesisNeed] = useState(9);
  const [errorTolerance, setErrorTolerance] = useState(8);
  const [reviewSeconds, setReviewSeconds] = useState(30);
  const [deterministicSuitability, setDeterministicSuitability] = useState(2); // 1 = can't do with rules, 10 = simple zapier

  // Compute live score
  // High review seconds hurts score (> 120s is bad)
  const reviewScore = Math.max(1, 10 - Math.min(9, Math.floor(reviewSeconds / 15)));
  // High deterministic suitability means zapier is better, so AI score is penalized
  const zapierPenalty = (10 - deterministicSuitability);
  const rawScore = Math.round(
    (unstructuredLevel * 0.25 +
      synthesisNeed * 0.25 +
      errorTolerance * 0.2 +
      reviewScore * 0.15 +
      zapierPenalty * 0.15) *
      10
  );
  const simScore = Math.min(100, Math.max(10, rawScore));

  let simVerdict = 'Prime AI Tool Candidate';
  let simAdvice =
    'This workflow is ideal for generative AI. It involves complex unstructured context, high error tolerance, and rapid human verification.';
  let simBadgeColor = 'text-emerald-700';

  if (deterministicSuitability >= 7) {
    simVerdict = 'Better for Deterministic Automation';
    simAdvice =
      'Hold on! This workflow has rigid rules. Build a webhook, Zapier zap, or database trigger instead. It will be 100% reliable at $0 token cost.';
    simBadgeColor = 'text-indigo-700';
  } else if (errorTolerance <= 3) {
    simVerdict = 'Keep Human-Led (High Risk)';
    simAdvice =
      'Zero tolerance for error. If the AI hallucinates, the blast radius is severe (financial loss, broken sprint commitments). Keep humans in the primary driver seat.';
    simBadgeColor = 'text-rose-700';
  } else if (simScore < 60) {
    simVerdict = 'Marginal / Moderate AI Assist';
    simAdvice =
      'The time spent auditing and prompting will be close to the time required to complete the task manually. Consider partial AI assistance rather than an automated tool.';
    simBadgeColor = 'text-amber-700';
  }

  return (
    <div className="space-y-10">
      {/* 1. The 5 Core Principles of AI Task Fitness */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-2">
          <span>THE DECISION FRAMEWORK</span>
          <span aria-hidden="true">·</span>
          <span>HOW TO EVALUATE RECURRING TASKS FOR AI</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-2 text-balance">
          The 5 Laws of High-Leverage AI Workflow Tools
        </h2>
        <p className="text-sm text-slate-600 max-w-3xl mb-8 leading-relaxed">
          Before writing code or prompts, apply these 5 architectural filters to distinguish true 10x AI opportunities
          from costly AI anti-patterns.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Law 1 */}
          <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400">LAW 01</span>
              <h3 className="text-sm font-bold text-slate-900">
                The Verification Asymmetry
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong className="text-slate-800">T_verify &lt;&lt; T_manual.</strong> The task is only viable if a human can review and validate the output in under 45 seconds. If auditing the AI requires re-checking raw databases from scratch, verification friction wipes out the time savings.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-200 mt-4 text-xs font-medium text-slate-500">
              Good: Executive briefs · Bad: Math auditing
            </div>
          </div>

          {/* Law 2 */}
          <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400">LAW 02</span>
              <h3 className="text-sm font-bold text-slate-900">
                The Deterministic Filter (Zapier Test)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Never use an LLM for what an <code className="text-slate-800 bg-slate-200 px-1 py-0.5 rounded text-[11px]">if-else</code> script or webhook can do. If a task can be solved with boolean triggers (e.g., ticket overdue reminders), deterministic scripts provide 100% reliability with zero hallucinations and zero token cost.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-200 mt-4 text-xs font-medium text-slate-500">
              Good: Semantic summarization · Bad: Scheduled cron DMs
            </div>
          </div>

          {/* Law 3 */}
          <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400">LAW 03</span>
              <h3 className="text-sm font-bold text-slate-900">
                The Generative Tolerance Spectrum
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Does natural phrasing variation hurt or help? Tasks where there are many equally valid ways to synthesize information (e.g. leadership summaries, customer replies) thrive with AI. Tasks with zero tolerance for variance (e.g. sprint points, payroll) fail.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-200 mt-4 text-xs font-medium text-slate-500">
              Good: De-escalation drafts · Bad: Story point sizing
            </div>
          </div>

          {/* Law 4 */}
          <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400">LAW 04</span>
              <h3 className="text-sm font-bold text-slate-900">
                Unstructured Signal Extraction
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                AI creates the greatest multiplier when digesting chaotic, human-authored text: 30 Slack threads, rambling voice transcripts, or disparate status notes. If the input is already clean SQL or CSV numbers, standard software wins.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-200 mt-4 text-xs font-medium text-slate-500">
              Good: Multi-channel chat logs · Bad: Spreadsheet rows
            </div>
          </div>

          {/* Law 5 */}
          <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400">LAW 05</span>
              <h3 className="text-sm font-bold text-slate-900">
                Cognitive Fatigue Relief
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Prioritize tasks that drain human willpower. Spending 3 hours every Friday afternoon reformatting updates or reading angry customer emails exhausts professionals. Relieving this cognitive tax preserves high-level strategic energy.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-200 mt-4 text-xs font-medium text-slate-500">
              Good: Friday status synthesis · Bad: Minor routine forms
            </div>
          </div>

          {/* Law 6 */}
          <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400">LAW 06</span>
              <h3 className="text-sm font-bold text-slate-900">
                Human-in-the-Loop Architecture
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Never build autonomous fire-and-forget loops for high-stakes workflows. The winning architecture is always: <strong className="text-slate-800">AI Drafts → Human Polishes in 30 Seconds → System Dispatches</strong>. This guarantees 100% accountability.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-200 mt-4 text-xs font-medium text-slate-500">
              Good: Review & approve gate · Bad: Auto-sending unreviewed briefs
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive AI Task Feasibility Simulator */}
      <section className="bg-slate-50 border border-slate-200 rounded-2xl p-6 lg:p-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-2">
          <span>INTERACTIVE RUBRIC SIMULATOR</span>
          <span aria-hidden="true">·</span>
          <span>TEST YOUR OWN WORKFLOW CRITERIA</span>
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          Interactive AI Fit Scoring Calculator
        </h3>
        <p className="text-xs text-slate-600 max-w-2xl mb-6">
          Adjust the parameters of your specific recurring task below to simulate whether an AI tool or alternative automation makes the most sense.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sliders (7 cols) */}
          <div className="lg:col-span-7 space-y-5 bg-white border border-slate-200 rounded-xl p-5">
            {/* Input Unstructuredness */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Input Chaos & Unstructured Text:</span>
                <span className="font-mono text-slate-900 tabular-nums">{unstructuredLevel}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={unstructuredLevel}
                onChange={(e) => setUnstructuredLevel(parseInt(e.target.value))}
                className="w-full accent-slate-900 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-0.5">
                <span>Clean database / CSV numbers</span>
                <span>Messy Slack, voice notes, emails</span>
              </div>
            </div>

            {/* Synthesis Need */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Need for Qualitative Synthesis & Reasoning:</span>
                <span className="font-mono text-slate-900 tabular-nums">{synthesisNeed}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={synthesisNeed}
                onChange={(e) => setSynthesisNeed(parseInt(e.target.value))}
                className="w-full accent-slate-900 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-0.5">
                <span>Copy-pasting literal fields</span>
                <span>Extracting blockers, gist & priorities</span>
              </div>
            </div>

            {/* Error Tolerance */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Tolerance for Natural Phrasing / Nuance:</span>
                <span className="font-mono text-slate-900 tabular-nums">{errorTolerance}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={errorTolerance}
                onChange={(e) => setErrorTolerance(parseInt(e.target.value))}
                className="w-full accent-slate-900 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-0.5">
                <span>Zero tolerance (Math/Ledger)</span>
                <span>High tolerance (Executive summaries)</span>
              </div>
            </div>

            {/* Verification Seconds */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Human Verification Audit Time:</span>
                <span className="font-mono text-slate-900 tabular-nums">{reviewSeconds} seconds</span>
              </div>
              <input
                type="range"
                min="10"
                max="300"
                step="10"
                value={reviewSeconds}
                onChange={(e) => setReviewSeconds(parseInt(e.target.value))}
                className="w-full accent-slate-900 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-0.5">
                <span>Quick glance (10s)</span>
                <span>Deep audit (&gt; 3 mins)</span>
              </div>
            </div>

            {/* Deterministic Suitability */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Could this be solved by a Zapier / Jira boolean rule?</span>
                <span className="font-mono text-slate-900 tabular-nums">{deterministicSuitability}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={deterministicSuitability}
                onChange={(e) => setDeterministicSuitability(parseInt(e.target.value))}
                className="w-full accent-slate-900 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-0.5">
                <span>Impossible with rules</span>
                <span>Trivial with simple triggers</span>
              </div>
            </div>
          </div>

          {/* Simulator Outcome Card (5 cols) */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="text-xs font-bold text-slate-400">
              SIMULATED AI FIT SCORE
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-extrabold tracking-tight text-slate-900 font-mono tabular-nums">
                {simScore}%
              </span>
              <span className={`text-xs ${simBadgeColor}`}>
                {simVerdict}
              </span>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 leading-relaxed">
              {simAdvice}
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span>Verification Ratio:</span>
                <span className="font-mono font-medium text-slate-900 tabular-nums">
                  {reviewSeconds < 60 ? 'Optimal (< 1m)' : 'Friction Warning'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Recommended Stack:</span>
                <span className="font-semibold text-slate-800">
                  {deterministicSuitability >= 7
                    ? 'Zapier / Webhook / DB Trigger'
                    : errorTolerance <= 3
                    ? 'Human Driver + Formula'
                    : 'Gemini 3.8 Flash + Review UI'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
