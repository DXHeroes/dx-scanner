import { injectable, multiInject, inject } from 'inversify';
import { Types, LanguageContextFactory } from '../../types';
import { ILanguageDetector } from '../../detectors/ILanguageDetector';
import { LanguageAtPath } from '../../model';
import { ContextBase } from '../ContextBase';

@injectable()
export class ScannerContext extends ContextBase {
  readonly languageDetectors: ILanguageDetector[];
  private readonly languageContextFactory: LanguageContextFactory;

  constructor(
    @multiInject(Types.ILanguageDetector) languageDetectors: ILanguageDetector[],
    @inject(Types.LanguageContextFactory) languageContextFactory: LanguageContextFactory,
  ) {
    super();
    this.languageDetectors = languageDetectors;
    this.languageContextFactory = languageContextFactory;
  }

  async init(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  getLanguageContext(languageAtPath: LanguageAtPath) {
    return this.languageContextFactory(languageAtPath);
  }
}
