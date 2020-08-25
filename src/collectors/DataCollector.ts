import { injectable, inject } from 'inversify';
import { ContributorsCollector } from './ContributorsCollector';
import { Contributor } from '../services/git/model';

@injectable()
export class DataCollector {
  private readonly contributorsCollector: ContributorsCollector;
  //TODO: add tech stack collector
  constructor(@inject(ContributorsCollector) contributorsCollector: ContributorsCollector) {
    this.contributorsCollector = contributorsCollector;
  }
  async collectData(remoteUrl: string): Promise<CollectorsData> {
    return {
      contributors: await this.contributorsCollector.collectData(remoteUrl),
    };
  }
}

export type CollectorsData = {
  contributors: Contributor[];
};
