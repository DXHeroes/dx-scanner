import { ILanguageDetector } from '../ILanguageDetector';
import { injectable, inject } from 'inversify';
import { LanguageAtPath, ProgrammingLanguage } from '../../model';
import { IFileInspector } from '../../inspectors/IFileInspector';
import { Types } from '../../types';
import { fileNameRegExp, fileExtensionRegExp, sharedSubpath } from '../utils';
import { uniq } from 'lodash';
import * as nodePath from 'path';

@injectable()
export class PythonLanguageDetector implements ILanguageDetector {
  private fileInspector: IFileInspector;
  constructor(@inject(Types.IFileInspector) fileInspector: IFileInspector) {
    this.fileInspector = fileInspector;
  }

  async detectLanguage(): Promise<LanguageAtPath[]> {
    const result: LanguageAtPath[] = [];
    const requirementsFiles = await this.fileInspector.scanFor(fileNameRegExp('requirements.txt'), '/');
    if (requirementsFiles.length > 0) {
      for (const path of requirementsFiles.map((file) => nodePath.dirname(file.path))) {
        result.push({ language: ProgrammingLanguage.Python, path });
      }
    } else {
      const pyFiles = await this.fileInspector.scanFor(fileExtensionRegExp(['py', 'py3']), '/');
      if (pyFiles.length === 0) {
        return result;
      }
      const dirsWithProjects = uniq(pyFiles.map((f) => nodePath.dirname(f.path)));
      // Get the shared subpath
      const commonPath = sharedSubpath(dirsWithProjects);
      result.push({ language: ProgrammingLanguage.Python, path: commonPath });
    }
    return result;
  }
}
