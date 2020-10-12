import { PackageInspectorBase } from './PackageInspectorBase';
import { injectable, inject } from 'inversify';
import { Types } from '../../types';
import { keys } from 'lodash';
import { DependencyType } from '../IPackageInspector';
import { IFileInspector } from '../IFileInspector';

@injectable()
export class PHPPackageInspector extends PackageInspectorBase {
  private fileInspector: IFileInspector;
  private composerJson!: composerJSON;
  private hasLockfileFile!: boolean;

  constructor(@inject(Types.IFileInspector) fileInspector: IFileInspector) {
    super();
    this.fileInspector = fileInspector;
  }

  async init(): Promise<void> {
    try {
      this.debug('PHPPackageInspector init started');
      const composerJsonString = await this.fileInspector.readFile('composer.json');
      this.hasLockfileFile = await this.fileInspector.exists('composer.lock');
      this.composerJson = JSON.parse(composerJsonString.replace(/\\/g, '/'));
      this.packages = [];
      this.addPackages(this.composerJson['require'], DependencyType.Runtime);
      this.addPackages(this.composerJson['require-dev'], DependencyType.Dev);
      this.debug(this.composerJson);
      this.debug(this.packages);
      this.debug('PHPPackageInspector init ended');
    } catch (e) {
      this.packages = undefined;
      this.debug(e);
    }
  }

  private addPackages(dependencies: { [name: string]: string } | undefined, depType: DependencyType) {
    if (!dependencies) {
      return;
    }
    for (const packageName of keys(dependencies)) {
      let packageVersion = dependencies[packageName];
      const parsedVersion = PackageInspectorBase.semverToPackageVersion(packageVersion);
      if (!this.packages) {
        this.packages = [];
      }
      if (parsedVersion) {
        //TODO: Also work with lockfileVersions
        this.packages.push({
          dependencyType: depType,
          name: packageName,
          requestedVersion: parsedVersion,
          lockfileVersion: parsedVersion,
        });
      }
    }
  }

  hasLockfile(): boolean | undefined {
    return this.hasLockfileFile;
  }
}

export interface composerJSON {
  name: string;
  type: string;
  description: string | undefined;
  keywords: string[] | undefined;
  homepage: string | undefined;
  license: string | undefined;
  authors: Contributor[] | undefined;
  require: { [name: string]: string } | undefined;
  'require-dev': { [name: string]: string } | undefined;
  config: PHPConfig | undefined;
  extra: { [name: string]: string } | undefined;
  autoload: PHPAutoload | undefined;
  'autoload-dev': PHPAutoload | undefined;
  'minimum-stability': string | undefined;
  'prefer-stable': boolean | undefined;
  support: { [name: string]: string } | undefined;
  scripts: { [name: string]: string } | undefined;
  bin: string[] | undefined;
  [name: string]: any | undefined;
}

interface Contributor {
  [name: string]: string | undefined;
}

interface PHPConfig {
  platform: { [name: string]: string } | undefined;
  'preferred-install': string | undefined;
  'sort-packages': boolean | undefined;
  [name: string]: any | undefined;
}

interface PHPAutoload {
  [name: string]: { [name: string]: string } | undefined;
}
