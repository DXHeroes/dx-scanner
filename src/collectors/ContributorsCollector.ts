import { injectable, inject } from 'inversify';
import { Types } from '../types';
import { IVCSService, GitServiceUtils } from '../services';
import { ICollector } from './ICollector';
import { Contributor } from '../services/git/model';

@injectable()
export class ContributorsCollector implements ICollector {
  private readonly contentRepositoryBrowser: IVCSService;
  constructor(@inject(Types.IContentRepositoryBrowser) contentRepositoryBrowser: IVCSService) {
    this.contentRepositoryBrowser = contentRepositoryBrowser;
  }
  async collectData(remoteUrl: string): Promise<Contributor[]> {
    const ownerAndRepoName = GitServiceUtils.parseUrl(remoteUrl);
    const remoteCollaborators = await this.contentRepositoryBrowser.listContributors(ownerAndRepoName.owner, ownerAndRepoName.repoName);
    return remoteCollaborators.items;
  }
}
