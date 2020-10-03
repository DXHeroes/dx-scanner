import { PackageInspectorBase } from './PackageInspectorBase';
import { IFileInspector } from '../IFileInspector';
import { inject } from 'inversify';
import { Types } from '../../types';
import { DependencyType, PackageVersion } from '../IPackageInspector';

export class GoPackageInspector extends PackageInspectorBase {
  private fileInspector: IFileInspector;
  private goMod!: GoMod;
  private hasLockfileFile!: boolean;

  constructor(@inject(Types.IFileInspector) fileInspector: IFileInspector) {
    super();
    this.fileInspector = fileInspector;
  }

  async init(): Promise<void> {
    try {
      this.debug('GoPkgInspector init started');
      this.hasLockfileFile = await this.fileInspector.exists('go.sum');
      // read the requirements file and remove any white lines in the string, but keep line breaks
      const goModString = (await this.fileInspector.readFile('go.mod')).replace(/^(?=\n)$|^\s*|\s*$|\n\n+/gm, '');
      this.packages = [];
      const pkgs = this.resolveGoModString(goModString);
      this.addPkgs(pkgs, DependencyType.Runtime);
      this.debug('GoPkgInspector init ended');
    } catch (e) {
      this.packages = undefined;
      this.debug(e);
    }
  }

  hasLockfile(): boolean {
    return this.hasLockfileFile;
  }

  private addPkgs(pkgs: Pkg[] | undefined, depType: DependencyType) {
    if (!pkgs) {
      return;
    }
    if (!this.packages) {
      this.packages = [];
    }
    for (const pkg of pkgs) {
      let parsedVersion: PackageVersion | undefined = {
        value: '',
        major: '',
        minor: '',
        patch: '',
      };
      if (!pkg.version) {
        return;
      }
      if (pkg.version.includes('-')) {
        pkg.version = pkg.version.split('-')[0];
        parsedVersion = PackageInspectorBase.semverToPackageVersion(pkg.version);
      }
      pkg.version = pkg.version.slice(1, pkg.version.length);
      parsedVersion = PackageInspectorBase.semverToPackageVersion(pkg.version);
      if (parsedVersion) {
        this.packages.push({
          dependencyType: depType,
          name: pkg.name,
          requestedVersion: parsedVersion,
          lockfileVersion: parsedVersion,
        });
      }
    }
  }

  private resolveGoModString(goModString: string): Pkg[] | undefined {
    if (!this.goMod) {
      this.goMod = {
        name: '',
        goVersion: '',
      };
    }
    const pkgs: Pkg[] = [];
    const lines = goModString.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const l = lines[i];
      if (i === 0) {
        this.goMod.name = l.split(' ')[1];
      } else if (i === 1) {
        this.goMod.goVersion = l.split(' ')[1];
      } else {
        if (l.endsWith('require')) {
          const pkgver = l.split(' ');
          pkgs.push({
            name: pkgver[1],
            version: pkgver[2],
          });
          return pkgs;
        } else if (l.endsWith('require (') || l.endsWith(')')) {
          continue;
        } else {
          const pkgver = l.split(' ');
          if (pkgver.length > 1) {
            pkgs.push({
              name: pkgver[0],
              version: pkgver[1],
            });
          }
        }
      }
    }
    return pkgs;
  }
}

export interface GoMod {
  name: string;
  goVersion: string;
}

interface Pkg {
  name: string;
  version: string | undefined;
}
