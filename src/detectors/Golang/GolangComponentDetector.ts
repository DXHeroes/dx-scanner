import { IProjectComponentDetector } from '../IProjectComponentDetector';
import { injectable, inject } from 'inversify';
import { Types } from '../../types';
import { IPackageInspector } from '../../inspectors/IPackageInspector';
import { LanguageAtPath, ProjectComponent, ProjectComponentFramework, ProjectComponentPlatform, ProjectComponentType } from '../../model';

@injectable()
export class GolangComponentDetector implements IProjectComponentDetector {
  private packageInspector: IPackageInspector;
  constructor(@inject(Types.IPackageInspector) packageInspector: IPackageInspector) {
    this.packageInspector = packageInspector;
  }

  async detectComponent(langAtPath: LanguageAtPath): Promise<ProjectComponent[]> {
    return [
      {
        framework: ProjectComponentFramework.UNKNOWN,
        language: langAtPath.language,
        path: langAtPath.path,
        platform: ProjectComponentPlatform.BackEnd,
        // TODO get repositoryPath from go.mod
        repositoryPath: undefined,
        type: ProjectComponentType.Application,
      },
    ];
  }
}
