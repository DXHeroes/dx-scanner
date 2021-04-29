import { PracticeEvaluationResult } from '../../model';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { GitignoreCorrectlySetPracticeBase } from '../common/GitignoreCorrectlySetPracticeBase';
export declare class RustGitignoreCorrectlySetPractice extends GitignoreCorrectlySetPracticeBase {
    constructor();
    evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult>;
    protected setData(): void;
}
//# sourceMappingURL=RustGitignoreCorrectlySetPractice.d.ts.map