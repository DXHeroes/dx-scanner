import { injectable, inject } from 'inversify';
import { ContributorsCollector } from './ContributorsCollector';
import { BranchesCollector } from './BranchesCollector';
import { Contributor } from '../services/git/model';
import { ScanningStrategy } from '../detectors';

@injectable()
export class DataCollector {
  private readonly contributorsCollector: ContributorsCollector;
  private readonly branchesCollector: BranchesCollector;
  //TODO: add tech stack collector
  constructor(
    @inject(ContributorsCollector) contributorsCollector: ContributorsCollector,
    @inject(BranchesCollector) branchesCollector: BranchesCollector,
  ) {
    this.contributorsCollector = contributorsCollector;
    this.branchesCollector = branchesCollector;
  }
  async collectData(scanningStrategy: ScanningStrategy): Promise<CollectorsData> {
    // TODO: temporary try/catch until the listBranches is implemented in all VCS connectors
    let branches = { current: 'unknown', default: 'unknown' };
    try {
      branches = await this.branchesCollector.collectData(scanningStrategy);
    } catch {}
    return {
      branches,
      contributors: await this.contributorsCollector.collectData(scanningStrategy),
    };
  }
}

export type CollectorsData = {
  contributors: Contributor[];
  branches: {
    default: string;
    current: string;
  };
};
