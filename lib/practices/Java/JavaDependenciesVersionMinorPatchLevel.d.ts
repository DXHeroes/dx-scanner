import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { PracticeEvaluationResult } from '../../model';
import { IPractice } from '../IPractice';
import { JavaDependenciesVersionMajorLevel } from './JavaDependenciesVersionMajorLevel';
export declare class JavaDependenciesVersionMinorPatchLevel extends JavaDependenciesVersionMajorLevel implements IPractice {
    isApplicable(ctx: PracticeContext): Promise<boolean>;
    evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult>;
}
//# sourceMappingURL=JavaDependenciesVersionMinorPatchLevel.d.ts.map