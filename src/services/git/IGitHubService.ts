import { ListGetterOptions } from '../../inspectors/common/ListGetterOptions';
import { PullRequest, PullRequestReview, Commit, Contributor, ContributorStats, Issue, File, Symlink, PullFiles } from './model';
import { Paginated } from '../../inspectors/common/Paginated';

export interface IGitHubService {
  getPullRequests(
    owner: string,
    repo: string,
    options?: ListGetterOptions<{ state?: GitHubPullRequestState }>,
  ): Promise<Paginated<PullRequest>>;
  getPullRequestReviews(owner: string, repo: string, prNumber: number): Promise<Paginated<PullRequestReview>>;
  getPullRequestFiles(owner: string, repo: string, prNumber: number): Promise<Paginated<PullFiles>>;
  getPullRequest(owner: string, repo: string, prNumber: number): Promise<PullRequest>;
  getCommit(owner: string, repo: string, commitSha: string): Promise<Commit>;
  getContributors(owner: string, repo: string): Promise<Paginated<Contributor>>;
  getContributorsStats(owner: string, repo: string): Promise<Paginated<ContributorStats>>;
  getIssues(owner: string, repo: string): Promise<Paginated<Issue>>;
  getIssue(owner: string, repo: string, issueNumber: number): Promise<Issue>;
  getRepoContent(owner: string, repo: string, path: string): Promise<File | Symlink>;
}

export interface GitHubPagination {
  page?: number;
  per_page?: number;
}

export enum GitHubPullRequestState {
  open = 'open',
  closed = 'closed',
  all = 'all',
}

export interface GitHubDir {
  type: GitHubContentType.dir;
  size: 0;
  name: string;
  path: string;
  sha: string;
  url: string;
  html_url: string;
  download_url: null;
}

export enum GitHubContentType {
  file = 'file',
  dir = 'dir',
}

export interface GitHubFile {
  type: GitHubContentType.file;
  encoding: string;
  size: number;
  name: string;
  path: string;
  sha: string;
  url: string;
  html_url: string;
  download_url: string;
}

export interface GitHubFileWithContent extends GitHubFile {
  content: string;
}

export enum GitHubIssueState {
  open = 'open',
  closed = 'closed',
  all = 'all',
}
