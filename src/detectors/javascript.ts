import { Git } from '../services/git/Git';
import {
  E2ETestFramework,
  IntegrationTestFramework,
  PackageDependency,
  PackageManagement,
  PackageManagementFramework,
  ProgrammingLanguage,
  DeprecatedProjectComponent,
  ProjectComponentFramework,
  ProjectComponentPlatform,
  ProjectComponentType,
  UnitTestFramework,
} from '../model';
import { keys, uniq } from 'lodash';
import { fileExtensionRegExp, fileNameRegExp, hasOneOfPackages, indexBy, sharedSubpath } from './utils';
import Debug from 'debug';
import * as nodePath from 'path';
import { Metadata } from '../services/model';
import { MetadataType } from '../services/model';

const debug = Debug('cli:detectors:javascript');

export class JavascriptComponentDetector {
  private git: Git;

  constructor(git: Git) {
    this.git = git;
  }

  async detect(): Promise<DeprecatedProjectComponent[]> {
    const result: DeprecatedProjectComponent[] = [];
    // First Scan for package files
    const packageFiles = await this.scanFor(fileNameRegExp('package.json'), '/');
    if (packageFiles.length > 0) {
      for (const path of packageFiles.map((f) => nodePath.dirname(f.path))) {
        const project = await this.determineProjectAtPath(path);
        result.push(project);
      }
    } else {
      // new RegExp(/.*\.(tsx|jsx|ts|js)$/, 'i')
      // We have to go deeper
      const jsOrTsFiles = await this.scanFor(fileExtensionRegExp(['tsx', 'jsx', 'js', 'ts']), '/');
      const dirsWithProjects = uniq(jsOrTsFiles.map((f) => nodePath.dirname(f.path)));
      // Get the shared subpath
      const commonPath = sharedSubpath(dirsWithProjects);
      const project = await this.determineProjectAtPath(commonPath);
      result.push(project);
    }
    return result;
  }

  private async determineProjectAtPath(path: string): Promise<DeprecatedProjectComponent> {
    debug('Determining at ' + path);
    const packageManagement = await this.determinePackageManagement(path);
    const hasTypescriptFiles = (await this.scanFor(fileExtensionRegExp(['tsx', 'ts']), path)).length > 0;
    const hasTestFiles = (await this.scanFor(fileExtensionRegExp(['test.ts', 'spec.ts', 'test.js', 'spec.js']), path)).length > 0;
    const unitTestFramework = hasOneOfPackages(['jest'], packageManagement) ? UnitTestFramework.Jest : UnitTestFramework.UNKNOWN;
    const hasCodeCoverage = unitTestFramework === UnitTestFramework.Jest ? true : hasOneOfPackages(['istanbul'], packageManagement);
    const hasFrontendPackages = hasOneOfPackages(['@angular/core', 'react', 'vue', 'backbone'], packageManagement);
    const hasE2ETestingFramework = hasOneOfPackages(['nightwatch', 'protractor'], packageManagement);
    const hasIntegrationFramework = hasOneOfPackages(['newman'], packageManagement);
    const hasBackendPackages = hasOneOfPackages(
      ['express', 'node', 'koa', 'hapi', 'flatiron', 'locomotive', 'nodal', '@adonisjs/framework', 'thinkjs', 'sails', '@types/node'],
      packageManagement,
    );
    let platform = ProjectComponentPlatform.UNKNOWN;
    if (hasFrontendPackages) {
      platform = ProjectComponentPlatform.FrontEnd;
    } else if (hasBackendPackages) {
      platform = ProjectComponentPlatform.BackEnd;
    }
    return {
      path,
      githubUrl: undefined,
      git: undefined,
      type: ProjectComponentType.Application,
      framework: ProjectComponentFramework.UNKNOWN,
      platform,
      language: hasTypescriptFiles ? ProgrammingLanguage.TypeScript : ProgrammingLanguage.JavaScript,
      testing: {
        hasCodeCoverage,
        codeCoveragePercentage: undefined,
        e2eTestFramework: hasE2ETestingFramework ? E2ETestFramework.UNKNOWN : undefined,
        unitTestFramework: hasTestFiles ? UnitTestFramework.UNKNOWN : undefined,
        integrationTestFramework: hasIntegrationFramework ? IntegrationTestFramework.UNKNOWN : undefined,
      },
      packageManagement,
    };
  }

  private async determinePackageManagement(path: string): Promise<PackageManagement | undefined> {
    try {
      let system: PackageManagementFramework = PackageManagementFramework.NPM;
      const packageJsonContent = await this.git.getTextFileContent(path + '/package.json');
      const hasYarnLockfile =
        (await this.scanFor(fileNameRegExp('yarn.lock'), path, {
          shallow: true,
        })).length > 0;
      const hasNpmLockfile =
        (await this.scanFor(fileNameRegExp('package-lock.json'), path, {
          shallow: true,
        })).length > 0;
      if (hasYarnLockfile || packageJsonContent.includes('yarn')) {
        system = PackageManagementFramework.Yarn;
      }
      const packageJson: PackageJson = JSON.parse(packageJsonContent);
      const allDependencies: PackageJson['dependencies'] = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
      };
      const dependencies: PackageDependency[] = keys(allDependencies).map((dependencyName) => {
        return {
          name: dependencyName,
          versionString: allDependencies[dependencyName],
        };
      });

      return {
        framework: system,
        hasLockfile: hasNpmLockfile || hasYarnLockfile,
        packages: indexBy(dependencies, (d) => {
          return d.name;
        }),
      };
    } catch (e) {
      debug('No package.json at path ' + path);
      return undefined;
    }
  }

  async scanFor(
    fileName: RegExp | string,
    path: string,
    options?: {
      ignoreSubPaths?: string[];
      shallow?: boolean;
    },
  ): Promise<Metadata[]> {
    options = options || {};
    let result: Metadata[] = [];
    const dirContents = await this.git.readDirectory(path);
    debug(`Scanning for ${fileName.toString()} in ${path}`);
    if (options.ignoreSubPaths) {
      options.ignoreSubPaths.forEach((pathToIgnore) => {
        if (path.startsWith(pathToIgnore) || path.startsWith(`/${pathToIgnore}`)) {
          return result;
        }
      });
    }
    // debug(dirContents);
    for (const entry of dirContents) {
      const entryMetadata = await this.git.getMetadata(`${path}/${entry}`);
      if (entryMetadata.type === MetadataType.file) {
        if (entryMetadata.name.match(fileName)) {
          result.push(entryMetadata);
        }
      } else if (options.shallow === false && entryMetadata.type === MetadataType.dir) {
        const subResult = await this.scanFor(fileName, entryMetadata.path);
        result = [...result, ...subResult];
      }
    }
    return result;
  }
}

interface PackageJson {
  name?: string;
  version?: string;
  description?: string;
  lciense?: string;
  dependencies?: { [depName: string]: string };
  devDependencies?: { [depName: string]: string };
  scripts?: { [scriptName: string]: string };
}
