import { SemverLevel, Package, PackageInspectorBase } from '../../inspectors';
import { UpdatedDependencySeverity, UpdatedDependencyDto } from '../../reporters/DashboardReporter';

export class DependenciesVersionEvaluationUtils {
  static packagesToBeUpdated(pkgsWithNewVersion: { [key: string]: string }, semverLevel: SemverLevel, pkgs: Package[]) {
    const pkgsToUpdate: UpdatedDependencyDto[] = [];

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

// export type PkgToUpdate = { name: string; newVersion: string; currentVersion: string };
