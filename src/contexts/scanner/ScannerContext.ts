import { injectable, multiInject, inject } from 'inversify';
import { Types, LanguageContextFactory } from '../../types';
import { ILanguageDetector } from '../../detectors/ILanguageDetector';
import { LanguageAtPath } from '../../model';
import { ContextBase } from '../ContextBase';
import { ErrorFactory } from '../../lib/errors';
import { IReporter } from '../../reporters';
import { ICollector } from '../../collectors/ICollector';

@injectable()
export class ScannerContext extends ContextBase {
  readonly languageDetectors: ILanguageDetector[];
  readonly reporters: IReporter[];
  readonly dataCollector: ICollector;

  private readonly languageContextFactory: LanguageContextFactory;

  constructor(
    @multiInject(Types.ILanguageDetector) languageDetectors: ILanguageDetector[],
    @multiInject(Types.IReporter) reporters: IReporter[],
    @inject(Types.ICollector) dataCollector: ICollector,
    @inject(Types.LanguageContextFactory) languageContextFactory: LanguageContextFactory,
  ) {
    super();
    this.languageDetectors = languageDetectors;
    this.reporters = reporters;
    this.dataCollector = dataCollector;
    this.languageContextFactory = languageContextFactory;
  }

  async init(): Promise<void> {
    throw ErrorFactory.newNotImplementedError();
  }

  getLanguageContext(languageAtPath: LanguageAtPath) {
    return this.languageContextFactory(languageAtPath);
  }
}
