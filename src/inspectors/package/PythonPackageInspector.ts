import { PackageInspectorBase } from './PackageInspectorBase';
import { IFileInspector, DependencyType } from '..';
import { ParsedDependency } from '.';
import { inject } from 'inversify';
import { Types } from '../../types';

export class PythonPackageInspector extends PackageInspectorBase {
  private fileInspector: IFileInspector;
  private parsedDependencies: ParsedDependency[] = [];

  constructor(@inject(Types.IFileInspector) fileInspector: IFileInspector) {
    super();
    this.fileInspector = fileInspector;
  }

  async init(): Promise<void> {
    try {
      this.debug('PythonPackageInspector init started');
      // read the requirements file and remove any white lines in the string, but keep line breaks
      const requirementsFile = (await this.fileInspector.readFile('requirements.txt')).replace(/^(?=\n)$|^\s*|\s*$|\n\n+/gm, '');
      const pipVersionedPackages = requirementsFile.split('\n');
      for (const versionedPackage of pipVersionedPackages) {
        // remove white spaces in the line
        const adjustedVersionedPackage = versionedPackage.replace(/\s/g, '');
        if (adjustedVersionedPackage !== '' || !adjustedVersionedPackage) {
          const nameAndVersion = adjustedVersionedPackage.includes('==')
            ? adjustedVersionedPackage.split('==')
            : adjustedVersionedPackage.split('>=');
          this.parsedDependencies.push({ packageName: nameAndVersion[0], version: nameAndVersion[1] });
        }
      }
      this.packages = [];
      this.addPackages(this.parsedDependencies, DependencyType.Runtime);
      this.debug(this.packages);
      this.debug('PythonPackageInspector init ended');
    } catch (e) {
      this.packages = undefined;
      this.debug(e);
    }
  }

  private addPackages(dependencies: ParsedDependency[] | undefined, depType: DependencyType) {
    if (!dependencies) {
      return;
    }
    if (!this.packages) {
      this.packages = [];
    }
    for (const dependency of dependencies) {
      const parsedVersion = PackageInspectorBase.semverToPackageVersion(dependency.version);
      if (parsedVersion) {
        this.packages.push({
          dependencyType: depType,
          name: dependency.packageName,
          requestedVersion: parsedVersion,
          lockfileVersion: parsedVersion,
        });
      }
    }
  }

  hasLockfile(): boolean | undefined {
    return false;
  }
}
