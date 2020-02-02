import { ILanguageDetector } from '../ILanguageDetector';
import { injectable, inject } from 'inversify';
import { IFileInspector } from '../../inspectors/IFileInspector';
import { Types } from '../../types';
import { LanguageAtPath, ProgrammingLanguage } from '../../model';
import { fileNameRegExp, fileExtensionRegExp, sharedSubpath } from '../utils';
import { Metadata } from '../../services/model';
import * as nodePath from 'path';
import { uniq } from 'lodash';

@injectable()
export class JavaLanguageDetector implements ILanguageDetector {
  private fileInspector: IFileInspector;
  constructor(@inject(Types.IFileInspector) fileInspector: IFileInspector) {
    this.fileInspector = fileInspector;
  }

  async detectLanguage(): Promise<LanguageAtPath[]> {
    const result: LanguageAtPath[] = [];
    let packageFiles: Metadata[] = await this.fileInspector.scanFor(fileNameRegExp('pom.xml'), '/');
    const isMaven: boolean = packageFiles.length > 0;
    const ktFiles: Metadata[] = await this.fileInspector.scanFor(fileExtensionRegExp(['kt', 'kts']), '/');
    const hasKtFiles = ktFiles.length > 0;
    if (!isMaven) {
      packageFiles = hasKtFiles
        ? await this.fileInspector.scanFor(fileNameRegExp('build.gradle.kts'), '/')
        : await this.fileInspector.scanFor(fileNameRegExp('build.gradle'), '/');
    }
    if (packageFiles.length > 0) {
      for (const path of packageFiles.map((file) => nodePath.dirname(file.path))) {
        result.push({ language: hasKtFiles ? ProgrammingLanguage.Kotlin : ProgrammingLanguage.Java, path });
      }
    } else {
      const javaFiles: Metadata[] = await this.fileInspector.scanFor(fileExtensionRegExp(['java']), '/');
      if (javaFiles.length === 0 && ktFiles.length === 0) {
        return result;
      }
      const javaOrKtFiles = javaFiles.concat(ktFiles);
      const dirsWithProjects = uniq(javaOrKtFiles.map((f) => nodePath.dirname(f.path)));
      const commonPath = sharedSubpath(dirsWithProjects);
      result.push({ language: hasKtFiles ? ProgrammingLanguage.Kotlin : ProgrammingLanguage.Java, path: commonPath });
    }
    return result;
  }
}
