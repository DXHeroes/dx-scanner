import { ILanguageDetector } from '../ILanguageDetector';
import { injectable, inject } from 'inversify';
import { LanguageAtPath, ProgrammingLanguage } from '../../model';
import { IFileInspector } from '../../inspectors/IFileInspector';
import { Types } from '../../types';
import { fileExtensionRegExp, sharedSubpath } from '../utils';
import { uniq } from 'lodash';
import * as nodePath from 'path';

@injectable()
export class PHPLanguageDetector implements ILanguageDetector {
  private fileInspector: IFileInspector;
  constructor(@inject(Types.IFileInspector) fileInspector: IFileInspector) {
    this.fileInspector = fileInspector;
  }

  async detectLanguage(): Promise<LanguageAtPath[]> {
    const result: LanguageAtPath[] = [];

    const phpFiles = await this.fileInspector.scanFor(fileExtensionRegExp(['php']), '/');
    if (phpFiles.length === 0) {
      return result;
    }
    const dirsWithProjects = uniq(phpFiles.map((f) => nodePath.dirname(f.path)));
    // Get the shared subpath
    const commonPath = sharedSubpath(dirsWithProjects);
    result.push({ language: ProgrammingLanguage.PHP, path: commonPath });
    return result;
  }
}
