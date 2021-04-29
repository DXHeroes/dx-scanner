import { IPractice } from '../IPractice';
import { PracticeEvaluationResult } from '../../model';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
export declare class JsLockfileIsPresentPractice implements IPractice {
    isApplicable(ctx: PracticeContext): Promise<boolean>;
    evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult>;
    fix(): Promise<void>;
}
//# sourceMappingURL=JsLockfileIsPresentPractice.d.ts.map