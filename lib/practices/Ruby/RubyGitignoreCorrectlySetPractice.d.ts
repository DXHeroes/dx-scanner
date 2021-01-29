import { PracticeEvaluationResult } from '../../model';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { PracticeBase } from '../PracticeBase';
import { FixerContext } from '../../contexts/fixer/FixerContext';
export declare class RubyGitignoreCorrectlySetPractice extends PracticeBase {
    private parsedGitignore;
    isApplicable(ctx: PracticeContext): Promise<boolean>;
    evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult>;
    fix(ctx: FixerContext): Promise<void>;
    private setData;
}
//# sourceMappingURL=RubyGitignoreCorrectlySetPractice.d.ts.map