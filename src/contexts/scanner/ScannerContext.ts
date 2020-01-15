import { injectable, multiInject, inject } from 'inversify';
import { Types, LanguageContextFactory } from '../../types';
import { ILanguageDetector } from '../../detectors/ILanguageDetector';
import { LanguageAtPath } from '../../model';
import { ContextBase } from '../ContextBase';
import { ErrorFactory } from '../../lib/errors';

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
    throw ErrorFactory.newNotImplementedError();
  }

  getLanguageContext(languageAtPath: LanguageAtPath) {
    return this.languageContextFactory(languageAtPath);
  }
}
