import { PracticeBase } from '../PracticeBase';
import { PracticeEvaluationResult } from '../../model';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
export declare class JavaSpecifiedDependencyVersions extends PracticeBase {
    isApplicable(ctx: PracticeContext): Promise<boolean>;
    evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult>;
}
//# sourceMappingURL=JavaSpecifiedDependencyVersions.d.ts.map