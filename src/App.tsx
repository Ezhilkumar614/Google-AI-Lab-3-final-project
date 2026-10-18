import React, { useState } from 'react';
import { ROLE_PRESETS } from './data/presets';
import { WorkflowGoal, EvaluationResult, TaskItem } from './types';
import { Header } from './components/Header';
import { RoleTaskSelector } from './components/RoleTaskSelector';
import { EvaluationSummary } from './components/EvaluationSummary';
import { DecisionRubric } from './components/DecisionRubric';
import { LivePrototype } from './components/LivePrototype';
import { ArchitectureSpec } from './components/ArchitectureSpec';
import { WorkflowWorksheet } from './components/WorkflowWorksheet';
import { DEFAULT_PM_WORKFLOW_GOALS } from './data/defaultWorksheet';

export default function App() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('project-manager');
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('worksheet');
  const [workflowGoals, setWorkflowGoals] = useState<WorkflowGoal[]>(DEFAULT_PM_WORKFLOW_GOALS);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Custom role state
  const defaultPmPreset = ROLE_PRESETS[0];
  const [customRole, setCustomRole] = useState<string>('Project Manager');
  const [customTasks, setCustomTasks] = useState<TaskItem[]>(defaultPmPreset.tasks);

  // Active evaluation result
  const [currentEvaluation, setCurrentEvaluation] = useState<EvaluationResult>(
    defaultPmPreset.evaluation
  );

  const handleSelectPreset = (presetId: string) => {
    if (presetId === 'custom') {
      setIsCustom(true);
      return;
    }

    setIsCustom(false);
    setSelectedPresetId(presetId);
    const preset = ROLE_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setCurrentEvaluation(preset.evaluation);
    }
  };

  const handleRunCustomEvaluation = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: customRole,
          tasks: customTasks,
        }),
      });

      const data = await response.json();
      setCurrentEvaluation(data);
      setActiveTab('evaluation');
    } catch (err) {
      console.error('Failed to run custom evaluation:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewAnalysis = () => {
    setIsCustom(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activePreset = ROLE_PRESETS.find((p) => p.id === selectedPresetId) || ROLE_PRESETS[0];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* 1. Header (Strict Top Bar Contract) */}
      <Header
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNewAnalysis={handleNewAnalysis}
      />

      {/* 2. Interactive Role & Task Configuration Bar */}
      <RoleTaskSelector
        presets={ROLE_PRESETS}
        selectedPresetId={selectedPresetId}
        onSelectPreset={handleSelectPreset}
        customTasks={customTasks}
        customRole={customRole}
        isCustom={isCustom}
        onUpdateCustomRole={setCustomRole}
        onUpdateCustomTasks={setCustomTasks}
        onRunCustomEvaluation={handleRunCustomEvaluation}
        isLoading={isLoading}
      />

      {/* 3. Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        {/* Tab Sub-Navigation for Mobile / Quick Access */}
        <div className="flex md:hidden items-center gap-1 p-1 bg-slate-200/70 rounded-xl mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('worksheet')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap shrink-0 ${
              activeTab === 'worksheet' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Worksheet
          </button>
          <button
            onClick={() => setActiveTab('evaluation')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap shrink-0 ${
              activeTab === 'evaluation' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Verdict
          </button>
          <button
            onClick={() => setActiveTab('prototype')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap shrink-0 ${
              activeTab === 'prototype' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Live Prototype
          </button>
          <button
            onClick={() => setActiveTab('rubric')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap shrink-0 ${
              activeTab === 'rubric' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Decision Rubric
          </button>
          <button
            onClick={() => setActiveTab('spec')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap shrink-0 ${
              activeTab === 'spec' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Build Spec
          </button>
        </div>

        {/* Tab Views */}
        {activeTab === 'worksheet' && (
          <WorkflowWorksheet
            goals={workflowGoals}
            onUpdateGoals={setWorkflowGoals}
            onLaunchPrototype={(taskTitle) => {
              setActiveTab('prototype');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'evaluation' && (
          <EvaluationSummary
            evaluation={currentEvaluation}
            onLaunchPrototype={() => setActiveTab('prototype')}
            onViewSpec={() => setActiveTab('spec')}
          />
        )}

        {activeTab === 'prototype' && (
          <LivePrototype
            toolName={currentEvaluation.recommendedToolSpec.appName}
            role={isCustom ? customRole : activePreset.roleTitle}
            sampleInput={isCustom ? customTasks[0]?.description || '' : activePreset.sampleInput}
            prototypeTitle={
              isCustom ? currentEvaluation.recommendedToolSpec.appName : activePreset.prototypeTitle
            }
            prototypeDescription={
              isCustom
                ? currentEvaluation.recommendedToolSpec.tagline
                : activePreset.prototypeDescription
            }
          />
        )}

        {activeTab === 'rubric' && <DecisionRubric />}

        {activeTab === 'spec' && <ArchitectureSpec evaluation={currentEvaluation} />}
      </main>

      {/* 4. Quiet Footer adhering to anti-slop guidelines */}
      <footer className="border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-semibold text-slate-700">TaskAI Fit</span>
            <span aria-hidden="true" className="mx-2">·</span>
            <span>Workflow Recurrence & AI Automation Feasibility Evaluator</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('rubric')}
              className="hover:text-slate-900 transition-colors"
            >
              Evaluation Laws
            </button>
            <button
              onClick={() => setActiveTab('spec')}
              className="hover:text-slate-900 transition-colors"
            >
              System PRD
            </button>
            <button
              onClick={() => {
                setIsCustom(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-slate-900 transition-colors"
            >
              Analyze New Task
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
