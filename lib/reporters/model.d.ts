import { PracticeWithContextForReporter } from './IReporter';
export declare type DXScoreResult = {
    value: string;
    points: {
        total: number;
        max: number;
        percentage: number;
    };
    practices: {
        practicing: PracticeWithContextForReporter[];
        notPracticing: PracticeWithContextForReporter[];
        off: PracticeWithContextForReporter[];
    };
};
export declare type DXScoreOverallResult = DXScoreResult & {
    components: Array<DXScoreResult & {
        path: string;
    }>;
};
//# sourceMappingURL=model.d.ts.map