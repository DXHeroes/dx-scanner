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
} from './model';

export interface IVCSService {
  getPullRequests(owner: string, repo: string, options?: ListGetterOptions<{ state?: PullRequestState }>): Promise<Paginated<PullRequest>>;
  getPullRequest(owner: string, repo: string, prNumber: number): Promise<PullRequest>;
  getPullRequestComments(owner: string, repo: string, prNumber: number): Promise<Paginated<PullRequestComment>>;
  createPullRequestComment(owner: string, repo: string, prNumber: number, body: string): Promise<CreatedUpdatedPullRequestComment>;
  updatePullRequestComment(
    owner: string,
    repo: string,
    commentId: number,
    body: string,
    pullRequestId?: number,
  ): Promise<CreatedUpdatedPullRequestComment>;
  getPullRequestReviews(owner: string, repo: string, prNumber: number): Promise<Paginated<PullRequestReview>>;
  getPullRequestFiles(owner: string, repo: string, prNumber: number): Promise<Paginated<PullFiles>>;
  getRepoCommits(owner: string, repo: string, sha?: string): Promise<Paginated<Commit>>;
  getCommit(owner: string, repo: string, commitSha: string): Promise<Commit>;
  getContributors(owner: string, repo: string): Promise<Paginated<Contributor>>;
  getContributorsStats(owner: string, repo: string): Promise<Paginated<ContributorStats>>;
  getIssues(owner: string, repo: string): Promise<Paginated<Issue>>;
  getIssue(owner: string, repo: string, issueNumber: number): Promise<Issue>;
  getIssueComments(owner: string, repo: string, prNumber: number): Promise<Paginated<PullRequestComment>>;
  getRepoContent(owner: string, repo: string, path: string): Promise<File | Symlink | Directory | null>;
}

export enum VCSServiceType {
  github = 'GitHub',
  bitbucket = 'Bitbucket',
}
