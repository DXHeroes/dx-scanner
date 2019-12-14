import { SemverLevel, Package, PackageInspectorBase } from '../../inspectors';
import { PkgToUpdate } from '../JavaScript/DependenciesVersionMajorLevel';

export class DependenciesVersionEvaluationUtils {
  static packagesToBeUpdated(pkgsWithNewVersion: { [key: string]: string }, semverLevel: SemverLevel, pkgs: Package[]) {
    const pkgsToUpdate: PkgToUpdate[] = [];

    for (const packageName in pkgsWithNewVersion) {
      const parsedVersion = PackageInspectorBase.semverToPackageVersion(pkgsWithNewVersion[packageName]);
      if (parsedVersion) {
        for (const pkg of pkgs) {
          if (pkg.name === packageName) {
            if (parsedVersion[semverLevel] > pkg.lockfileVersion[semverLevel]) {
              pkgsToUpdate.push({ name: pkg.name, newVersion: parsedVersion.value, currentVersion: pkg.lockfileVersion.value });
            }
          }
        }
      }
    }

    return pkgsToUpdate;
  }
}
