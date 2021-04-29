import { ScanningStrategy } from '../detectors';
import { IVCSService } from '../services';
export declare class ContributorsCollector {
    private readonly contentRepositoryBrowser;
    constructor(contentRepositoryBrowser: IVCSService);
    collectData(scanningStrategy: ScanningStrategy): Promise<import("../services/git/model").Contributor[]>;
}
//# sourceMappingURL=ContributorsCollector.d.ts.map