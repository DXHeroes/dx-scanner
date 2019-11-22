import { PullCommits, PullFiles, PullRequest } from '../services/git/model';
import { ListGetterOptions } from './common/ListGetterOptions';
import { Paginated } from './common/Paginated';

export interface ICollaborationInspector {
  getPullRequests(owner: string, repo: string, options?: ListGetterOptions<{ state?: PullRequestState }>): Promise<Paginated<PullRequest>>;
  getPullRequest(owner: string, repo: string, prNumber: number): Promise<PullRequest>;
  getPullCommits(owner: string, repo: string, prNumber: number): Promise<Paginated<PullCommits>>;
  getPullRequestFiles(owner: string, repo: string, prNumber: number): Promise<Paginated<PullFiles>>;
}

export enum PullRequestState {
  open = 'open',
  closed = 'closed',
  all = 'all',
}
