import { injectable } from 'inversify';
import { ILanguageDetector } from '../ILanguageDetector';
import { LanguageAtPath, ProgrammingLanguage } from '../../model';

@injectable()
export class JavaScriptDetector implements ILanguageDetector {
  async detectLanguage(): Promise<LanguageAtPath[]> {
    return [{ language: ProgrammingLanguage.JavaScript, path: './javascript' }];
  }
}
