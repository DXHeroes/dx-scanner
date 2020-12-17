import { IVCSService } from '../services';
import { ScanningStrategy } from '../detectors';
export declare class ContributorsCollector {
    private readonly contentRepositoryBrowser;
    constructor(contentRepositoryBrowser: IVCSService);
    collectData(scanningStrategy: ScanningStrategy): Promise<import("../services/git/model").Contributor[]>;
}
//# sourceMappingURL=ContributorsCollector.d.ts.map