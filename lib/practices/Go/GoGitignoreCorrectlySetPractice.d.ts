import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { PracticeEvaluationResult } from '../../model';
import { PracticeBase } from '../PracticeBase';
import { FixerContext } from '../../contexts/fixer/FixerContext';
export declare class GoGitignoreCorrectlySetPractice extends PracticeBase {
    private parsedGitignore;
    isApplicable(ctx: PracticeContext): Promise<boolean>;
    evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult>;
    fix(ctx: FixerContext): Promise<void>;
    private setData;
}
//# sourceMappingURL=GoGitignoreCorrectlySetPractice.d.ts.map