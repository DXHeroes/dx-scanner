import { PackageInspectorBase } from './PackageInspectorBase';
import { inject } from 'inversify';
import { Types } from '../../types';
import { keys } from 'lodash';
import { DependencyType } from '../IPackageInspector';
import { IFileInspector } from '../IFileInspector';
import { measurable } from '../../lib/measurable';

@measurable()
export class JavaScriptPackageInspector extends PackageInspectorBase {
  private fileInspector: IFileInspector;
  private packageJson!: PackageJSON;
  private hasLockfileFile!: boolean;

  constructor(@inject(Types.IFileInspector) fileInspector: IFileInspector) {
    super();
    this.fileInspector = fileInspector;
  }

  async init(): Promise<void> {
    try {
      this.debug('JSPackageInspector init started');
      const packageJsonString = await this.fileInspector.readFile('package.json');
      this.hasLockfileFile = (await this.fileInspector.exists('yarn.lock')) || (await this.fileInspector.exists('package-lock.json'));
      this.packageJson = JSON.parse(packageJsonString);
      this.packages = [];
      this.addPackages(this.packageJson.dependencies, DependencyType.Runtime);
      this.addPackages(this.packageJson.devDependencies, DependencyType.Dev);
      this.addPackages(this.packageJson.peerDependencies, DependencyType.Peer);
      this.debug(this.packageJson);
      this.debug(this.packages);
      this.debug('JSPackageInspector init ended');
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

export interface PackageJSON {
  name: string;
  version: string;
  main: string;
  repository: string;
  author: string;
  contributors: Contributor[] | undefined;
  license: string;
  engineStrinct: boolean | undefined;
  engines: { [name: string]: string } | undefined;
  scripts: { [name: string]: string } | undefined;
  dependencies: { [name: string]: string } | undefined;
  devDependencies: { [name: string]: string } | undefined;
  peerDependencies: { [name: string]: string } | undefined;
}

interface Contributor {
  name: string;
  email: string;
  url: string;
}
