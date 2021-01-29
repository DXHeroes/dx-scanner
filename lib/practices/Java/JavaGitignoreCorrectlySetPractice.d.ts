import { IPractice } from '../IPractice';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
export declare class JavaGitignoreCorrectlySetPractice implements IPractice {
    isApplicable(ctx: PracticeContext): Promise<boolean>;
    evaluate(ctx: PracticeContext): ReturnType<IPractice['evaluate']>;
    private resolveGitignorePractice;
}
//# sourceMappingURL=JavaGitignoreCorrectlySetPractice.d.ts.map