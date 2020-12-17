import { FixerContext } from '../../contexts/fixer/FixerContext';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { PracticeEvaluationResult } from '../../model';
import { IPractice } from '../IPractice';
export declare class GitignoreIsPresentPractice implements IPractice {
    isApplicable(): Promise<boolean>;
    evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult>;
    fix(ctx: FixerContext): Promise<void>;
}
//# sourceMappingURL=GitignoreIsPresentPractice.d.ts.map