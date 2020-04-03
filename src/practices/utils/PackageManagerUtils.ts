import { sync as commandExistsSync } from 'command-exists';
import { IFileInspector } from '../../inspectors';
import shell from 'shelljs';

export class PackageManagerUtils {
  /** Guess the package manager by lockfiles and shrinkfile */
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

  /** Checks if the provided package manager is installed and fallback if possible */
  static packageManagerInstalled = (packageManager: PackageManagerType) => {
    const hasNpm = commandExistsSync('npm');
    const hasYarn = commandExistsSync('yarn');

    if (packageManager === PackageManagerType.yarn) {
      if (hasYarn) return packageManager;
      else if (hasNpm) {
        // fallback from yarn to npm
        packageManager = PackageManagerType.npm;
      }
    }

    if (packageManager === PackageManagerType.npm && hasNpm) return packageManager;

    return PackageManagerType.unknown;
  };

  /** Guess the package manager by lockfiles and then checks if its installed. Fallback if possible */
  static getPackageManagerInstalled = async (fileInspector?: IFileInspector) => {
    const pm = await PackageManagerUtils.getPackageManager(fileInspector);
    return PackageManagerUtils.packageManagerInstalled(pm);
  };

  static installPackage = async (fileInspector: IFileInspector, packageName: string, options: { dev: boolean } = { dev: false }) => {
    const pm = await PackageManagerUtils.getPackageManagerInstalled(fileInspector);
    if (pm === PackageManagerType.npm) {
      shell.exec(`npm i ${options.dev ? '-D' : ''} --prefix ${fileInspector.basePath} ${packageName}`);
    } else if (pm === PackageManagerType.yarn) {
      shell.exec(`yarn add ${options.dev ? '-D' : ''} --cwd ${fileInspector.basePath} ${packageName}`);
    }
  };
}

export enum PackageManagerType {
  unknown = 'unknown',
  npm = 'npm',
  yarn = 'yarn',
}
