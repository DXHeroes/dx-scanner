import { injectable, inject } from 'inversify';
import { IProjectComponentDetector } from '../IProjectComponentDetector';
import { ProjectComponent, LanguageAtPath, ProjectComponentFramework, ProjectComponentPlatform, ProjectComponentType } from '../../model';
import { Types } from '../../types';
import { IPackageInspector } from '../../inspectors/IPackageInspector';
import { measurable } from '../../lib/measurable';

@measurable()
@injectable()
export class JavaScriptComponentDetector implements IProjectComponentDetector {
  private packageInspector: IPackageInspector;
  constructor(
    @inject(Types.IPackageInspector)
    packageInspector: IPackageInspector,
  ) {
    this.packageInspector = packageInspector;
  }

  async detectComponent(langAtPath: LanguageAtPath): Promise<ProjectComponent[]> {
    const backendPackages = [
      'express',
      'node',
      'koa',
      'hapi',
      'flatiron',
      'locomotive',
      'nodal',
      '@adonisjs/framework',
      'thinkjs',
      'sails',
      '@types/node',
    ];

    const frontendPackages = ['webpack', 'jquery', 'gulp', 'grunt', 'browserify', 'babel'];

    if (this.packageInspector.hasOneOfPackages(backendPackages)) {
      return [
        {
          framework: ProjectComponentFramework.UNKNOWN,
          language: langAtPath.language,
          path: langAtPath.path,
          platform: ProjectComponentPlatform.BackEnd,
          repositoryPath: undefined,
          type: ProjectComponentType.Application,
        },
      ];
    }

    if (this.packageInspector.hasOneOfPackages(frontendPackages)) {
      return [
        {
          framework: ProjectComponentFramework.UNKNOWN,
          language: langAtPath.language,
          path: langAtPath.path,
          platform: ProjectComponentPlatform.FrontEnd,
          repositoryPath: undefined,
          type: ProjectComponentType.Application,
        },
      ];
    }

    return [];
  }
}
