import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { PracticeEvaluationResult } from '../../model';
import { PracticeBase } from '../PracticeBase';
import { PullRequestDto } from '../../reporters';
export declare class DoesPullRequestsPractice extends PracticeBase {
    isApplicable(): Promise<boolean>;
    evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult>;
    setData(pullRequests: PullRequestDto[]): void;
}
//# sourceMappingURL=DoesPullRequests.d.ts.map