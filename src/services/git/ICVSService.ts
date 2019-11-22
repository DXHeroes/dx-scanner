import { ListGetterOptions } from '../../inspectors/common/ListGetterOptions';
import { Paginated } from '../../inspectors/common/Paginated';
import { PullRequestState } from '../../inspectors/ICollaborationInspector';
import { Commit, Contributor, ContributorStats, Directory, File, Issue, PullFiles, PullRequest, PullRequestReview, Symlink } from './model';

export interface ICVSService {
  getPullRequests(owner: string, repo: string, options?: ListGetterOptions<{ state?: PullRequestState }>): Promise<Paginated<PullRequest>>;
  getPullRequestReviews(owner: string, repo: string, prNumber: number): Promise<Paginated<PullRequestReview>>;
  getPullRequestFiles(owner: string, repo: string, prNumber: number): Promise<Paginated<PullFiles>>;
  getPullRequest(owner: string, repo: string, prNumber: number): Promise<PullRequest>;
  getCommit(owner: string, repo: string, commitSha: string): Promise<Commit>;
  getContributors(owner: string, repo: string): Promise<Paginated<Contributor>>;
  getContributorsStats(owner: string, repo: string): Promise<Paginated<ContributorStats>>;
  getIssues(owner: string, repo: string): Promise<Paginated<Issue>>;
  getIssue(owner: string, repo: string, issueNumber: number): Promise<Issue>;
  getRepoContent(owner: string, repo: string, path: string): Promise<File | Symlink | Directory | null>;
}

export enum CSVService {
  github = 'GitHub',
  bitbucket = 'Bitbucket',
}

export enum BitbucketPullRequestState {
  open = 'OPEN',
  closed = 'MERGED',
  declined = 'DECLINED',
  superseded = 'SUPERSEDED',
}
