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
    const backendPackages = ['express', 'koa', 'hapi', 'flatiron', 'locomotive', 'nodal', '@adonisjs/framework', 'thinkjs', 'sails'];

    const frontendPackages = ['webpack', 'jquery', 'gulp', 'grunt', 'browserify', 'babel'];

    let frontendOrBackend;
    if (this.packageInspector.hasOneOfPackages(backendPackages)) {
      frontendOrBackend = ProjectComponentPlatform.BackEnd;
    }

    if (this.packageInspector.hasOneOfPackages(frontendPackages)) {
      frontendOrBackend = ProjectComponentPlatform.FrontEnd;
    }

    return [
      {
        framework: ProjectComponentFramework.UNKNOWN,
        language: langAtPath.language,
        path: langAtPath.path,
        platform: frontendOrBackend ? frontendOrBackend : ProjectComponentPlatform.UNKNOWN,
        repositoryPath: undefined,
        type: frontendOrBackend ? ProjectComponentType.Application : ProjectComponentType.Library,
      },
    ];
  }
}
