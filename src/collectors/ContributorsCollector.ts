import { injectable, inject } from 'inversify';
import { Types } from '../types';
import { IVCSService, GitServiceUtils } from '../services';
import { ScanningStrategy } from '../detectors';

@injectable()
export class ContributorsCollector {
  private readonly contentRepositoryBrowser: IVCSService;
  constructor(@inject(Types.IContentRepositoryBrowser) contentRepositoryBrowser: IVCSService) {
    this.contentRepositoryBrowser = contentRepositoryBrowser;
  }
  async collectData(scanningStrategy: ScanningStrategy) {
    const ownerAndRepoName = GitServiceUtils.parseUrl(scanningStrategy.remoteUrl!);
    return this.contentRepositoryBrowser.listContributors(ownerAndRepoName.owner, ownerAndRepoName.repoName);
  }
}
