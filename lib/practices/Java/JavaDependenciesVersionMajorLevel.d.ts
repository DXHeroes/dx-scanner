import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { Package } from '../../inspectors/IPackageInspector';
import { PracticeEvaluationResult } from '../../model';
import { PracticeBase } from '../PracticeBase';
import { PkgToUpdate } from '../utils/DependenciesVersionEvaluationUtils';
export declare class JavaDependenciesVersionMajorLevel extends PracticeBase {
    isApplicable(ctx: PracticeContext): Promise<boolean>;
    evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult>;
    static searchMavenCentral(pkgs: Package[] | undefined, rows: number): Promise<{
        [key: string]: string;
    }>;
    setData(pkgsToUpdate: PkgToUpdate[]): void;
}
//# sourceMappingURL=JavaDependenciesVersionMajorLevel.d.ts.map