import { injectable, multiInject, inject } from 'inversify';
import { Types, LanguageContextFactory } from '../../types';
import { ILanguageDetector } from '../../detectors/ILanguageDetector';
import { LanguageAtPath } from '../../model';
import { ContextBase } from '../ContextBase';
import { ErrorFactory } from '../../lib/errors';
import { IReporter } from '../../reporters';

@injectable()
export class ScannerContext extends ContextBase {
  readonly languageDetectors: ILanguageDetector[];
  readonly reporters: IReporter[];
  private readonly languageContextFactory: LanguageContextFactory;

  constructor(
    @multiInject(Types.ILanguageDetector) languageDetectors: ILanguageDetector[],
    @multiInject(Types.IReporter) reporters: IReporter[],
    @inject(Types.LanguageContextFactory) languageContextFactory: LanguageContextFactory,
  ) {
    super();
    this.languageDetectors = languageDetectors;
    this.reporters = reporters;
    this.languageContextFactory = languageContextFactory;
  }

  async init(): Promise<void> {
    throw ErrorFactory.newNotImplementedError();
  }

  getLanguageContext(languageAtPath: LanguageAtPath) {
    return this.languageContextFactory(languageAtPath);
  }
}
