import React, { useState } from 'react';
import { WorkflowGoal, WorkflowTask, RatingLevel } from '../types';
import {
  Sparkles,
  Plus,
  Trash2,
  RefreshCw,
  Play,
  Download,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  Layers,
  FileSpreadsheet,
} from 'lucide-react';

interface WorkflowWorksheetProps {
  goals: WorkflowGoal[];
  onUpdateGoals: (goals: WorkflowGoal[]) => void;
  onLaunchPrototype: (taskTitle: string) => void;
}

export const WorkflowWorksheet: React.FC<WorkflowWorksheetProps> = ({
  goals,
  onUpdateGoals,
  onLaunchPrototype,
}) => {
  const [activeStep, setActiveStep] = useState<number>(5);
  const [decomposingGoalId, setDecomposingGoalId] = useState<string | null>(null);

  // Helper to re-score a task based on the Step 4 & 5 rubric
  const scoreTask = (
    timeSpent: RatingLevel,
    frequency: RatingLevel,
    repetitiveness: RatingLevel,
    taskTitle: string,
    allTasks: WorkflowTask[]
  ) => {
    let score = 0;
    // Time Spent
    if (timeSpent === 'High') score += 35;
    else if (timeSpent === 'Medium') score += 20;
    else score += 10;

    // Frequency
    if (frequency === 'High') score += 35;
    else if (frequency === 'Medium') score += 20;
    else score += 10;

    // Repetitiveness
    if (repetitiveness === 'High') score += 30;
    else if (repetitiveness === 'Medium') score += 20;
    else score += 10;

    // Cross-goal presence check
    const normalized = taskTitle.toLowerCase();
    const appearsInMultipleGoals =
      allTasks.filter(
        (t) =>
          t.taskTitle.toLowerCase().includes('synthesiz') ||
          t.taskTitle.toLowerCase().includes('report') ||
          t.taskTitle.toLowerCase().includes('update') ||
          t.taskTitle.toLowerCase().includes('status') ||
          t.taskTitle.toLowerCase().includes('blocker')
      ).length >= 2;

    const isSynthesis =
      normalized.includes('synthesiz') ||
      normalized.includes('summary') ||
      normalized.includes('draft') ||
      normalized.includes('brief') ||
      normalized.includes('blocker');

    const isReminderPing =
      normalized.includes('ping') ||
      normalized.includes('remind') ||
      normalized.includes('overdue');

    let isCandidate = false;
    let recommendationType: 'Build AI App' | 'Use One-Off Prompt' | 'Deterministic Rule' | 'Keep Human-Led' =
      'Use One-Off Prompt';
    let recommendationReason = 'Consider prompting Gemini directly when this task arises.';

    if (isReminderPing) {
      recommendationType = 'Deterministic Rule';
      recommendationReason =
        'Boolean condition (dueDate < today). Best built as a native Jira/Zapier automation rule with 100% reliability and $0 LLM cost.';
    } else if (score >= 80 && isSynthesis) {
      isCandidate = true;
      recommendationType = 'Build AI App';
      recommendationReason =
        'Rates High across Time, Frequency, and Repetitiveness. Prime candidate for a dedicated AI app with recurring ROI.';
    } else if (score >= 70 && repetitiveness === 'High') {
      isCandidate = true;
      recommendationType = 'Build AI App';
      recommendationReason =
        'High repetitiveness with predictable inputs. A tailored app saves context-switching time.';
    } else if (frequency === 'Low') {
      recommendationType = 'Use One-Off Prompt';
      recommendationReason =
        'Occurs rarely. Building a standalone app is overkill; use Gemini chat prompts when needed.';
    } else {
      recommendationType = 'Use One-Off Prompt';
      recommendationReason = 'Flexible one-off Gemini prompts provide the right balance of effort vs reward.';
    }

    return {
      appSuitabilityScore: score,
      isAppCandidate: isCandidate,
      recommendationType,
      recommendationReason,
    };
  };

  const allTasksList = goals.flatMap((g) => g.tasks);

  const handleRatingChange = (
    goalIndex: number,
    taskIndex: number,
    field: 'timeSpent' | 'frequency' | 'repetitiveness',
    value: RatingLevel
  ) => {
    const updatedGoals = [...goals];
    const targetTask = updatedGoals[goalIndex].tasks[taskIndex];
    const updatedTask = {
      ...targetTask,
      [field]: value,
    };

    const scoring = scoreTask(
      field === 'timeSpent' ? value : targetTask.timeSpent,
      field === 'frequency' ? value : targetTask.frequency,
      field === 'repetitiveness' ? value : targetTask.repetitiveness,
      targetTask.taskTitle,
      allTasksList
    );

    updatedGoals[goalIndex].tasks[taskIndex] = {
      ...updatedTask,
      ...scoring,
    };

    onUpdateGoals(updatedGoals);
  };

  const handleUpdateTaskField = (
    goalIndex: number,
    taskIndex: number,
    field: 'taskTitle' | 'howAiHelps',
    value: string
  ) => {
    const updatedGoals = [...goals];
    updatedGoals[goalIndex].tasks[taskIndex][field] = value;
    onUpdateGoals(updatedGoals);
  };

  const handleUpdateGoalTitle = (goalIndex: number, newTitle: string) => {
    const updatedGoals = [...goals];
    updatedGoals[goalIndex].title = newTitle;
    onUpdateGoals(updatedGoals);
  };

  const handleAddTask = (goalIndex: number) => {
    const updatedGoals = [...goals];
    const targetGoal = updatedGoals[goalIndex];
    const newTask: WorkflowTask = {
      id: `task-${Date.now()}`,
      goalId: targetGoal.id,
      goalTitle: targetGoal.title,
      taskTitle: 'New tactical step',
      howAiHelps: 'Describe how Gemini or AI can accelerate this step...',
      timeSpent: 'Medium',
      frequency: 'Medium',
      repetitiveness: 'Medium',
      isAppCandidate: false,
      appSuitabilityScore: 60,
      recommendationType: 'Use One-Off Prompt',
      recommendationReason: 'Evaluate attributes to determine if an app is warranted.',
    };
    targetGoal.tasks.push(newTask);
    onUpdateGoals(updatedGoals);
  };

  const handleRemoveTask = (goalIndex: number, taskIndex: number) => {
    const updatedGoals = [...goals];
    if (updatedGoals[goalIndex].tasks.length <= 1) return;
    updatedGoals[goalIndex].tasks.splice(taskIndex, 1);
    onUpdateGoals(updatedGoals);
  };

  const handleDecomposeGoalWithGemini = async (goalIndex: number) => {
    const targetGoal = goals[goalIndex];
    setDecomposingGoalId(targetGoal.id);

    try {
      const response = await fetch('/api/breakdown-goal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal: targetGoal.title,
          role: 'Project Manager',
        }),
      });

      const data = await response.json();
      if (Array.isArray(data.tasks) && data.tasks.length > 0) {
        const updatedGoals = [...goals];
        const newTasks: WorkflowTask[] = data.tasks.map((t: any, idx: number) => {
          const scoring = scoreTask(
            t.timeSpent || 'Medium',
            t.frequency || 'Medium',
            t.repetitiveness || 'Medium',
            t.taskTitle,
            allTasksList
          );
          return {
            id: `gen-${Date.now()}-${idx}`,
            goalId: targetGoal.id,
            goalTitle: targetGoal.title,
            taskTitle: t.taskTitle,
            howAiHelps: t.howAiHelps,
            timeSpent: t.timeSpent || 'Medium',
            frequency: t.frequency || 'Medium',
            repetitiveness: t.repetitiveness || 'Medium',
            ...scoring,
          };
        });

        updatedGoals[goalIndex].tasks = newTasks;
        onUpdateGoals(updatedGoals);
      }
    } catch (err) {
      console.error('Failed to decompose goal with Gemini:', err);
    } finally {
      setDecomposingGoalId(null);
    }
  };

  // Find prime app candidates
  const appCandidates = allTasksList.filter((t) => t.isAppCandidate);
  const bestCandidate =
    appCandidates.sort((a, b) => (b.appSuitabilityScore || 0) - (a.appSuitabilityScore || 0))[0] ||
    allTasksList[0];

  const handleExportCSV = () => {
    let csv = 'Goal,Task,How AI Can Help,Time Spent,Frequency,Repetitiveness,App Candidate,Recommendation\n';
    goals.forEach((g) => {
      g.tasks.forEach((t) => {
        csv += `"${g.title.replace(/"/g, '""')}","${t.taskTitle.replace(/"/g, '""')}","${t.howAiHelps.replace(/"/g, '""')}","${t.timeSpent}","${t.frequency}","${t.repetitiveness}","${t.isAppCandidate ? 'YES' : 'NO'}","${t.recommendationType || ''}"\n`;
      });
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'workflow-mapping-worksheet.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportMD = () => {
    let md = `# Worksheet: Map Your Workflow\n\n`;
    md += `## Step 1 to Step 5: Workflow Mapping Table\n\n`;
    md += `| Goals for the Month | Tasks | How AI Can Help | Time Spent | Frequency | Repetitiveness | Recommendation |\n`;
    md += `| :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n`;

    goals.forEach((g) => {
      g.tasks.forEach((t) => {
        md += `| **${g.title}** | ${t.taskTitle} | ${t.howAiHelps} | ${t.timeSpent} | ${t.frequency} | ${t.repetitiveness} | ${t.isAppCandidate ? '**BUILD AI APP**' : t.recommendationType} |\n`;
      });
    });

    md += `\n\n### Step 5: Key Takeaway & Highest-Value AI App Candidate\n`;
    md += `**Winning Task**: ${bestCandidate?.taskTitle}\n`;
    md += `**Reasoning**: Rates high across Time Spent, Frequency, and Repetitiveness. It saves substantial cognitive drag and provides the fastest human verification cycle.\n`;

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'workflow-mapping-worksheet.md';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-10">
      {/* 1. Header Banner & Step-by-Step Worksheet Context */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-2">
          <span>CURRICULUM WORKSHEET</span>
          <span aria-hidden="true">·</span>
          <span>MAP YOUR WORKFLOW & IDENTIFY AI APP TARGETS</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 text-balance">
              Worksheet: Map Your Workflow
            </h2>
            <p className="text-sm text-slate-600 mt-2 max-w-3xl leading-relaxed">
              Follow this 5-step framework to map your monthly goals, break them into concrete tasks,
              rate them across <strong className="text-slate-800">Time Spent</strong>, <strong className="text-slate-800">Frequency</strong>, and <strong className="text-slate-800">Repetitiveness</strong>, and uncover the highest-leverage candidate for an AI-powered app.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>
            <button
              onClick={handleExportMD}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Export .MD
            </button>
          </div>
        </div>

        {/* 5-Step Process Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-6">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-[11px] font-bold text-slate-400 block mb-0.5">STEP 1</span>
            <span className="text-xs font-bold text-slate-800 block">List 3 Goals</span>
            <p className="text-[11px] text-slate-500 mt-0.5">Define monthly targets</p>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-[11px] font-bold text-slate-400 block mb-0.5">STEP 2</span>
            <span className="text-xs font-bold text-slate-800 block">Map Required Tasks</span>
            <p className="text-[11px] text-slate-500 mt-0.5">Decompose with Gemini</p>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-[11px] font-bold text-slate-400 block mb-0.5">STEP 3</span>
            <span className="text-xs font-bold text-slate-800 block">How AI Can Help</span>
            <p className="text-[11px] text-slate-500 mt-0.5">Identify leverage points</p>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-[11px] font-bold text-slate-400 block mb-0.5">STEP 4</span>
            <span className="text-xs font-bold text-slate-800 block">Rate 3 Attributes</span>
            <p className="text-[11px] text-slate-500 mt-0.5">Time, Freq, Repetitive</p>
          </div>
          <div className="p-3 bg-slate-900 text-white rounded-xl">
            <span className="text-[11px] font-bold text-slate-400 block mb-0.5">STEP 5</span>
            <span className="text-xs font-bold text-white block">Identify App Value</span>
            <p className="text-[11px] text-slate-300 mt-0.5">App vs Prompt vs Rule</p>
          </div>
        </div>
      </section>

      {/* 2. Step 5 Highlight: Direct Answer to the User's Question */}
      {bestCandidate && (
        <section className="bg-emerald-950/5 border border-emerald-500/20 rounded-2xl p-6 lg:p-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 mb-1">
            <span>STEP 5 OUTCOME</span>
            <span aria-hidden="true">·</span>
            <span>PRIME CANDIDATE FOR AN AI APP</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <h3 className="text-xl lg:text-2xl font-bold text-slate-900">
                "{bestCandidate.taskTitle}" is Your Best Fit for an AI-Powered App
              </h3>
              <p className="text-xs lg:text-sm text-slate-700 leading-relaxed">
                <strong>Why an App (instead of a prompt or rule)?</strong> It rates{' '}
                <span className="font-semibold text-slate-900">High across all 3 attributes</span> (several hours spent, recurring weekly/daily, nearly identical process) AND it addresses cross-cutting needs across multiple goals (status reporting, blocker triage, and documentation).
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-600">
                <span>Time Spent: <strong className="text-slate-900">{bestCandidate.timeSpent}</strong></span>
                <span aria-hidden="true">·</span>
                <span>Frequency: <strong className="text-slate-900">{bestCandidate.frequency}</strong></span>
                <span aria-hidden="true">·</span>
                <span>Repetitiveness: <strong className="text-slate-900">{bestCandidate.repetitiveness}</strong></span>
                <span aria-hidden="true">·</span>
                <span>App Suitability: <strong className="text-emerald-700 font-mono tabular-nums">{bestCandidate.appSuitabilityScore}%</strong></span>
              </div>
            </div>

            <div className="shrink-0">
              <button
                onClick={() => onLaunchPrototype(bestCandidate.taskTitle)}
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors shadow-xs whitespace-nowrap"
              >
                <Play className="w-3.5 h-3.5" />
                Test Live Prototype of This App
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 3. The Interactive Workflow Table (Step 1 to Step 4) */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
              <span>WORKFLOW TABLE</span>
              <span aria-hidden="true">·</span>
              <span>COMPLETE BREAKDOWN ACROSS 3 GOALS</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Goals, Tasks & Rating Matrix
            </h3>
          </div>

          {/* Reference Legend */}
          <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex flex-wrap items-center gap-4">
            <span><strong>Time Spent:</strong> Low = Minutes | Med = ~1h | High = Several hours</span>
            <span><strong>Frequency:</strong> Low = Few/mo | Med = Weekly | High = Daily</span>
            <span><strong>Repetitiveness:</strong> Low = Different | Med = Some repeat | High = Identical</span>
          </div>
        </div>

        {/* Goals Accordion / Table Groups */}
        <div className="space-y-8">
          {goals.map((goal, gIdx) => (
            <div
              key={goal.id}
              className="border border-slate-200 rounded-xl overflow-hidden bg-white"
            >
              {/* Goal Title Header */}
              <div className="bg-slate-50 p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-xs font-bold text-slate-400 shrink-0">
                    GOAL 0{gIdx + 1}
                  </span>
                  <input
                    type="text"
                    value={goal.title}
                    onChange={(e) => handleUpdateGoalTitle(gIdx, e.target.value)}
                    className="w-full text-sm font-bold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-slate-900 focus:outline-none"
                    placeholder="Enter monthly goal..."
                  />
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleDecomposeGoalWithGemini(gIdx)}
                    disabled={decomposingGoalId === goal.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors shadow-2xs"
                  >
                    {decomposingGoalId === goal.id ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Decomposing with Gemini...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-slate-900" />
                        Gemini: Decompose into 5 Tasks
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleAddTask(gIdx)}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Step
                  </button>
                </div>
              </div>

              {/* Tasks Table for this Goal */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 bg-white text-slate-500">
                      <th className="py-2.5 px-4 font-semibold w-1/4">Step 2: Task</th>
                      <th className="py-2.5 px-4 font-semibold w-1/3">Step 3: How AI Can Help</th>
                      <th className="py-2.5 px-2 font-semibold text-center">Time Spent</th>
                      <th className="py-2.5 px-2 font-semibold text-center">Frequency</th>
                      <th className="py-2.5 px-2 font-semibold text-center">Repetitive</th>
                      <th className="py-2.5 px-3 font-semibold text-center">Step 5: Value</th>
                      <th className="py-2.5 px-2 w-8"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {goal.tasks.map((task, tIdx) => {
                      const isWinningCandidate = task.id === bestCandidate?.id;
                      return (
                        <tr
                          key={task.id}
                          className={`hover:bg-slate-50/70 transition-colors ${
                            isWinningCandidate ? 'bg-emerald-50/25' : ''
                          }`}
                        >
                          {/* Task Title */}
                          <td className="py-3 px-4 align-top">
                            <input
                              type="text"
                              value={task.taskTitle}
                              onChange={(e) =>
                                handleUpdateTaskField(gIdx, tIdx, 'taskTitle', e.target.value)
                              }
                              className="w-full font-medium text-slate-900 bg-transparent focus:outline-none focus:ring-1 focus:ring-slate-900 rounded p-1"
                            />
                          </td>

                          {/* How AI Can Help */}
                          <td className="py-3 px-4 align-top">
                            <textarea
                              value={task.howAiHelps}
                              onChange={(e) =>
                                handleUpdateTaskField(gIdx, tIdx, 'howAiHelps', e.target.value)
                              }
                              rows={2}
                              className="w-full text-slate-600 bg-transparent focus:outline-none focus:ring-1 focus:ring-slate-900 rounded p-1 resize-none"
                            />
                          </td>

                          {/* Time Spent */}
                          <td className="py-3 px-2 align-top text-center">
                            <select
                              value={task.timeSpent}
                              onChange={(e) =>
                                handleRatingChange(gIdx, tIdx, 'timeSpent', e.target.value as RatingLevel)
                              }
                              className={`text-xs rounded px-2 py-1 font-medium focus:outline-none ${
                                task.timeSpent === 'High'
                                  ? 'bg-amber-50 text-amber-800'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              <option value="Low">Low</option>
                              <option value="Medium">Medium</option>
                              <option value="High">High</option>
                            </select>
                          </td>

                          {/* Frequency */}
                          <td className="py-3 px-2 align-top text-center">
                            <select
                              value={task.frequency}
                              onChange={(e) =>
                                handleRatingChange(gIdx, tIdx, 'frequency', e.target.value as RatingLevel)
                              }
                              className={`text-xs rounded px-2 py-1 font-medium focus:outline-none ${
                                task.frequency === 'High'
                                  ? 'bg-amber-50 text-amber-800'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              <option value="Low">Low</option>
                              <option value="Medium">Medium</option>
                              <option value="High">High</option>
                            </select>
                          </td>

                          {/* Repetitiveness */}
                          <td className="py-3 px-2 align-top text-center">
                            <select
                              value={task.repetitiveness}
                              onChange={(e) =>
                                handleRatingChange(
                                  gIdx,
                                  tIdx,
                                  'repetitiveness',
                                  e.target.value as RatingLevel
                                )
                              }
                              className={`text-xs rounded px-2 py-1 font-medium focus:outline-none ${
                                task.repetitiveness === 'High'
                                  ? 'bg-amber-50 text-amber-800'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              <option value="Low">Low</option>
                              <option value="Medium">Medium</option>
                              <option value="High">High</option>
                            </select>
                          </td>

                          {/* Recommendation Badge / App Candidate */}
                          <td className="py-3 px-3 align-top text-center">
                            {task.isAppCandidate ? (
                              <div className="flex flex-col items-center">
                                <span className="font-semibold text-emerald-700 whitespace-nowrap">
                                  BUILD AI APP
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  Score: {task.appSuitabilityScore}%
                                </span>
                              </div>
                            ) : task.recommendationType === 'Deterministic Rule' ? (
                              <div className="flex flex-col items-center">
                                <span className="font-medium text-indigo-700 whitespace-nowrap">
                                  Zapier / Rule
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  Deterministic
                                </span>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center">
                                <span className="font-medium text-slate-600 whitespace-nowrap">
                                  Prompt Gemini
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  One-Off Chat
                                </span>
                              </div>
                            )}
                          </td>

                          {/* Delete Action */}
                          <td className="py-3 px-2 align-top text-right">
                            {goal.tasks.length > 1 && (
                              <button
                                onClick={() => handleRemoveTask(gIdx, tIdx)}
                                className="text-slate-300 hover:text-red-500 transition-colors p-1"
                                title="Remove row"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Educational Guidance matching Step 5 in Curriculum */}
      <section className="bg-slate-50 border border-slate-200 rounded-2xl p-6 lg:p-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-2">
          <span>STEP 5 CURRICULUM GUIDANCE</span>
          <span aria-hidden="true">·</span>
          <span>HOW TO DISTINGUISH AN APP FROM A PROMPT</span>
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-4">
          The Three Rules for Identifying High-Value App Candidates
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
            <span className="text-xs font-bold text-slate-400">RULE 1</span>
            <h4 className="text-sm font-bold text-slate-900">
              Rate Highly Across Attributes
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              A 'High' rating in Time Spent, Frequency, and Repetitiveness is the strongest indicator of app ROI. Even a task that takes only 5 minutes but occurs 10 times a day (high frequency + high repetitiveness) justifies an app.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
            <span className="text-xs font-bold text-slate-400">RULE 2</span>
            <h4 className="text-sm font-bold text-slate-900">
              Appear Across Multiple Goals
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Look for tasks that appear in more than one goal (e.g. synthesizing progress updates for executive reports, team retros, and onboarding). These cross-cutting activities deliver multiplied business value when unified in an app.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
            <span className="text-xs font-bold text-slate-400">RULE 3</span>
            <h4 className="text-sm font-bold text-slate-900">
              App vs. One-Off Gemini Prompt
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              For tasks that happen infrequently (Low frequency) or are completely different each time (Low repetitiveness), do not waste engineering time building an app. Simply prompt Gemini directly in chat instead.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
