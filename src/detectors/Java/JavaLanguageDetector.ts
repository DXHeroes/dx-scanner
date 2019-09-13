import { ILanguageDetector } from '../ILanguageDetector';
import { injectable, inject } from 'inversify';
import { IFileInspector } from '../../inspectors/IFileInspector';
import { Types } from '../../types';
import { LanguageAtPath } from '../../model';
import { fileNameRegExp } from '../utils';
import { Metadata } from '../../services/model';

@injectable()
export class JavaLanguageDetector implements ILanguageDetector {
  private fileInspector: IFileInspector;
  constructor(@inject(Types.IFileInspector) fileInspector: IFileInspector) {
    this.fileInspector = fileInspector;
  }

  async detectLanguage(): Promise<LanguageAtPath[]> {
    const result: LanguageAtPath[] = [];
    let packageFiles: Metadata[] = await this.fileInspector.scanFor(fileNameRegExp('pom.xml'), '/');
    const isMaven: boolean = packageFiles.length > 0 ? true : false;
    if (!isMaven) {
      packageFiles = await this.fileInspector.scanFor(fileNameRegExp('build.xml'), '/');
    }
    return result;
  }
}
