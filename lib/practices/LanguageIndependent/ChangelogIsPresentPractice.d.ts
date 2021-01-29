import { IPractice } from '../IPractice';
import { PracticeEvaluationResult } from '../../model';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
export declare class ChangelogIsPresentPractice implements IPractice {
    isApplicable(): Promise<boolean>;
    evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult>;
}
//# sourceMappingURL=ChangelogIsPresentPractice.d.ts.map