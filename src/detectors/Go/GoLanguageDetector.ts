import { ILanguageDetector } from '../ILanguageDetector';
import { injectable, inject } from 'inversify';
import { LanguageAtPath, ProgrammingLanguage } from '../../model';
import { IFileInspector } from '../../inspectors/IFileInspector';
import { Types } from '../../types';
import { fileNameRegExp, fileExtensionRegExp, sharedSubpath } from '../utils';
import { uniq } from 'lodash';
import { Metadata } from '../../services/model';
import * as nodePath from 'path';

@injectable()
export class GoLanguageDetector implements ILanguageDetector {
  private fileInspector: IFileInspector;
  constructor(@inject(Types.IFileInspector) fileInspector: IFileInspector) {
    this.fileInspector = fileInspector;
  }

  async detectLanguage(): Promise<LanguageAtPath[]> {
    const result: LanguageAtPath[] = [];
    let packageFiles = await this.fileInspector.scanFor(fileNameRegExp('go.mod'), '/');
    if (packageFiles.length === 0) {
      packageFiles = await this.fileInspector.scanFor(fileNameRegExp('Gopkg.toml'), '/');
    }

    if (packageFiles.length > 0) {
      for (const path of packageFiles.map((file) => nodePath.dirname(file.path))) {
        result.push({ language: ProgrammingLanguage.Go, path });
      }
    } else {
      const goFiles: Metadata[] = await this.fileInspector.scanFor(fileExtensionRegExp(['go']), '/');
      if (goFiles.length === 0) {
        return result;
      }
      const dirsWithProjects = uniq(goFiles.map((f) => nodePath.dirname(f.path)));
      const commonPath = sharedSubpath(dirsWithProjects);
      result.push({ language: ProgrammingLanguage.Go, path: commonPath });
    }
    return result;
  }
}
