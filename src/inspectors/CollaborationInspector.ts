import { inject, injectable } from 'inversify';
import { VCSService } from '../model';
import { ICache, InMemoryCache } from '../scanner/cache';
import { Types } from '../types';
import { ListGetterOptions } from './common/ListGetterOptions';
import { ICollaborationInspector, PullRequestState } from './ICollaborationInspector';

@injectable()
export class CollaborationInspector implements ICollaborationInspector {
  private service: VCSService;
  private cache: ICache;

  constructor(@inject(Types.IContentRepositoryBrowser) service: VCSService) {
    this.service = service;

    this.cache = new InMemoryCache();
  }

  purgeCache() {
    this.cache.purge();
  }

  async listPullRequests(
    owner: string,
    repo: string,
    options?: { withDiffStat?: boolean } & ListGetterOptions<{ state?: PullRequestState }>,
  ) {
    return this.cache.getOrSet(`CollaborationInspector:listPullRequests:${owner}:${repo}:${JSON.stringify(options)}`, async () => {
      return this.service.listPullRequests(owner, repo, options);
    });
  }

  async getPullRequest(owner: string, repo: string, prNumber: number, withDiffStat?: boolean) {
    return this.cache.getOrSet(`CollaborationInspector:getPullRequest:${owner}:${repo}:${prNumber}:${withDiffStat}`, async () => {
      return this.service.getPullRequest(owner, repo, prNumber, withDiffStat);
    });
  }

  //TODO add options
  async listPullRequestFiles(owner: string, repo: string, prNumber: number) {
    return this.cache.getOrSet(`CollaborationInspector:listPullRequestFiles:${owner}:${repo}:${prNumber}`, async () => {
      return this.service.listPullRequestFiles(owner, repo, prNumber);
    });
  }

  async listPullCommits(owner: string, repo: string, prNumber: number, options?: ListGetterOptions) {
    return this.cache.getOrSet(
      `CollaborationInspector:listPullCommits:${owner}:${repo}:${prNumber}:${JSON.stringify(options)}`,
      async () => {
        return this.service.listPullCommits(owner, repo, prNumber, options);
      },
    );
  }

  async listRepoCommits(owner: string, repo: string, options?: ListGetterOptions) {
    return this.cache.getOrSet(`CollaborationInspector:listRepoCommits:${owner}:${repo}:${JSON.stringify(options)}`, async () => {
      return this.service.listRepoCommits(owner, repo, options);
    });
  }

  async getPullsDiffStat(owner: string, repo: string, prNumber: number) {
    return this.cache.getOrSet(`CollaborationInspector:getPullsDiffStat:${owner}:${repo}:${prNumber}`, async () => {
      return this.service.getPullsDiffStat(owner, repo, prNumber);
    });
  }
}
