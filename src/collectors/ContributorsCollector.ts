import { injectable, inject } from 'inversify';
import { Types } from '../types';
import { IVCSService, GitServiceUtils } from '../services';

@injectable()
export class ContributorsCollector {
  private readonly contentRepositoryBrowser: IVCSService;
  constructor(@inject(Types.IContentRepositoryBrowser) contentRepositoryBrowser: IVCSService) {
    this.contentRepositoryBrowser = contentRepositoryBrowser;
  }
  async collectData(remoteUrl: string) {
    const ownerAndRepoName = GitServiceUtils.parseUrl(remoteUrl);
    return this.contentRepositoryBrowser.listContributors(ownerAndRepoName.owner, ownerAndRepoName.repoName);
  }
}
