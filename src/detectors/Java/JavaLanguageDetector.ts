import { ILanguageDetector } from '../ILanguageDetector';
import { injectable, inject } from 'inversify';
import { IFileInspector } from '../../inspectors/IFileInspector';
import { Types } from '../../types';
import { LanguageAtPath } from '../../model';

@injectable()
export class JavaLanguageDetector implements ILanguageDetector {
  private fileInspector: IFileInspector;
  constructor(@inject(Types.IFileInspector) fileInspector: IFileInspector) {
    this.fileInspector = fileInspector;
  }

  detectLanguage(): Promise<LanguageAtPath[]> {
    throw new Error('Method not implemented.');
  }
}
