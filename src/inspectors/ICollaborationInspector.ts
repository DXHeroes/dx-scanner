import { Paginated } from './common/Paginated';
import { PullCommits, PullFiles, PullRequest, Commit } from '../services/git/model';
import { ListGetterOptions } from './common/ListGetterOptions';

export interface ICollaborationInspector {
  getPullRequests(owner: string, repo: string, options?: ListGetterOptions<{ state?: PullRequestState }>): Promise<Paginated<PullRequest>>;
  getPullRequest(owner: string, repo: string, prNumber: number): Promise<PullRequest>;
  getPullCommits(owner: string, repo: string, prNumber: number): Promise<Paginated<PullCommits>>;
  getPullRequestFiles(owner: string, repo: string, prNumber: number): Promise<Paginated<PullFiles>>;
  getRepoCommits(owner: string, repo: string, sha?: string): Promise<Paginated<Commit>>;
}

export enum PullRequestState {
  open = 'open',
  closed = 'closed',
  all = 'all',
}
