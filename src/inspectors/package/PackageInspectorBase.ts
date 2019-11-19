import { IPackageInspector, Package, PackageOptions, PackageVersion } from '../IPackageInspector';
import { IInitiable } from '../../lib/IInitable';
import { isArray } from 'util';
import { injectable } from 'inversify';
import { debug } from 'debug';
import { valid, coerce } from 'semver';
import { intersection } from 'lodash';

@injectable()
export abstract class PackageInspectorBase implements IPackageInspector, IInitiable {
  packages: Package[] | undefined;
  abstract init(): Promise<void>;
  abstract hasLockfile(): boolean | undefined;
  protected debug: debug.Debugger;

  constructor() {
    this.debug = debug('package-inspector');
  }

  hasPackageManagement(): boolean {
    return isArray(this.packages);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  findPackages(searchTerm: string | RegExp): Package[] {
    throw new Error('Method not implemented.');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  hasPackage(name: string | RegExp, options?: PackageOptions | undefined): boolean {
    if (!this.packages) {
      return false;
    }
    for (const pkg of this.packages) {
      if (typeof name === 'string') {
        if (pkg.name.toLowerCase() === name.toLowerCase()) {
          return true;
        }
      } else {
        if (name.test(pkg.name.toLowerCase())) {
          return true;
        }
      }
    }
    return false;
  }

  hasOneOfPackages(packages: string[]): boolean {
    if (!this.packages) {
      return false;
    }
    if (
      intersection(
        this.packages.map((p) => p.name),
        packages,
      ).length > 0
    ) {
      return true;
    }
    return false;
  }

  findPackage(name: string, options?: PackageOptions | undefined): Package | undefined {
    if (options) {
      throw new Error('Options not implemented.');
    }
    if (!this.packages) {
      return undefined;
    }
    for (const pkg of this.packages) {
      if (pkg.name.toLowerCase() === name.toLowerCase()) {
        return pkg;
      }
    }
    return undefined;
  }

  static semverToPackageVersion(semverString: string): PackageVersion | undefined {
    const coerced = coerce(semverString);
    if (coerced) {
      const version = valid(coerced);
      if (version) {
        const splitted = version.split('.');
        return {
          value: semverString,
          major: splitted[0],
          minor: splitted[1],
          patch: splitted[2],
        };
      }
    }
    return undefined;
  }
}
