import { PackageInspectorBase } from './PackageInspectorBase';
import { injectable, inject } from 'inversify';
import { Types } from '../../types';
import { IFileInspector } from '../IFileInspector';

import * as TOML from '@iarna/toml';
import { DependencyType, Package, PackageVersion } from '../IPackageInspector';

const isRecord = function(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
};
const isString = function (v: unknown): v is string {
  return typeof v === 'string';
};
const isOptString = function(v: unknown): v is string | undefined {
  return typeof v === 'string' || v === undefined;
};
const isOptBool = function(v: unknown): v is boolean | undefined {
  return typeof v === 'boolean' || v === undefined;
};
const isOptStringArray = function(v: unknown): v is string[] | undefined {
  return v === undefined || (Array.isArray(v) && v.every((e) => typeof e === 'string'));
};

/**
 * Similar to `lodash.conformsTo` but runs the check on `undefined` instead of failing.
 */
function conformsOptional(check: Record<string, (v: unknown) => boolean>, value: Record<string, unknown>): boolean {
  return Object.keys(check).every((key) => check[key](value[key]));
}

@injectable()
export class RustPackageInspector extends PackageInspectorBase {
  private readonly fileInspector: IFileInspector;
  cargoLock?: CargoLock;
  cargoManifest?: CargoManifest | CargoWorkspaceManifest;

  constructor(@inject(Types.IFileInspector) fileInspector: IFileInspector) {
    super();

    this.fileInspector = fileInspector;
  }

  async init(): Promise<void> {
    try {
      this.debug('RustPackageInspector init started');

      const cargoLockString = await this.fileInspector
        .readFile('Cargo.lock')
        .catch((err) => (err.code === 'ENOENT' ? Promise.resolve(undefined) : Promise.reject(err)));
      if (cargoLockString !== undefined) {
        const cargoLockToml = TOML.parse(cargoLockString);
        this.cargoLock = RustPackageInspector.parseLock(cargoLockToml);
      }

      const cargoManifestString = await this.fileInspector
        .readFile('Cargo.toml')
        .catch((err) => (err.code === 'ENOENT' ? Promise.resolve(undefined) : Promise.reject(err)));
      if (cargoManifestString !== undefined) {
        const cargoManifestToml = TOML.parse(cargoManifestString);

        if ('workspace' in cargoManifestToml) {
          this.cargoManifest = {
            workspace: RustPackageInspector.parseWorkspace(cargoManifestToml['workspace']),
          };
          this.packages = [];
        } else {
          this.cargoManifest = {
            package: RustPackageInspector.parsePackage(cargoManifestToml['package']),
            ...RustPackageInspector.parseDependencySet(cargoManifestToml),
            target: RustPackageInspector.parseTarget(cargoManifestToml['target']),
            bin: RustPackageInspector.parseBin(cargoManifestToml['bin']),
            profile: cargoManifestToml['profile'],
          };

          this.packages = RustPackageInspector.extractPackages(this.cargoManifest, this.cargoLock);
        }
      }

      this.debug(this.cargoLock);
      this.debug(this.cargoManifest);
      this.debug('RustPackageInspector init ended');
    } catch (e) {
      this.packages = undefined;
      this.debug(e);
      console.error(e);
    }
  }

  hasLockfile(): boolean | undefined {
    return this.cargoLock !== undefined;
  }

  private static parseWorkspace(value: unknown): CargoWorkspaceManifest['workspace'] {
    if (isRecord(value)) {
      const members = value['members'];
      if (Array.isArray(members) && members.every((m) => typeof m === 'string')) {
        return {
          members,
        };
      }
    }

    throw new Error('Could not parse Cargo.toml workspace');
  }

  private static parseDependency(key: string, value: unknown): ManifestDependency {
    if (typeof value === 'string') {
      return {
        name: key,
        version: value,
      };
    }

    if (isRecord(value)) {
      if (
        conformsOptional(
          {
            version: isOptString,
            path: isOptString,
            git: isOptString,
            branch: isOptString,
            package: isOptString,
            optional: isOptBool,
            'default-features': isOptBool,
            features: isOptStringArray,
            registry: isOptString,
          },
          value,
        )
      ) {
        // Safe because we just checked that it conforms
        const v = (value as unknown) as ManifestDependency;
        v.name = key;

        return v;
      }
    }

    throw new Error(`Could not parse Cargo.toml dependency "${key}"`);
  }

  private static parseDependencies(values: unknown): ReadonlyArray<ManifestDependency> {
    const result: ManifestDependency[] = [];

    if (values === undefined) {
      return result;
    }

    if (isRecord(values)) {
      for (const key of Object.keys(values)) {
        result.push(RustPackageInspector.parseDependency(key, values[key]));
      }

      return result;
    }

    throw new Error('Could not parse Cargo.toml dependencies array');
  }

  private static parseDependencySet(obj: Record<string, unknown>): DependecySet {
    return {
      dependencies: RustPackageInspector.parseDependencies(obj['dependencies']),
      'dev-dependencies': RustPackageInspector.parseDependencies(obj['dev-dependencies']),
      'build-dependencies': RustPackageInspector.parseDependencies(obj['build-dependencies']),
    };
  }

  private static parseTarget(value: unknown): CargoManifest['target'] {
    if (value === undefined) {
      return {};
    }

    if (isRecord(value)) {
      const result: CargoManifest['target'] = {};

      for (const key of Object.keys(value)) {
        const target = value[key];
        if (isRecord(target)) {
          result[key] = RustPackageInspector.parseDependencySet(target);
        }
      }

      return result;
    }

    console.error(value);
    throw new Error('Could not parse Cargo.toml target table');
  }

  private static parseBinaryInfo(value: unknown): BinaryInfo {
    if (isRecord(value)) {
      if (
        conformsOptional(
          {
            name: isString,
            path: isString,
          },
          value,
        )
      ) {
        // Safe because we just checked conformity
        return (value as unknown) as BinaryInfo;
      }
    }

    throw new Error('Could not parse Cargo.toml bin array entry');
  }

  private static parseBin(value: unknown): CargoManifest['bin'] {
    if (value === undefined) {
      return [];
    }

    if (Array.isArray(value)) {
      return value.map((e) => RustPackageInspector.parseBinaryInfo(e));
    }

    throw new Error('Could not parse Cargo.toml bin array');
  }

  private static parsePackage(value: unknown): CargoManifest['package'] {
    if (isRecord(value)) {
      if (
        conformsOptional(
          {
            name: isString,
            version: isString,
            authors: isOptStringArray,
            edition: (v) => v === '2015' || v === '2018',
            description: isOptString,
            documentation: isOptString,
            readme: isOptString,
            homepage: isOptString,
            repository: isOptString,
            license: isOptString,
            'license-file': isOptString,
            keywords: isOptStringArray,
            categories: isOptStringArray,
            workspace: isOptString,
            build: isOptString,
            links: isOptString,
            exclude: isOptStringArray,
            include: isOptStringArray,
            publish: (v) => typeof v === 'boolean' || isOptStringArray(v),
            metadata: (v) => v === undefined || isRecord(v),
            'default-run': isOptString,
          },
          value,
        )
      ) {
        return value as CargoManifest['package'];
      }
    }

    throw new Error('Could not parse Cargo.toml package table');
  }

  private static parseLockPackage(value: unknown): CargoLockPackage {
    if (isRecord(value)) {
      if (
        conformsOptional(
          {
            name: isString,
            version: isString,
            source: isOptString,
            checksum: isOptString,
            dependencies: isOptStringArray,
          },
          value,
        )
      ) {
        return (value as unknown) as CargoLockPackage;
      }
    }

    throw new Error('Could not parse Cargo.lock package');
  }

  private static parseLock(value: unknown): CargoLock {
    if (isRecord(value)) {
      if (Array.isArray(value['package'])) {
        const result: {
          package: CargoLockPackage[];
        } = {
          package: [],
        };

        result.package.push(...value['package'].map((p) => RustPackageInspector.parseLockPackage(p)));

        return result;
      }
    }

    throw new Error('Could not parse Cargo.lock');
  }

  private static parseSemver(version: string | undefined): PackageVersion {
    let result = undefined;
    if (version !== undefined) {
      result = PackageInspectorBase.semverToPackageVersion(version);
    }

    return (
      result ?? {
        value: '0.0.0',
        major: '0',
        minor: '0',
        patch: '0',
      }
    );
  }

  private static extractPackages(manifest: CargoManifest, lockFile?: CargoLock): Package[] {
    const parseDep = (type: DependencyType, dep: ManifestDependency) => {
      const name = dep.package ?? dep.name;

      const version = RustPackageInspector.parseSemver(dep.version);
      const lockVersion =
        lockFile === undefined ? version : RustPackageInspector.parseSemver(lockFile.package.find((p) => p.name === name)?.version);
      return {
        dependencyType: type,
        name,
        requestedVersion: version,
        lockfileVersion: lockVersion,
      };
    };
    const parseRuntimeDep = parseDep.bind(undefined, DependencyType.Runtime);
    const parseDevDep = parseDep.bind(undefined, DependencyType.Dev);

    const result: Package[] = [];

    result.push(
      ...manifest.dependencies.map(parseRuntimeDep),
      ...manifest['dev-dependencies'].map(parseDevDep),
      // ...manifest["build-dependencies"].map(), // TODO
      ...Object.values(manifest.target ?? {}).flatMap((target) =>
        target.dependencies.map(parseRuntimeDep).concat(
          ...target['dev-dependencies'].map(parseDevDep),
          // ...target["build-dependencies"].map() // TODO
        ),
      ),
    );

    return result;
  }
}

export interface ManifestDependency {
  name: string;
  version?: string;
  path?: string;
  git?: string;
  branch?: string;
  package?: string;
  optional?: boolean;
  'default-features'?: boolean;
  features?: string[];
  registry?: string;
}
export interface BinaryInfo {
  name: string;
  path: string;
}

interface DependecySet {
  dependencies: ReadonlyArray<ManifestDependency>;
  'dev-dependencies': ReadonlyArray<ManifestDependency>;
  'build-dependencies': ReadonlyArray<ManifestDependency>;
}
// https://doc.rust-lang.org/cargo/reference/manifest.html
export interface CargoManifest extends DependecySet {
  package: {
    name: string;
    version: string;
    authors?: string[];
    edition?: '2015' | '2018';
    description?: string;
    documentation?: string;
    readme?: string;
    homepage?: string;
    repository?: string;
    license?: string;
    'license-file'?: string;
    keywords?: string[];
    categories?: string[];
    workspace?: string;
    build?: string;
    links?: string;
    exclude?: string[];
    include?: string[];
    publish?: boolean | string[];
    metadata?: Record<string, unknown>;
    'default-run'?: string;
  };
  bin: ReadonlyArray<BinaryInfo>;
  target: Record<string, DependecySet>;
  profile?: unknown;
}
export interface CargoWorkspaceManifest {
  workspace: {
    members: string[];
  };
}

interface CargoLockPackage {
  name: string;
  version: string;
  source?: string;
  checksum?: string;
  dependencies?: string[];
}
export interface CargoLock {
  package: ReadonlyArray<CargoLockPackage>;
}
