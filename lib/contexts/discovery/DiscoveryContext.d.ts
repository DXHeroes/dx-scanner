import { ScannerContextFactory } from '../../types';
import { ContextBase } from '../ContextBase';
import { ScanningStrategyDetector, ScanningStrategy } from '../../detectors';
export declare class DiscoveryContext extends ContextBase {
    scanningStrategyDetector: ScanningStrategyDetector;
    private readonly scannerContextFactory;
    constructor(scanningStrategyDetector: ScanningStrategyDetector, scannerContextFactory: ScannerContextFactory);
    init(): Promise<void>;
    getScanningContext(scanningStrategy: ScanningStrategy): import("../scanner/ScannerContext").ScannerContext;
}
//# sourceMappingURL=DiscoveryContext.d.ts.map