import { ILanguageDetector } from '../ILanguageDetector';
import { injectable, inject } from 'inversify';
import { LanguageAtPath, ProgrammingLanguage } from '../../model';
import { IFileInspector } from '../../inspectors/IFileInspector';
import { Types } from '../../types';
import { fileNameRegExp, fileExtensionRegExp, sharedSubpath } from '../utils';
import { uniq } from 'lodash';
import * as nodePath from 'path';

@injectable()
export class RubyLanguageDetector implements ILanguageDetector {
  private fileInspector: IFileInspector;
  constructor(@inject(Types.IFileInspector) fileInspector: IFileInspector) {
    this.fileInspector = fileInspector;
  }

  async detectLanguage(): Promise<LanguageAtPath[]> {
    const result: LanguageAtPath[] = [];
    const packageFiles = await this.fileInspector.scanFor(fileExtensionRegExp(['gemspec']), '/');

    if(packageFiles.length > 0) {
      for (const path of packageFiles.map((file) => nodePath.dirname(file.path))) {
        result.push({ language: ProgrammingLanguage.Ruby, path });
      }
    } else {
      const rubyFiles = await this.fileInspector.scanFor(fileExtensionRegExp(['rb']), '/');
      if (rubyFiles.length === 0) {
        return result;
      }
      const dirsWithProjects = uniq(rubyFiles.map((f) => nodePath.dirname(f.path)));
      // Get the shared subpath
      const commonPath = sharedSubpath(dirsWithProjects);
      result.push({ language: ProgrammingLanguage.Ruby, path: commonPath });
    }
    return result;
  }
}
