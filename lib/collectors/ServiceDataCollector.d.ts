import { ContributorsCollector } from './ContributorsCollector';
import { BranchesCollector } from './BranchesCollector';
import { Contributor } from '../services/git/model';
import { ScanningStrategy } from '../detectors';
export declare class ServiceDataCollector {
    private readonly contributorsCollector;
    private readonly branchesCollector;
    constructor(contributorsCollector: ContributorsCollector, branchesCollector: BranchesCollector);
    collectData(scanningStrategy: ScanningStrategy): Promise<ServiceCollectorsData>;
}
export declare type ServiceCollectorsData = {
    contributors: Contributor[];
    branches: {
        default: string;
        current: string;
    };
};
//# sourceMappingURL=ServiceDataCollector.d.ts.map