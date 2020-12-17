import { IVCSService } from '../services';
import { ScanningStrategy } from '../detectors';
import { IGitInspector } from '../inspectors';
export declare class BranchesCollector {
    private readonly contentRepositoryBrowser;
    private readonly gitInspector;
    constructor(contentRepositoryBrowser: IVCSService, gitInspector: IGitInspector);
    collectData(scanningStrategy: ScanningStrategy): Promise<{
        current: string;
        default: string;
    }>;
}
//# sourceMappingURL=BranchesCollector.d.ts.map