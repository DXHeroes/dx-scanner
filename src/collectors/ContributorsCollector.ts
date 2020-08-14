import { injectable, inject } from 'inversify';
import { GitInspector } from '../inspectors';
import { Types } from '../types';
import { IVCSService, GitServiceUtils } from '../services';
import { ICollector } from './ICollector';
import { Contributor } from '../services/git/model';

@injectable()
export class ContributorsCollector implements ICollector {
  private readonly gitInspector: GitInspector;
  private readonly contentRepositoryBrowser: IVCSService;
  constructor(
    @inject(Types.IGitInspector) gitInspector: GitInspector,
    @inject(Types.IContentRepositoryBrowser) contentRepositoryBrowser: IVCSService,
  ) {
    this.gitInspector = gitInspector;
    this.contentRepositoryBrowser = contentRepositoryBrowser;
  }
  async collectData(remoteUrl: string): Promise<Contributor[]> {
    //const data = await this.gitInspector.getAuthors({});
    const ownerAndRepoName = GitServiceUtils.parseUrl(remoteUrl);
    const remoteCollaborators = await this.contentRepositoryBrowser.listContributors(ownerAndRepoName.owner, ownerAndRepoName.repoName);
    return remoteCollaborators.items;
  }
}
