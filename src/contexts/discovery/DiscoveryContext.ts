import { inject, injectable } from 'inversify';
import { ScanningStrategy, ScanningStrategyDetector } from '../../detectors';
import { ErrorFactory } from '../../lib/errors';
import { ScannerContextFactory, Types } from '../../types';
import { ContextBase } from '../ContextBase';

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
