import { PackageInspectorBase } from './PackageInspectorBase';
import { IFileInspector } from '../IFileInspector';
import { inject } from 'inversify';
import { Types } from '../../types';
import { DependencyType } from '../IPackageInspector';
import * as xml2js from 'xml2js';
import * as g2js from 'gradle-to-js';

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
      const isMaven: boolean = await this.fileInspector.exists('pom.xml');
      if (isMaven) {
        const mavenFileString = await this.fileInspector.readFile('pom.xml');
        xml2js.parseString(mavenFileString, (err, result: PomXML) => {
          if (err) {
            throw err;
          }
          const xmlDependencies = result.project.dependencies.values();
          for (const xmlDependency of xmlDependencies) {
            const dependencyAttributes = xmlDependency.dependency.values();
            for (const attribute of dependencyAttributes) {
              // should an error be thrown here or should a version be set to an empty string '' instead?
              if (!attribute.version.pop()) {
                throw new Error(`Dependency version of ${attribute.artifactId.pop()} is not available`);
              }
              parsedDependencies.push({ packageName: String(attribute.artifactId.pop()), version: String(attribute.version.pop()) });
            }
            this.addPackages(parsedDependencies, DependencyType.Runtime);
          }
        });
      } else {
        const isGradle: boolean = await this.fileInspector.exists('build.gradle');
        if (!isGradle) {
          throw new Error('Unsupported Java project architecture');
        }
        const gradleFileString = await this.fileInspector.readFile('build.gradle');
        g2js.parseText(gradleFileString).then((result: BuildGradle) => {
          for (const dependency of result.dependencies) {
            parsedDependencies.push({ packageName: dependency.name, version: dependency.version });
          }
          this.addPackages(parsedDependencies, DependencyType.Runtime);
        });
      }
      this.debug('JSPackageInspector init ended');
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

export interface BuildGradle {
  plugins: [];
  group: string;
  version: string;
  sourceCompatibility: string;
  repositories: [];
  dependencies: [
    {
      group: string;
      name: string;
      version: string;
      type: string;
      excludes: [];
    },
  ];
}

export interface ParsedDependency {
  packageName: string;
  version: string;
}
