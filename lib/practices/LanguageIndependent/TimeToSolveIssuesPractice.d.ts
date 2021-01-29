import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { PracticeEvaluationResult } from '../../model';
import { IPractice } from '../IPractice';
export declare class TimeToSolveIssuesPractice implements IPractice {
    isApplicable(): Promise<boolean>;
    evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult>;
}
//# sourceMappingURL=TimeToSolveIssuesPractice.d.ts.map