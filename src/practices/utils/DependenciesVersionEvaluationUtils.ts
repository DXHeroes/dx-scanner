import { SemverLevel, Package, PackageInspectorBase } from '../../inspectors';
import { UpdatedDependencyDto } from '../../reporters/DashboardReporter';
import { UpdatedDependencySeverity } from '../../reporters/DashboardReporterEnums';

export class DependenciesVersionEvaluationUtils {
  static packagesToBeUpdated(pkgsWithNewVersion: { [key: string]: string }, semverLevel: SemverLevel, pkgs: Package[]) {
    const pkgsToUpdate: PkgToUpdate[] = [];

    for (const packageName in pkgsWithNewVersion) {
      const parsedVersion = PackageInspectorBase.semverToPackageVersion(pkgsWithNewVersion[packageName]);
      if (parsedVersion) {
        for (const pkg of pkgs) {
          if (pkg.name === packageName && parsedVersion[semverLevel] > pkg.lockfileVersion[semverLevel]) {
            switch (semverLevel) {
              case SemverLevel.patch:
                if (
                  parsedVersion[SemverLevel.minor] === pkg.lockfileVersion[SemverLevel.minor] &&
                  parsedVersion[SemverLevel.major] === pkg.lockfileVersion[SemverLevel.major]
                ) {
                  pkgsToUpdate.push({
                    library: pkg.name,
                    newestVersion: parsedVersion.value,
                    currentVersion: pkg.lockfileVersion.value,
                    severity: UpdatedDependencySeverity.High,
                  });
                }
                break;
              case SemverLevel.minor:
                if (parsedVersion[SemverLevel.major] === pkg.lockfileVersion[SemverLevel.major]) {
                  pkgsToUpdate.push({
                    library: pkg.name,
                    newestVersion: parsedVersion.value,
                    currentVersion: pkg.lockfileVersion.value,
                    severity: UpdatedDependencySeverity.Moderate,
                  });
                }
                break;
              case SemverLevel.major:
                pkgsToUpdate.push({
                  library: pkg.name,
                  newestVersion: parsedVersion.value,
                  currentVersion: pkg.lockfileVersion.value,
                  severity: UpdatedDependencySeverity.Low,
                });
                break;
            }
          }
        }
      }
    }

    return pkgsToUpdate;
  }
}

// Use UpdatedDependencyDto just in connection with dashboard, otherwise use PkgToUpdate as it can change in the future unlike UpdatedDependencyDto
export type PkgToUpdate = UpdatedDependencyDto;
