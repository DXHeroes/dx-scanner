import { IPractice } from '../IPractice';
import { PracticeEvaluationResult } from '../../model';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
export declare class TypeScriptUsedPractice implements IPractice {
    isApplicable(ctx: PracticeContext): Promise<boolean>;
    evaluate(): Promise<PracticeEvaluationResult>;
}
//# sourceMappingURL=TypeScriptUsedPractice.d.ts.map