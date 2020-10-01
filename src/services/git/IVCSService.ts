import { ListGetterOptions } from '../../inspectors/common/ListGetterOptions';
import { Paginated } from '../../inspectors/common/Paginated';
import { PullRequestState } from '../../inspectors/ICollaborationInspector';
import {
  Commit,
  Contributor,
  ContributorStats,
  Directory,
  File,
  Issue,
  PullFiles,
  PullRequest,
  PullRequestReview,
  Symlink,
  CreatedUpdatedPullRequestComment,
  PullRequestComment,
  PullCommits,
  Branch,
} from './model';

export interface IVCSService {
  getRepoContent(owner: string, repo: string, path: string): Promise<File | Symlink | Directory | null>;

  getPullRequest(owner: string, repo: string, prNumber: number): Promise<PullRequest>;
  listPullRequests(owner: string, repo: string, options?: ListGetterOptions<{ state?: PullRequestState }>): Promise<Paginated<PullRequest>>;
  listPullRequestComments(
    owner: string,
    repo: string,
    prNumber: number,
    options?: ListGetterOptions,
  ): Promise<Paginated<PullRequestComment>>;
  listPullRequestReviews(owner: string, repo: string, prNumber: number): Promise<Paginated<PullRequestReview>>;
  listPullRequestFiles(owner: string, repo: string, prNumber: number): Promise<Paginated<PullFiles>>;
  createPullRequestComment(owner: string, repo: string, prNumber: number, body: string): Promise<CreatedUpdatedPullRequestComment>;
  updatePullRequestComment(
    owner: string,
    repo: string,
    commentId: number,
    body: string,
    pullRequestId?: number,
  ): Promise<CreatedUpdatedPullRequestComment>;
  listRepoCommits(owner: string, repo: string, options?: ListGetterOptions): Promise<Paginated<Commit>>;
  listPullCommits(owner: string, repo: string, prNumber: number, options?: ListGetterOptions): Promise<Paginated<PullCommits>>;
  getCommit(owner: string, repo: string, commitSha: string): Promise<Commit>;

  listContributors(owner: string, repo: string): Promise<Contributor[]>;
  listContributorsStats(owner: string, repo: string): Promise<Paginated<ContributorStats>>;

  listIssues(owner: string, repo: string): Promise<Paginated<Issue>>;
  getIssue(owner: string, repo: string, issueNumber: number): Promise<Issue>;
  listIssueComments(owner: string, repo: string, prNumber: number, options?: ListGetterOptions): Promise<Paginated<PullRequestComment>>;

  listBranches(owner: string, repo: string): Promise<Paginated<Branch>>;
}

export enum VCSServiceType {
  github = 'GitHub',
  bitbucket = 'Bitbucket',
  gitlab = 'GitLab',
}

export interface ServicePagination {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  page: number;
  perPage: number;
  totalCount: number;
}
