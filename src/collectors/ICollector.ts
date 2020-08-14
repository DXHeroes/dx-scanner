import { Contributor } from '../services/git/model';

export interface ICollector {
  collectData(remoteUrl: string): Promise<CollectorsData>;
}

export type CollectorsData = Contributor[];
