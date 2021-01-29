import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { PracticeEvaluationResult } from '../../model';
import { IPractice } from '../IPractice';
export declare class TimeToSolvePullRequestsPractice implements IPractice {
    isApplicable(): Promise<boolean>;
    evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult>;
}
//# sourceMappingURL=TimeToSolvePullRequestsPractice.d.ts.map