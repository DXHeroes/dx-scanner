import { inject, injectable } from 'inversify';
import { Types } from '../types';
import { ListGetterOptions } from './common/ListGetterOptions';
import { ICollaborationInspector, PullRequestState } from './ICollaborationInspector';
import { VCSService } from '../model';
import { PullRequest } from '../services/git/model';
import { Paginated } from './common/Paginated';
import _ from 'lodash';

@injectable()
export class CollaborationInspector implements ICollaborationInspector {
  private service: VCSService;

  constructor(@inject(Types.IContentRepositoryBrowser) service: VCSService) {
    this.service = service;
  }

  async getPullRequests(
    owner: string,
    repo: string,
    options?: { withDiffStat?: boolean; maxNumberOfPullRequests?: number } & ListGetterOptions<{ state?: PullRequestState }>,
  ) {
    if (options?.maxNumberOfPullRequests !== undefined) {
      return await this.getMaxNumberOfPullRequests(owner, repo, options);
    }

    return await this.service.getPullRequests(owner, repo, options);
  }

  async getPullRequest(owner: string, repo: string, prNumber: number, withDiffStat?: boolean) {
    return this.service.getPullRequest(owner, repo, prNumber, withDiffStat);
  }

  async getPullRequestFiles(owner: string, repo: string, prNumber: number) {
    return this.service.getPullRequestFiles(owner, repo, prNumber);
  }

  async getPullCommits(owner: string, repo: string, prNumber: number) {
    return this.service.getPullCommits(owner, repo, prNumber);
  }

  async getRepoCommits(owner: string, repo: string, sha?: string) {
    return this.service.getRepoCommits(owner, repo, sha);
  }

  async getPullsDiffStat(owner: string, repo: string, prNumber: string) {
    return this.service.getPullsDiffStat(owner, repo, prNumber);
  }

  private async getMaxNumberOfPullRequests(
    owner: string,
    repo: string,
    options: { withDiffStat?: boolean; maxNumberOfPullRequests?: number } & ListGetterOptions<{ state?: PullRequestState }>,
  ): Promise<Paginated<PullRequest>> {
    let items: PullRequest[] = [];
    let hasNextPage = true;
    let i = 1;

    while (hasNextPage) {
      const pullRequests = await this.service.getPullRequests(owner, repo, { ...options, ...{ pagination: { page: i } } });
      //Add pull requstes to the existing array of PRs from another page
      items = _.merge(items, pullRequests.items);

      if (items.length >= <number>options?.maxNumberOfPullRequests) {
        //Get maximum n newest pull requests
        items = _.take(items, options.maxNumberOfPullRequests);
        break;
      }
      hasNextPage = pullRequests.hasNextPage;
      i++;
    }

    return {
      hasNextPage: false,
      hasPreviousPage: false,
      items,
      totalCount: items.length,
      page: 1,
      perPage: items.length,
    };
  }
}
