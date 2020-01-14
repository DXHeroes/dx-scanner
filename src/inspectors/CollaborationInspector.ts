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

  async getPullRequests(
    owner: string,
    repo: string,
    options?: { withDiffStat?: boolean } & ListGetterOptions<{ state?: PullRequestState }>,
  ) {
    return this.service.listPullRequests(owner, repo, options);
  }

  async getPullRequest(owner: string, repo: string, prNumber: number, withDiffStat?: boolean) {
    return this.service.getPullRequest(owner, repo, prNumber, withDiffStat);
  }

  async getPullRequestFiles(owner: string, repo: string, prNumber: number) {
    return this.service.listPullRequestFiles(owner, repo, prNumber);
  }

  async getPullCommits(owner: string, repo: string, prNumber: number) {
    return this.service.getPullCommits(owner, repo, prNumber);
  }

  async getRepoCommits(owner: string, repo: string, sha?: string, options?: ListGetterOptions) {
    return this.service.listRepoCommits(owner, repo, sha, options);
  }

  async getPullsDiffStat(owner: string, repo: string, prNumber: number) {
    return this.service.getPullsDiffStat(owner, repo, prNumber);
  }
}
