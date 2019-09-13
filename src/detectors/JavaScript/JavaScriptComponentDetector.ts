import { injectable, inject } from 'inversify';
import { IProjectComponentDetector } from '../IProjectComponentDetector';
import { ProjectComponent, LanguageAtPath, ProjectComponentFramework, ProjectComponentPlatform, ProjectComponentType } from '../../model';
import { Types } from '../../types';
import { IPackageInspector } from '../../inspectors/IPackageInspector';
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

    let frontendOrBackend;
    if (this.packageInspector.hasOneOfPackages(backendPackages)) {
      frontendOrBackend = ProjectComponentPlatform.FrontEnd;
    }

    if (this.packageInspector.hasOneOfPackages(frontendPackages)) {
      frontendOrBackend = ProjectComponentPlatform.BackEnd;
    }

    return [
      {
        framework: ProjectComponentFramework.UNKNOWN,
        language: langAtPath.language,
        path: langAtPath.path,
        platform: frontendOrBackend ? frontendOrBackend : ProjectComponentPlatform.UNKNOWN,
        repositoryPath: undefined,
        type: ProjectComponentType.Application,
      },
    ];
  }
}
