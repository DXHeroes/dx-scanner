import { ILanguageDetector } from '../ILanguageDetector';
import { injectable, inject } from 'inversify';
import { LanguageAtPath, ProgrammingLanguage } from '../../model';
import { IFileInspector } from '../../inspectors/IFileInspector';
import { Types } from '../../types';
import { fileNameRegExp, fileExtensionRegExp, sharedSubpath } from '../utils';
import { uniq } from 'lodash';
import * as nodePath from "path"

@injectable()
export class JavaScriptLanguageDetector implements ILanguageDetector {
  private fileInspector: IFileInspector;
  constructor(@inject(Types.IFileInspector) fileInspector: IFileInspector) {
    this.fileInspector = fileInspector;
  }

  async detectLanguage(): Promise<LanguageAtPath[]> {
    const result: LanguageAtPath[] = [];
    const packageFiles = await this.fileInspector.scanFor(fileNameRegExp('package.json'), '/');
    const hasTsFiles = (await this.fileInspector.scanFor(fileExtensionRegExp(['tsx', 'ts']), '/')).length > 0;
    if (packageFiles.length > 0) {
      for (const path of packageFiles.map((file) => nodePath.dirname(file.path))) {
        result.push({ language: hasTsFiles ? ProgrammingLanguage.TypeScript : ProgrammingLanguage.JavaScript, path });
      }
    } else {
      // @todo: Have separate typescript language detector
      // new RegExp(/.*\.(tsx|jsx|ts|js)$/, 'i')
      // We have to go deeper
      const jsOrTsFiles = await this.fileInspector.scanFor(fileExtensionRegExp(['tsx', 'jsx', 'js', 'ts']), '/');
      if (jsOrTsFiles.length === 0) {
        return result;
      }
      // if (jsOrTsFiles.length === 0) return result;
      const dirsWithProjects = uniq(jsOrTsFiles.map(f => nodePath.dirname(f.path)));
      // Get the shared subpath
      const commonPath = sharedSubpath(dirsWithProjects);
      result.push({ language: hasTsFiles ? ProgrammingLanguage.TypeScript : ProgrammingLanguage.JavaScript, path: commonPath });
    }
    return result;
  }
}
