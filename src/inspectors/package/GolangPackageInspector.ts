import { PackageInspectorBase } from './PackageInspectorBase';
import { IFileInspector } from '../IFileInspector';
import { inject } from 'inversify';
import { Types } from '../../types';
import { DependencyType, PackageVersion } from '../IPackageInspector';

export class GolangPackageInspector extends PackageInspectorBase {
  private fileInspector: IFileInspector;
  private goMod!: GoMod;
  private hasLockfileFile!: boolean;

  constructor(@inject(Types.IFileInspector) fileInspector: IFileInspector) {
    super();
    this.fileInspector = fileInspector;
  }

  async init(): Promise<void> {
    try {
      this.debug('GolangPkgInspector init started');
      // TODO implement for Gopkg.toml
      this.hasLockfileFile = await this.fileInspector.exists('go.sum');
      const goModString = (await this.fileInspector.readFile('go.mod')).replace(/^(?=\n)$|^\s*|\s*$|\n\n+/gm, '');
      this.packages = [];
      this.resolveGoModString(goModString);
      this.debug('GolangPkgInspector init ended');
    } catch (e) {
      this.packages = undefined;
      this.debug(e);
    }
  }

  hasLockfile(): boolean {
    return this.hasLockfileFile;
  }

  private addPkg(pkg: Pkg | undefined, depType: DependencyType) {
    if (!pkg) {
      return;
    }
    if (!this.packages) {
      this.packages = [];
    }
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
      // TODO Also work with lockfileVersions
      this.packages.push({
        dependencyType: depType,
        name: pkg.name,
        requestedVersion: parsedVersion,
        lockfileVersion: parsedVersion,
      });
    }
  }

  // TODO own helper for this?
  private resolveGoModString(goModString: string) {
    if (!this.goMod) {
      this.goMod = {
        name: '',
        goVersion: '',
      };
    }
    const lines = goModString.split('\n');
    // TODO should use enum
    let mode = 'module';
    for (const l of lines) {
      switch (mode) {
        case 'module':
          this.goMod.name = l.split(' ')[1];
          mode = 'go';
        case 'go':
          this.goMod.goVersion = l.split(' ')[1];
          mode = 'pkgs';
        // TODO handle indirect and incompatible
        case 'pkgs':
          if (l.endsWith('require')) {
            const pkgver = l.split(' ');
            const pkg: Pkg = {
              name: pkgver[1],
              version: pkgver[2],
            };
            this.addPkg(pkg, DependencyType.Runtime);
            return;
          } else {
            const pkgver = l.split(' ');
            if (pkgver.length > 1) {
              const pkg: Pkg = {
                name: pkgver[0],
                version: pkgver[1],
              };
              this.addPkg(pkg, DependencyType.Runtime);
            }
          }
      }
    }
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
