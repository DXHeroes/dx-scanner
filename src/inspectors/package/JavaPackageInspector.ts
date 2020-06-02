import { PackageInspectorBase } from './PackageInspectorBase';
import { IFileInspector } from '../IFileInspector';
import { inject } from 'inversify';
import { Types } from '../../types';
import { DependencyType, PackageVersion } from '../IPackageInspector';
import * as xml2js from 'xml2js';
import * as g2js from 'gradle-to-js';
import { ErrorFactory } from '../../lib/errors/ErrorFactory';

export class JavaPackageInspector extends PackageInspectorBase {
  private fileInspector: IFileInspector;
  private parsedDependencies: ParsedDependency[] = [];

  constructor(@inject(Types.IFileInspector) fileInspector: IFileInspector) {
    super();
    this.fileInspector = fileInspector;
  }

  async init(): Promise<void> {
    try {
      this.debug('JavaPackageInspector init started');
      this.packages = [];
      const isMaven: boolean = await this.fileInspector.exists('pom.xml');
      if (isMaven) {
        const mavenFileString = await this.fileInspector.readFile('pom.xml');
        await this.resolveMavenFileString(mavenFileString);
      } else {
        const isGradle: boolean = await this.fileInspector.exists('build.gradle');
        let isGradleKts = false;
        if (!isGradle) {
          if (await this.fileInspector.exists('build.gradle.kts')) {
            isGradleKts = true;
          } else {
            throw ErrorFactory.newInternalError('Unsupported Java project architecture');
          }
        }
        const gradleFileString = isGradleKts
          ? await this.fileInspector.readFile('build.gradle.kts')
          : await this.fileInspector.readFile('build.gradle');
        await this.resolveGradleFileString(gradleFileString);
      }
      this.addPackages(this.parsedDependencies, DependencyType.Runtime);
      this.debug('JavaPackageInspector init ended');
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
      let parsedVersion: PackageVersion | undefined = {
        value: '',
        major: '',
        minor: '',
        patch: '',
      };
      if (dependency.version) {
        parsedVersion = PackageInspectorBase.semverToPackageVersion(dependency.version);
      }
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

  private async resolveMavenFileString(mavenFileString: string) {
    xml2js.parseString(mavenFileString, (err, result: PomXML) => {
      if (err) {
        throw ErrorFactory.newInternalError(`xml2js failed to parse pom.xml: ${err.message}`);
      }
      const xmlDependencies = result.project.dependencies.values();
      for (const xmlDependency of xmlDependencies) {
        const dependencyAttributes = xmlDependency.dependency.values();
        for (const attribute of dependencyAttributes) {
          const packageName = `${attribute.groupId.pop()}:${attribute.artifactId.pop()}`;
          const version = attribute.version ? String(attribute.version.pop()) : undefined;
          this.parsedDependencies.push({ packageName, version });
        }
      }
    });
  }

  private async resolveGradleFileString(gradleFileString: string) {
    await g2js.parseText(gradleFileString).then((result: BuildGradle) => {
      for (const dependency of result.dependencies) {
        if (dependency.name.startsWith("'") && dependency.name.endsWith("'")) {
          dependency.name = dependency.name.slice(1, -1);
        }
        const version = dependency.version ? dependency.version : undefined;
        this.parsedDependencies.push({ packageName: dependency.name, version });
      }
    });
  }
}

export interface PomXML {
  project: {
    $: {
      xmlns: string;
      'xmlns:xsi': string;
      'xsi:schemaLocation': string;
    };
    modelVersion: string;
    parent: Record<string, unknown>;
    groupId: string;
    artifactId: string;
    version: string;
    name: string;
    description: string;
    properties: Record<string, unknown>;
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
    build: [
      {
        plugins: [
          {
            plugin: [
              {
                groupId: [string];
                artifactId: [string];
              },
            ];
          },
        ];
      },
    ];
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

interface ParsedDependency {
  packageName: string;
  version: string | undefined;
}
