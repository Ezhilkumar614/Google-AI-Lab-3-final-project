import React from 'react';
import { EvaluationResult, TaskEvaluation } from '../types';
import {
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Clock,
  Layers,
  CheckCircle,
  HelpCircle,
  Play,
  Cpu,
} from 'lucide-react';

interface EvaluationSummaryProps {
  evaluation: EvaluationResult;
  onLaunchPrototype: () => void;
  onViewSpec: () => void;
}

export const EvaluationSummary: React.FC<EvaluationSummaryProps> = ({
  evaluation,
  onLaunchPrototype,
  onViewSpec,
}) => {
  const winnerTask = evaluation.taskEvaluations.find(
    (t) => t.taskId === evaluation.winningTaskId
  ) || evaluation.taskEvaluations[0];

  const getVerdictStyle = (verdict: string) => {
    switch (verdict) {
      case 'Prime AI Tool Candidate':
        return 'text-emerald-700 font-semibold';
      case 'Moderate AI Assist':
        return 'text-amber-700 font-semibold';
      case 'Better for Deterministic Automation':
        return 'text-indigo-700 font-semibold';
      case 'Keep Human-Led':
      default:
        return 'text-slate-600 font-semibold';
    }
  };

  return (
    <div className="space-y-10">
      {/* 1. Clear Winner Spotlight Header */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-2">
          <span>AI FIT EVALUATION RESULT</span>
          <span aria-hidden="true">·</span>
          <span>BEST FIT IDENTIFIED</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="space-y-2 max-w-3xl">
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 text-balance">
              {evaluation.winningTaskName}
            </h2>
            <p className="text-sm lg:text-base text-slate-700 leading-relaxed">
              {evaluation.verdictSummary}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <button
              onClick={onLaunchPrototype}
              className="flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors shadow-xs whitespace-nowrap"
            >
              <Play className="w-3.5 h-3.5" />
              Try Live Prototype
            </button>
            <button
              onClick={onViewSpec}
              className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors whitespace-nowrap"
            >
              <Cpu className="w-3.5 h-3.5" />
              View Architecture Spec
            </button>
          </div>
        </div>

        {/* Why Winner Wins Deep-Dive */}
        <div className="pt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <Sparkles className="w-4 h-4 text-slate-900" />
              <span>WHY THIS TASK IS THE BEST FIT FOR AN AI TOOL</span>
            </div>
            <h3 className="text-base font-semibold text-slate-900">
              {evaluation.whyWinnerWins.headline}
            </h3>
            <p className="text-xs lg:text-sm text-slate-600 leading-relaxed">
              {evaluation.whyWinnerWins.deepDive}
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Primary AI Leverage:</span>
              <span>{evaluation.whyWinnerWins.keyAiLever}</span>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-500 mb-1">
                EXPECTED AUTOMATION IMPACT
              </div>
              <div className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
                ~{evaluation.recommendedToolSpec.expectedWeeklyHoursSaved} hrs / week
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Saved in context-switching, text formatting, and information routing.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-600 space-y-1">
              <div className="flex items-center justify-between">
                <span>Human Review Time:</span>
                <span className="font-mono font-medium text-slate-900">&lt; 45 seconds</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Verification Risk:</span>
                <span className="font-medium text-emerald-700">Low (Near-Zero Blast Radius)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Side-by-Side Comparative Evaluation Matrix */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
              <span>COMPARATIVE SCORING MATRIX</span>
              <span aria-hidden="true">·</span>
              <span>6-DIMENSION BREAKDOWN</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Side-by-Side Task Feasibility & ROI
            </h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75">
                <th className="py-3 px-4 font-semibold text-slate-900">Task Name</th>
                <th className="py-3 px-4 font-semibold text-slate-900">Automation Tier</th>
                <th className="py-3 px-3 font-semibold text-slate-900 text-right">Fit Score</th>
                <th className="py-3 px-3 font-semibold text-slate-600 text-right" title="Messy text vs structured DB">Unstructured</th>
                <th className="py-3 px-3 font-semibold text-slate-600 text-right" title="Extracting gist, blockers, themes">Reasoning</th>
                <th className="py-3 px-3 font-semibold text-slate-600 text-right" title="Tolerance for generative variance">Tolerance</th>
                <th className="py-3 px-3 font-semibold text-slate-600 text-right" title="How quickly human can audit">Review Speed</th>
                <th className="py-3 px-3 font-semibold text-slate-600 text-right" title="Zapier/rule inadequacy">Rule Gap</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {evaluation.taskEvaluations.map((task) => {
                const isWinner = task.taskId === evaluation.winningTaskId;
                return (
                  <tr
                    key={task.taskId}
                    className={`transition-colors hover:bg-slate-50/60 ${
                      isWinner ? 'bg-emerald-50/20 font-medium' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 text-slate-900">
                      <div className="flex items-center gap-2">
                        {isWinner && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" aria-label="Winner" />
                        )}
                        <span className="font-semibold">{task.taskName}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={getVerdictStyle(task.fitVerdict)}>
                        {task.fitVerdict}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                      {task.overallFitScore}%
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-slate-600 tabular-nums">
                      {task.scores.unstructuredData}/10
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-slate-600 tabular-nums">
                      {task.scores.synthesisReasoning}/10
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-slate-600 tabular-nums">
                      {task.scores.generativeTolerance}/10
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-slate-600 tabular-nums">
                      {task.scores.verificationSpeed}/10
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-slate-600 tabular-nums">
                      {task.scores.deterministicFailure}/10
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span>Scale: 0 to 10 points per dimension · Calibrated against human cognitive workload</span>
          <span className="tabular-nums">Scored with Gemini Reasoning Engine</span>
        </div>
      </section>

      {/* 3. Why the Other Tasks Are Weaker Fits */}
      {evaluation.whyOthersLose.length > 0 && (
        <section className="bg-slate-50 border border-slate-200 rounded-2xl p-6 lg:p-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-2">
            <span>COMPARATIVE TRADE-OFF ANALYSIS</span>
            <span aria-hidden="true">·</span>
            <span>WHY THE OTHER TASKS RANK LOWER</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            Understanding the Failure Modes of the Alternate Tasks
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {evaluation.whyOthersLose.map((other, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-xl p-4 space-y-2"
              >
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                  <span>{other.taskName}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {other.reason}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. Winning Tool Concept Teaser */}
      <section className="bg-slate-900 text-white rounded-2xl p-6 lg:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>RECOMMENDED SOLUTION BLUEPRINT</span>
            <span aria-hidden="true">·</span>
            <span>{evaluation.recommendedToolSpec.appName}</span>
          </div>
          <h3 className="text-xl font-bold tracking-tight text-white">
            {evaluation.recommendedToolSpec.tagline}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            The ideal tool architecture ingests raw notes, isolates blockers, drafts 3 audience-specific summaries,
            and provides a one-click human verification screen before export.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onLaunchPrototype}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-xl transition-colors whitespace-nowrap"
          >
            <Play className="w-3.5 h-3.5" />
            Launch Live Interactive Prototype
          </button>
        </div>
      </section>
    </div>
  );
};
