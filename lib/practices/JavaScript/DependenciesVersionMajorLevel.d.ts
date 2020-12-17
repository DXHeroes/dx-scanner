import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { Package } from '../../inspectors/IPackageInspector';
import { PracticeEvaluationResult } from '../../model';
import { PracticeBase } from '../PracticeBase';
import { PkgToUpdate } from '../utils/DependenciesVersionEvaluationUtils';
export declare class DependenciesVersionMajorLevelPractice extends PracticeBase {
    isApplicable(ctx: PracticeContext): Promise<boolean>;
    evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult>;
    runNcu(pkgs: Package[] | undefined): Promise<{
        [key: string]: string;
    }>;
    setData(pkgsToUpdate: PkgToUpdate[]): void;
}
//# sourceMappingURL=DependenciesVersionMajorLevel.d.ts.map