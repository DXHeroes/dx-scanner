import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { PracticeEvaluationResult } from '../../model';
import { IPractice } from '../IPractice';
export declare class ThinPullRequestsPractice implements IPractice {
    private measurePullRequestCount;
    isApplicable(): Promise<boolean>;
    evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult>;
    private loadPullRequests;
}
//# sourceMappingURL=ThinPullRequestsPractice.d.ts.map