import { PackageInspectorBase } from './PackageInspectorBase';
import { IFileInspector } from '../IFileInspector';
import { inject } from 'inversify';
import { Types } from '../../types';
import { DependencyType } from '../IPackageInspector';
import * as xml2js from 'xml2js';

export class JavaPackageInspector extends PackageInspectorBase {
  private fileInspector: IFileInspector;
  private hasLockfileFile!: boolean;

  constructor(@inject(Types.IFileInspector) fileInspector: IFileInspector) {
    super();
    this.fileInspector = fileInspector;
  }

  async init(): Promise<void> {
    try {
      this.debug('JavaPackageInspector init started');
      this.packages = [];
      const parsedDependencies: ParsedDependency[] = [];
      const mavenFileString = await this.fileInspector.readFile('pom.xml');
      if (!mavenFileString) {
        const gradleFileString = await this.fileInspector.readFile('build.gradle');
      }
      xml2js.parseString(mavenFileString, (err, result: PomXML) => {
        const xmlDependencies = result.project.dependencies.values();
        for (const xmlDependency of xmlDependencies) {
          const dependencyAttributes = xmlDependency.dependency.values();
          for (const attribute of dependencyAttributes) {
            parsedDependencies.push({ packageName: attribute.artifactId[0], version: attribute.version[0] });
          }
        }
        this.addPackages(parsedDependencies, DependencyType.Runtime);
        this.debug('JSPackageInspector init ended');
      });
    } catch (e) {
      this.packages = undefined;
      this.debug(e);
    }
  }

  hasLockfile(): boolean {
    return false;
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
}

export interface PomXML {
  // @todo: cut down this interface to simplify it
  project: {
    $: {
      xmlns: string;
      'xmlns:xsi': string;
      'xsi:schemaLocation': string;
    };
    modelVersion: string;
    parent: {};
    groupId: string;
    artifactId: string;
    version: string;
    name: string;
    description: string;
    properties: {};
    dependencies: [
      {
        dependency: [
          {
            groupId: [string];
            artifactId: [string];
            version: [string];
            scope?: [string];
            exclusions?: [string];
          },
        ];
      },
    ];
    build: {};
  };
}

export interface ParsedDependency {
  packageName: string;
  version: string;
}
