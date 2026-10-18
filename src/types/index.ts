export type RatingLevel = 'Low' | 'Medium' | 'High';

export interface WorkflowTask {
  id: string;
  goalId: string;
  goalTitle: string;
  taskTitle: string;
  howAiHelps: string;
  timeSpent: RatingLevel;
  frequency: RatingLevel;
  repetitiveness: RatingLevel;
  isAppCandidate?: boolean;
  appSuitabilityScore?: number; // 0 to 100
  recommendationType?: 'Build AI App' | 'Use One-Off Prompt' | 'Deterministic Rule' | 'Keep Human-Led';
  recommendationReason?: string;
}

export interface WorkflowGoal {
  id: string;
  title: string;
  tasks: WorkflowTask[];
}

export interface TaskItem {
  id: string;
  name: string;
  description: string;
  hoursPerWeek: number;
  currentPain: string;
  inputFormat: string;
  outputFormat: string;
}

export interface TaskScore {
  unstructuredData: number; // 0-10
  synthesisReasoning: number; // 0-10
  generativeTolerance: number; // 0-10
  verificationSpeed: number; // 0-10
  deterministicFailure: number; // 0-10
  timeRoi: number; // 0-10
}

export interface TaskEvaluation {
  taskId: string;
  taskName: string;
  overallFitScore: number; // 0-100
  fitVerdict: 'Prime AI Tool Candidate' | 'Moderate AI Assist' | 'Better for Deterministic Automation' | 'Keep Human-Led';
  scores: TaskScore;
  strengths: string[];
  drawbacksOrRisks: string[];
  automationAlternative: string;
}

export interface EvaluationResult {
  winningTaskId: string;
  winningTaskName: string;
  verdictSummary: string;
  taskEvaluations: TaskEvaluation[];
  whyWinnerWins: {
    headline: string;
    deepDive: string;
    keyAiLever: string;
  };
  whyOthersLose: Array<{
    taskName: string;
    reason: string;
  }>;
  recommendedToolSpec: {
    appName: string;
    tagline: string;
    coreWorkflowSteps: string[];
    suggestedPromptTemplate: string;
    safeguardsAndMitigations: string[];
    expectedWeeklyHoursSaved: number;
  };
}

export interface RolePreset {
  id: string;
  roleTitle: string;
  description: string;
  iconName: string;
  tasks: TaskItem[];
  evaluation: EvaluationResult;
  sampleInput: string;
  prototypeTitle: string;
  prototypeDescription: string;
}
