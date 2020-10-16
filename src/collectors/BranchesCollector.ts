import { injectable, inject } from 'inversify';
import { Types } from '../types';
import { IVCSService, GitServiceUtils } from '../services';
import { ScanningStrategy } from '../detectors';
import { IGitInspector } from '../inspectors';

@injectable()
export class BranchesCollector {
  private readonly contentRepositoryBrowser: IVCSService;
  private readonly gitInspector: IGitInspector;
  constructor(
    @inject(Types.IContentRepositoryBrowser) contentRepositoryBrowser: IVCSService,
    @inject(Types.IGitInspector) gitInspector: IGitInspector,
  ) {
    this.contentRepositoryBrowser = contentRepositoryBrowser;
    this.gitInspector = gitInspector;
  }
  async collectData(scanningStrategy: ScanningStrategy) {
    const ownerAndRepoName = GitServiceUtils.parseUrl(scanningStrategy.remoteUrl!);
    const [branches, status] = await Promise.all([
      this.contentRepositoryBrowser.listBranches(ownerAndRepoName.owner, ownerAndRepoName.repoName),
      this.gitInspector.getStatus(),
    ]);
    // TODO: test local
    // TODO: test github
    // TODO: test gitlab
    const defaultBranch = branches.items.find((branch) => branch.type === 'default');

    return { current: status.current || 'unknown', default: defaultBranch?.name || 'unknown' };
  }
}
