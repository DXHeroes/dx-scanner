import { Paginated } from './common/Paginated';
import { PullCommits, PullFiles, PullRequest, Commit, Lines } from '../services/git/model';
import { ListGetterOptions } from './common/ListGetterOptions';

export interface ICollaborationInspector {
  listPullRequests(
    owner: string,
    repo: string,
    options?: { withDiffStat?: boolean } & ListGetterOptions<{ state?: PullRequestState }>,
  ): Promise<Paginated<PullRequest>>;
  getPullRequest(owner: string, repo: string, prNumber: number, withDiffStat?: boolean): Promise<PullRequest>;
  listPullCommits(owner: string, repo: string, prNumber: number): Promise<Paginated<PullCommits>>;
  listPullRequestFiles(owner: string, repo: string, prNumber: number): Promise<Paginated<PullFiles>>;
  listRepoCommits(owner: string, repo: string, options?: ListGetterOptions): Promise<Paginated<Commit>>;
  getPullsDiffStat(owner: string, repo: string, prNumber: number): Promise<Lines>;
}

export enum PullRequestState {
  open = 'open',
  closed = 'closed',
  all = 'all',
}
