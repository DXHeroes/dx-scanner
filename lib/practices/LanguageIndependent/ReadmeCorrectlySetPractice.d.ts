import { PracticeEvaluationResult } from '../../model';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { PracticeBase } from '../PracticeBase';
export declare class ReadmeIsCorrectlySet extends PracticeBase {
    private parseReadme;
    isApplicable(): Promise<boolean>;
    evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult>;
    private setData;
}
//# sourceMappingURL=ReadmeCorrectlySetPractice.d.ts.map