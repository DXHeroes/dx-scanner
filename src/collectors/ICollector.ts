import { ProjectComponentAndLangContext } from '../scanner';
import { Contributor } from './ContributorsCollector';

export interface ICollector {
  collectData(projectComponents: ProjectComponentAndLangContext[]): Promise<CollectorsData>;
}

export type CollectorsData = Contributor[];
