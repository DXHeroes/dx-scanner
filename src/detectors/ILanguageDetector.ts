import { LanguageAtPath } from '../model';

export interface ILanguageDetector {
  detectLanguage(): Promise<LanguageAtPath[]>;
}
