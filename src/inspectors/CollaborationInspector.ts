import { inject, injectable } from 'inversify';
import { Types } from '../types';
import { ListGetterOptions } from './common/ListGetterOptions';
import { ICollaborationInspector, PullRequestState } from './ICollaborationInspector';
import { VCSService } from '../model';

@injectable()
export class CollaborationInspector implements ICollaborationInspector {
  private service: VCSService;

  constructor(@inject(Types.IContentRepositoryBrowser) service: VCSService) {
    this.service = service;
  }

  async listPullRequests(
    owner: string,
    repo: string,
    options?: { withDiffStat?: boolean } & ListGetterOptions<{ state?: PullRequestState }>,
  ) {
    return this.service.listPullRequests(owner, repo, options);
  }

  async getPullRequest(owner: string, repo: string, prNumber: number, withDiffStat?: boolean) {
    return this.service.getPullRequest(owner, repo, prNumber, withDiffStat);
  }

  async listPullRequestFiles(owner: string, repo: string, prNumber: number) {
    return this.service.listPullRequestFiles(owner, repo, prNumber);
  }

  async listPullCommits(owner: string, repo: string, prNumber: number, options?: ListGetterOptions) {
    return this.service.listPullCommits(owner, repo, prNumber, options);
  }

  async listRepoCommits(owner: string, repo: string, sha?: string, options?: ListGetterOptions) {
    return this.service.listRepoCommits(owner, repo, sha, options);
  }

  async getPullsDiffStat(owner: string, repo: string, prNumber: number) {
    return this.service.getPullsDiffStat(owner, repo, prNumber);
  }
}
