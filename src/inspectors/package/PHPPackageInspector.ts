import { PackageInspectorBase } from './PackageInspectorBase';
import { injectable, inject } from 'inversify';
import { Types } from '../../types';
import { keys } from 'lodash';
import { DependencyType } from '../IPackageInspector';
import { IFileInspector } from '../IFileInspector';
import { Package as composerJSON } from './generated/composer-schema';

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
      this.addPackages(this.composerJson.require, DependencyType.Runtime);
      // 'require-dev' must be in kebab-case
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
      const packageVersion = dependencies[packageName];
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
