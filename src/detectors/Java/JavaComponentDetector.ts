import { IProjectComponentDetector } from '../IProjectComponentDetector';
import { injectable, inject } from 'inversify';
import { Types } from '../../types';
import { IPackageInspector } from '../../inspectors/IPackageInspector';
import { LanguageAtPath, ProjectComponent, ProjectComponentFramework, ProjectComponentPlatform, ProjectComponentType } from '../../model';

@injectable()
export class JavaComponentDetector implements IProjectComponentDetector {
  private packageInspector: IPackageInspector;
  constructor(@inject(Types.IPackageInspector) packageInspector: IPackageInspector) {
    this.packageInspector = packageInspector;
  }

  async detectComponent(langAtPath: LanguageAtPath): Promise<ProjectComponent[]> {
    const hasSomeAndroidPackage = this.packageInspector.hasPackage(new RegExp('com.android.support:*'));

    return [
      {
        framework: ProjectComponentFramework.UNKNOWN,
        language: langAtPath.language,
        path: langAtPath.path,
        platform: hasSomeAndroidPackage ? ProjectComponentPlatform.Android : ProjectComponentPlatform.BackEnd,
        repositoryPath: undefined,
        type: ProjectComponentType.Application,
      },
    ];
  }
}
