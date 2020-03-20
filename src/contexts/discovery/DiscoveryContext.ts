import { injectable, multiInject, inject } from 'inversify';
import { Types, ScannerContextFactory } from '../../types';
import { ContextBase } from '../ContextBase';
import { ErrorFactory } from '../../lib/errors';
import { ScanningStrategyDetector, ScanningStrategy } from '../../detectors';
import { IReporter } from '../../reporters';

@injectable()
export class DiscoveryContext extends ContextBase {
  scanningStrategyDetector: ScanningStrategyDetector;
  private readonly scannerContextFactory: ScannerContextFactory;

  constructor(
    @inject(ScanningStrategyDetector) scanningStrategyDetector: ScanningStrategyDetector,
    @inject(Types.ScannerContextFactory) scannerContextFactory: ScannerContextFactory,
  ) {
    super();
    this.scanningStrategyDetector = scanningStrategyDetector;
    this.scannerContextFactory = scannerContextFactory;
  }

  async init(): Promise<void> {
    throw ErrorFactory.newNotImplementedError();
  }

  getScanningContext(scanningStrategy: ScanningStrategy) {
    return this.scannerContextFactory(scanningStrategy);
  }
}
