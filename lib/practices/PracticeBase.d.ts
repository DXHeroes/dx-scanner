import { IPractice, PracticeData } from './IPractice';
import { PracticeEvaluationResult } from '../model';
import { PracticeContext } from '../contexts/practice/PracticeContext';
export declare abstract class PracticeBase<T = Record<string, unknown>> implements IPractice<T> {
    data: Partial<T> & PracticeData;
    constructor();
    isApplicable(ctx: PracticeContext): Promise<boolean>;
    evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult>;
}
//# sourceMappingURL=PracticeBase.d.ts.map