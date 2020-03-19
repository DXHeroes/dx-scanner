import { sync as commandExistsSync } from 'command-exists';
import { IFileInspector } from '../../inspectors';

export class PackageManagerUtils {
  static getPackageManager = async (fileInspector?: IFileInspector) => {
    if (!fileInspector) return PackageManagerType.unknown;
    const packageLockExists = await fileInspector.exists('./package-lock.json');
    if (packageLockExists) return PackageManagerType.npm;
    const shrinkwrapExists = await fileInspector.exists('./npm-shrinkwrap.json');
    if (shrinkwrapExists) return PackageManagerType.npm;
    const yarnLockExists = await fileInspector.exists('./yarn.lock');
    if (yarnLockExists) return PackageManagerType.yarn;
    return PackageManagerType.unknown;
  };

  static pmInstalled = (packageManager: PackageManagerType) => {
    const hasNpm = commandExistsSync('npm');
    const hasYarn = commandExistsSync('yarn');

    if (packageManager === PackageManagerType.yarn) {
      if (hasYarn) return packageManager;
      else {
        packageManager = PackageManagerType.npm; // fallback from yarn to npm
      }
    }

    if (packageManager === PackageManagerType.npm && hasNpm) return packageManager;

    return PackageManagerType.unknown;
  };

  static getPmInstalled = async (fileInspector?: IFileInspector) => {
    const pm = await PackageManagerUtils.getPackageManager(fileInspector);
    return PackageManagerUtils.pmInstalled(pm);
  };
}

export enum PackageManagerType {
  unknown = 'unknown',
  npm = 'npm',
  yarn = 'yarn',
}
