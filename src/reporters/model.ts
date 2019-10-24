import { PracticeWithContextForReporter } from './IReporter';

export type DXScoreResult = {
  value: string;
  points: { total: number; max: number; percentage: number };
  practices: {
    practicing: PracticeWithContextForReporter[];
    notPracticing: PracticeWithContextForReporter[];
    off: PracticeWithContextForReporter[];
  };
};

export type DXScoreOverallResult = DXScoreResult & { components: Array<DXScoreResult & { path: string }> };
