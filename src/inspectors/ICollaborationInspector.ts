import { Paginated } from './common/Paginated';
import { PullCommits, PullFiles, PullRequest } from '../services/git/model';

export interface ICollaborationInspector {
  getPullRequests(owner: string, repo: string): Promise<Paginated<PullRequest>>;
  getPullRequest(owner: string, repo: string, prNumber: number): Promise<PullRequest>;
  getPullCommits(owner: string, repo: string, prNumber: number): Promise<Paginated<PullCommits>>;
  getPullRequestFiles(owner: string, repo: string, prNumber: number): Promise<Paginated<PullFiles>>;
}

export enum PullRequestState {
  open = 'open',
  closed = 'closed',
  all = 'all',
}
