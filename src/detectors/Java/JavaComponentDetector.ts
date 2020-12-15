import { IProjectComponentDetector } from '../IProjectComponentDetector';
import { injectable, inject } from 'inversify';
import { Types } from '../../types';
import { IPackageInspector } from '../../inspectors/IPackageInspector';
import { LanguageAtPath, ProjectComponent, ProjectComponentFramework, ProjectComponentPlatform, ProjectComponentType } from '../../model';
import { IFileInspector } from '../../inspectors';

@injectable()
export class JavaComponentDetector implements IProjectComponentDetector {
  private packageInspector: IPackageInspector;
  private fileInspector: IFileInspector;
  constructor(
    @inject(Types.IPackageInspector) packageInspector: IPackageInspector,
    @inject(Types.IFileInspector) fileInspector: IFileInspector,
  ) {
    this.packageInspector = packageInspector;
    this.fileInspector = fileInspector;
  }

  async detectComponent(langAtPath: LanguageAtPath): Promise<ProjectComponent[]> {
    const manifests = await this.fileInspector.scanFor('AndroidManifest.xml', '/');
    const isAndroid = manifests.length > 0;

    return [
      {
        framework: ProjectComponentFramework.UNKNOWN,
        language: langAtPath.language,
        path: langAtPath.path,
        platform: isAndroid ? ProjectComponentPlatform.Android : ProjectComponentPlatform.BackEnd,
        repositoryPath: undefined,
        type: ProjectComponentType.Application,
      },
    ];
  }
}
