import { ContributorsCollector } from './ContributorsCollector';
import { BranchesCollector } from './BranchesCollector';
import { Contributor } from '../services/git/model';
import { ScanningStrategy } from '../detectors';
export declare class DataCollector {
    private readonly contributorsCollector;
    private readonly branchesCollector;
    constructor(contributorsCollector: ContributorsCollector, branchesCollector: BranchesCollector);
    collectData(scanningStrategy: ScanningStrategy): Promise<CollectorsData>;
}
export declare type CollectorsData = {
    contributors: Contributor[];
    branches: {
        default: string;
        current: string;
    };
};
//# sourceMappingURL=DataCollector.d.ts.map