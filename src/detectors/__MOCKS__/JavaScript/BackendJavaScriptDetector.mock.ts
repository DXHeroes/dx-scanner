import { IProjectComponentDetector } from '../../IProjectComponentDetector';
import {
  LanguageAtPath,
  ProjectComponent,
  ProjectComponentFramework,
  ProjectComponentPlatform,
  ProjectComponentType,
} from '../../../model';
import { injectable } from 'inversify';

@injectable()
export class BackendJavaScriptDetector implements IProjectComponentDetector {
  async detectComponent(langAtPath: LanguageAtPath): Promise<ProjectComponent[]> {
    return [
      {
        path: langAtPath.path,
        language: langAtPath.language,
        framework: ProjectComponentFramework.Express,
        platform: ProjectComponentPlatform.BackEnd,
        type: ProjectComponentType.Application,
      },
    ];
  }
}
