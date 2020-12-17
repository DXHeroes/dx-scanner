import { SemverLevel, Package } from '../../inspectors';
import { UpdatedDependencyDto } from '../../reporters/DashboardReporter';
export declare class DependenciesVersionEvaluationUtils {
    static packagesToBeUpdated(pkgsWithNewVersion: {
        [key: string]: string;
    }, semverLevel: SemverLevel, pkgs: Package[]): UpdatedDependencyDto[];
}
export declare type PkgToUpdate = UpdatedDependencyDto;
//# sourceMappingURL=DependenciesVersionEvaluationUtils.d.ts.map