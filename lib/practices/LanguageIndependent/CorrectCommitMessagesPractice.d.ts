import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { PracticeEvaluationResult } from '../../model';
import { IPractice } from '../IPractice';
import { PracticeBase } from '../PracticeBase';
export declare class CorrectCommitMessagesPractice extends PracticeBase implements IPractice {
    private readonly relevantCommitCount;
    isApplicable(): Promise<boolean>;
    evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult>;
}
//# sourceMappingURL=CorrectCommitMessagesPractice.d.ts.map