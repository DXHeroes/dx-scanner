import { inject, injectable } from 'inversify';
import { ScanningStrategy } from '../detectors';
import { GitServiceUtils, IVCSService } from '../services';
import { Types } from '../types';

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
