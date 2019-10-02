import { ILanguageDetector } from '../ILanguageDetector';
import { injectable, inject } from 'inversify';
import { LanguageAtPath, ProgrammingLanguage } from '../../model';
import { IFileInspector } from '../../inspectors/IFileInspector';
import { Types } from '../../types';
import { fileNameRegExp, fileExtensionRegExp, sharedSubpath } from '../utils';
import { uniq } from 'lodash';
import * as nodePath from 'path';

@injectable()
export class CSharpLanguageDetector implements ILanguageDetector {
  private fileInspector: IFileInspector;
  constructor(@inject(Types.IFileInspector) fileInspector: IFileInspector) {
    this.fileInspector = fileInspector;
  }

  async detectLanguage(): Promise<LanguageAtPath[]> {
    const csprojFiles = await this.fileInspector.scanFor(fileExtensionRegExp(['csproj']), '/');
    const projectDirs : LanguageAtPath[] = csprojFiles
      .map(proj => nodePath.dirname(proj.path))
      .map(path => ({ path, language: ProgrammingLanguage.CSharp}));
    if(projectDirs.length > 0) {
      return projectDirs
    }
    const cSharpFiles = await this.fileInspector.scanFor(fileExtensionRegExp(['cs']), '/');
    const dirsWithProjects = uniq(cSharpFiles.map((f) => nodePath.dirname(f.path))); 
    if(dirsWithProjects.length === 0) {
      return [];
    }
    return [{ 
      language: ProgrammingLanguage.CSharp, 
      path: sharedSubpath(dirsWithProjects)
    }];
  }
}
