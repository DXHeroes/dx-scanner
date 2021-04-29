import { PracticeEvaluationResult } from '../../model';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { GitignoreCorrectlySetPracticeBase } from '../common/GitignoreCorrectlySetPracticeBase';
export declare class RubyGitignoreCorrectlySetPractice extends GitignoreCorrectlySetPracticeBase {
    constructor();
    evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult>;
    protected setData(): void;
}
//# sourceMappingURL=RubyGitignoreCorrectlySetPractice.d.ts.map