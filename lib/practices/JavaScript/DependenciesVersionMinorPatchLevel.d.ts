import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { PracticeEvaluationResult } from '../../model';
import { IPractice } from '../IPractice';
import { DependenciesVersionMajorLevelPractice } from './DependenciesVersionMajorLevel';
export declare class DependenciesVersionMinorPatchLevelPractice extends DependenciesVersionMajorLevelPractice implements IPractice {
    private patchLevelPkgs;
    private minorLevelPkgs;
    isApplicable(ctx: PracticeContext): Promise<boolean>;
    evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult>;
    fix(): Promise<void>;
}
//# sourceMappingURL=DependenciesVersionMinorPatchLevel.d.ts.map