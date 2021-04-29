import { PracticeEvaluationResult } from '../../model';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { GitignoreCorrectlySetPracticeBase } from '../common/GitignoreCorrectlySetPracticeBase';
export declare class TsGitignoreCorrectlySetPractice extends GitignoreCorrectlySetPracticeBase {
    private tsconfig;
    private tsconfigOutdir;
    private tsconfigOutfile;
    constructor();
    evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult>;
    protected setData(): void;
}
//# sourceMappingURL=TsGitignoreCorrectlySetPractice.d.ts.map