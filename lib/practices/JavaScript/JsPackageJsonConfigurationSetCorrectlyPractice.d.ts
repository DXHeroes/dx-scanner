import { PracticeEvaluationResult } from '../../model';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { PracticeBase } from '../PracticeBase';
export declare class JsPackageJsonConfigurationSetCorrectlyPractice extends PracticeBase {
    isApplicable(ctx: PracticeContext): Promise<boolean>;
    evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult>;
    private setData;
}
//# sourceMappingURL=JsPackageJsonConfigurationSetCorrectlyPractice.d.ts.map