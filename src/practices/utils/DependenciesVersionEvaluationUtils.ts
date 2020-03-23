import { SemverLevel, Package, PackageInspectorBase } from '../../inspectors';

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
                  pkgsToUpdate.push({ name: pkg.name, newVersion: parsedVersion.value, currentVersion: pkg.lockfileVersion.value });
                }
                break;
              case SemverLevel.minor:
                if (parsedVersion[SemverLevel.major] === pkg.lockfileVersion[SemverLevel.major]) {
                  pkgsToUpdate.push({ name: pkg.name, newVersion: parsedVersion.value, currentVersion: pkg.lockfileVersion.value });
                }
                break;
              case SemverLevel.major:
                pkgsToUpdate.push({ name: pkg.name, newVersion: parsedVersion.value, currentVersion: pkg.lockfileVersion.value });
                break;
            }
          }
        }
      }
    }

    return pkgsToUpdate;
  }
}

export type PkgToUpdate = { name: string; newVersion: string; currentVersion: string };
