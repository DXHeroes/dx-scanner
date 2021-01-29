import { IPractice } from '../IPractice';
import { PracticeEvaluationResult } from '../../model';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
export declare class JavaTestingFrameworkUsedPractice implements IPractice {
    isApplicable(ctx: PracticeContext): Promise<boolean>;
    evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult>;
}
//# sourceMappingURL=JavaTestingFrameworkUsedPractice.d.ts.map