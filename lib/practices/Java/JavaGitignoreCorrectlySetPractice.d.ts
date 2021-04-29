import { PracticeEvaluationResult } from '../../model';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { GitignoreCorrectlySetPracticeBase } from '../common/GitignoreCorrectlySetPracticeBase';
export declare class JavaGitignoreCorrectlySetPractice extends GitignoreCorrectlySetPracticeBase {
    private javaArchitecture;
    constructor();
    evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult>;
    protected setData(): void;
}
//# sourceMappingURL=JavaGitignoreCorrectlySetPractice.d.ts.map