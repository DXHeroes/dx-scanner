import { PackageInspectorBase } from './PackageInspectorBase';
import { IFileInspector, DependencyType, PackageVersion } from '..';
import { inject } from 'inversify';
import { Types } from '../../types';

export class RubyPackageInspector extends PackageInspectorBase {
  private fileInspector: IFileInspector;
  private parsedDependencies: ParsedDependency[] = [];

  constructor(@inject(Types.IFileInspector) fileInspector: IFileInspector) {
    super();
    this.fileInspector = fileInspector;
  }

  async init(): Promise<void> {
    try {
      this.debug('RubyPackageInspector init started');

      // Remove any white lines in the string, but keep line breaks
      const gemfileString = (await this.fileInspector.readFile('Gemfile')).replace(/^(?=\n)$|^\s*|\s*$|\n\n+/gm, '');
      const gemfileLines = gemfileString.split('\n');
      const gemfilePackages = gemfileLines
        .map((line) => line.split(' '))
        .map((splitLine) => splitLine.map((part) => part.replace(/"/g, '').replace(/,/g, '')))
        .filter((splitLine) => splitLine[0] === 'gem' && splitLine[1])
        .map((splitLine) => {
          return {
            packageName: splitLine[1],
            version: this.parseVersion(splitLine.slice(2)),
          };
        });
      for (const parsedPackage of gemfilePackages) {
        if (parsedPackage.version) {
          this.parsedDependencies.push({ packageName: parsedPackage.packageName, version: parsedPackage.version });
        }
      }
      this.packages = [];
      this.addPackages(this.parsedDependencies, DependencyType.Runtime);
      this.debug(this.packages);
      this.debug('RubyPackageInspector init ended');
    } catch (e) {
      this.packages = undefined;
      this.debug(e);
    }
  }

  private parseVersion(lineRemainder: string[]): PackageVersion | undefined {
    const noVersion = PackageInspectorBase.semverToPackageVersion('0.0.0');
    if (lineRemainder === []) {
      return noVersion; // no version information provided
    }
    for (const lineSegment of lineRemainder) {
      const segmentSemVer = PackageInspectorBase.semverToPackageVersion(lineSegment);
      if (segmentSemVer) {
        return segmentSemVer;
      }
      if (lineSegment.startsWith('#')) {
        return noVersion; // begin comment & no version information found
      }
    }
    return noVersion; // no version information found
  }

  private addPackages(dependencies: ParsedDependency[] | undefined, depType: DependencyType) {
    if (!dependencies) {
      return;
    }
    if (!this.packages) {
      this.packages = [];
    }
    for (const dependency of dependencies) {
      if (dependency.version) {
        this.packages.push({
          dependencyType: depType,
          name: dependency.packageName,
          requestedVersion: dependency.version,
          lockfileVersion: dependency.version,
        });
      }
    }
  }

  hasLockfile(): boolean | undefined {
    return false;
  }
}

interface ParsedDependency {
  packageName: string;
  version: PackageVersion;
}
