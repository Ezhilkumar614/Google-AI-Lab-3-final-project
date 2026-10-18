import React, { useState } from 'react';
import { RolePreset, TaskItem } from '../types';
import { Clock, Plus, Trash2, Sparkles, RefreshCw, Layers } from 'lucide-react';

interface RoleTaskSelectorProps {
  presets: RolePreset[];
  selectedPresetId: string;
  onSelectPreset: (presetId: string) => void;
  customTasks: TaskItem[];
  customRole: string;
  isCustom: boolean;
  onUpdateCustomRole: (role: string) => void;
  onUpdateCustomTasks: (tasks: TaskItem[]) => void;
  onRunCustomEvaluation: () => void;
  isLoading: boolean;
}

export const RoleTaskSelector: React.FC<RoleTaskSelectorProps> = ({
  presets,
  selectedPresetId,
  onSelectPreset,
  customTasks,
  customRole,
  isCustom,
  onUpdateCustomRole,
  onUpdateCustomTasks,
  onRunCustomEvaluation,
  isLoading,
}) => {
  const [showCustomModal, setShowCustomModal] = useState(false);

  const handleTaskFieldChange = (index: number, field: keyof TaskItem, value: any) => {
    const updated = [...customTasks];
    updated[index] = { ...updated[index], [field]: value };
    onUpdateCustomTasks(updated);
  };

  const handleAddTask = () => {
    if (customTasks.length >= 3) return;
    const newTask: TaskItem = {
      id: `custom-task-${Date.now()}`,
      name: 'New Recurring Task',
      description: 'Describe what you do repeatedly and what information you process...',
      hoursPerWeek: 3,
      currentPain: 'Time consuming and context-switching friction',
      inputFormat: 'Messy text or emails',
      outputFormat: 'Summary or action items',
    };
    onUpdateCustomTasks([...customTasks, newTask]);
  };

  const handleRemoveTask = (index: number) => {
    if (customTasks.length <= 1) return;
    const updated = customTasks.filter((_, i) => i !== index);
    onUpdateCustomTasks(updated);
  };

  const activePreset = presets.find((p) => p.id === selectedPresetId);

  return (
    <div className="bg-white border-b border-slate-200 py-6">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
              <span>WORKFLOW RECURRENCE BENCHMARK</span>
              <span aria-hidden="true">·</span>
              <span>2 TO 3 TASK COMPARISON</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 text-balance">
              Identify the Highest-Leverage AI Tool for Your Role
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              Compare recurring workflows across cognitive complexity, deterministic automation alternatives,
              and human verification friction to determine what truly belongs in an AI tool.
            </p>
          </div>

          {/* Interactive Role Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto shrink-0">
            {presets.map((preset) => {
              const isActive = !isCustom && selectedPresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => onSelectPreset(preset.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {preset.roleTitle}
                </button>
              );
            })}
            <button
              onClick={() => onSelectPreset('custom')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                isCustom
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              + Custom Role & Tasks
            </button>
          </div>
        </div>

        {/* Display Current Tasks Being Evaluated */}
        {isCustom ? (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-200">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  YOUR PROFESSIONAL ROLE
                </label>
                <input
                  type="text"
                  value={customRole}
                  onChange={(e) => onUpdateCustomRole(e.target.value)}
                  placeholder="e.g. Project Manager, Operations Director, Marketing Lead"
                  className="w-full max-w-md px-3 py-2 text-sm font-semibold bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
              <div className="flex items-center gap-2">
                {customTasks.length < 3 && (
                  <button
                    onClick={handleAddTask}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Another Task ({customTasks.length}/3)
                  </button>
                )}
                <button
                  onClick={onRunCustomEvaluation}
                  disabled={isLoading}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-xs"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Evaluating with Gemini...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      Run AI Opportunity Analysis
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {customTasks.map((task, idx) => (
                <div
                  key={task.id}
                  className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-400">
                        TASK 0{idx + 1}
                      </span>
                      {customTasks.length > 1 && (
                        <button
                          onClick={() => handleRemoveTask(idx)}
                          className="text-slate-400 hover:text-red-600 transition-colors"
                          title="Remove task"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={task.name}
                      onChange={(e) => handleTaskFieldChange(idx, 'name', e.target.value)}
                      placeholder="Task name"
                      className="w-full text-sm font-semibold text-slate-900 border-b border-slate-200 pb-1 mb-2 focus:outline-none focus:border-slate-900"
                    />
                    <textarea
                      value={task.description}
                      onChange={(e) => handleTaskFieldChange(idx, 'description', e.target.value)}
                      placeholder="Describe what you do and what information you process..."
                      rows={3}
                      className="w-full text-xs text-slate-600 border border-slate-200 rounded-md p-2 mb-3 focus:outline-none focus:border-slate-900 resize-none"
                    />
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Hours/wk:
                    </span>
                    <input
                      type="number"
                      step="0.5"
                      min="0.5"
                      max="40"
                      value={task.hoursPerWeek}
                      onChange={(e) =>
                        handleTaskFieldChange(idx, 'hoursPerWeek', parseFloat(e.target.value) || 1)
                      }
                      className="w-16 px-1.5 py-0.5 text-right font-mono text-xs border border-slate-200 rounded focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activePreset?.tasks.map((task, idx) => (
              <div
                key={task.id}
                className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span className="font-bold text-slate-400">TASK 0{idx + 1}</span>
                    <span className="flex items-center gap-1 font-mono text-slate-600">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {task.hoursPerWeek}h / week
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-2">
                    {task.name}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    {task.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200 text-xs text-slate-500 space-y-1">
                  <div className="flex items-start gap-1.5">
                    <span className="font-medium text-slate-700 shrink-0">Input:</span>
                    <span className="text-slate-600 truncate">{task.inputFormat}</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="font-medium text-slate-700 shrink-0">Output:</span>
                    <span className="text-slate-600 truncate">{task.outputFormat}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
