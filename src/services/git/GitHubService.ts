import { injectable, inject } from 'inversify';
import { GitHubClient } from './GitHubClient';
import {
  PullRequest,
  Contributor,
  PullRequestReview,
  Commit,
  ContributorStats,
  Directory,
  File,
  Issue,
  PullFiles,
  PullCommits,
  IssueComment,
  Symlink,
} from './model';
import { IGitHubService } from './IGitHubService';
import { Paginated } from '../../inspectors/common/Paginated';
import {
  IssuesListForRepoResponseItem,
  PullsListResponseItem,
  PullsListReviewsResponseItem,
  ReposGetContributorsStatsResponseItem,
} from '@octokit/rest';
import { isArray } from 'util';
@injectable()
export class GitHubService implements IGitHubService {
  private gitHubClient: GitHubClient;

  constructor(@inject(GitHubClient) gitHubClient: GitHubClient) {
    this.gitHubClient = gitHubClient;
  }

  getRepo(owner: string, repo: string) {
    return this.gitHubClient.get(owner, repo);
  }

  async getPullRequests(owner: string, repo: string): Promise<Paginated<PullRequest>> {
    const response: PullsListResponseItem[] = await this.gitHubClient.paginate('GET /repos/:owner/:repo/pulls', owner, repo);

    const items = response.map((val) => ({
      user: {
        id: val.user.id,
        login: val.user.login,
        url: val.user.url,
      },
      url: val.url,
      body: val.body,
      createdAt: val.created_at,
      updatedAt: val.updated_at,
      closedAt: val.closed_at,
      mergedAt: val.merged_at,
      state: val.state,
      id: val.id,
      base: {
        repo: {
          url: val.base.repo.url,
          name: val.base.repo.name,
          id: val.base.repo.id,
          owner: val.base.repo.owner,
        },
      },
    }));
    const pagination = this.getPagination(response.length);

    return { items, ...pagination };
  }

  async getPullRequest(owner: string, repo: string, prNumber: number): Promise<PullRequest> {
    const response = await this.gitHubClient.getPullRequest(owner, repo, prNumber);
    return {
      user: {
        id: response.data.user.id,
        login: response.data.user.login,
        url: response.data.user.url,
      },
      url: response.data.url,
      body: response.data.body,
      createdAt: response.data.created_at,
      updatedAt: response.data.updated_at,
      closedAt: response.data.closed_at,
      mergedAt: response.data.merged_at,
      state: response.data.state,
      id: response.data.id,
      base: {
        repo: {
          url: response.data.base.repo.url,
          name: response.data.base.repo.name,
          id: response.data.base.repo.id,
          owner: response.data.base.repo.owner,
        },
      },
    };
  }

  async getPullRequestReviews(owner: string, repo: string, prNumber: number): Promise<Paginated<PullRequestReview>> {
    const response: PullsListReviewsResponseItem[] = await this.gitHubClient.paginate(
      'GET /repos/:owner/:repo/pulls/:pull_number/reviews',
      owner,
      repo,
      prNumber,
    );

    const items = response.map((val) => ({
      user: {
        id: val.user.id,
        login: val.user.login,
        url: val.user.url,
      },
      id: val.id,
      body: val.body,
      state: val.state,
      url: val.pull_request_url,
    }));
    const pagination = this.getPagination(response.length);

    return { items, ...pagination };
  }

  async getCommit(owner: string, repo: string, commitSha: string): Promise<Commit> {
    const response = await this.gitHubClient.getCommit(owner, repo, commitSha);

    return {
      sha: response.data.sha,
      url: response.data.url,
      message: response.data.message,
      author: {
        name: response.data.author.name,
        email: response.data.author.email,
        date: response.data.author.date,
      },
      tree: {
        sha: response.data.tree.sha,
        url: response.data.tree.url,
      },
      verified: response.data.verification.verified,
    };
  }

  async getContributors(owner: string, repo: string): Promise<Paginated<Contributor>> {
    const response = await this.gitHubClient.paginate('GET /repos/:owner/:repo/contributors', owner, repo);
    const items = response.map((val) => ({
      user: {
        id: val.id,
        login: val.login,
        url: val.url,
      },
      id: val.id,
      login: val.login,
      url: val.url,
      followersUrl: val.followersUrl,
      contributions: val.contributions,
    }));
    const pagination = this.getPagination(response.length);

    return { items, ...pagination };
  }

  async getContributorsStats(owner: string, repo: string): Promise<Paginated<ContributorStats>> {
    const response: ReposGetContributorsStatsResponseItem[] = await this.gitHubClient.paginate(
      'GET /repos/:owner/:repo/stats/contributors',
      owner,
      repo,
    );

    const items = response.map((val) => ({
      author: {
        id: val.author.id,
        login: val.author.login,
        url: val.author.url,
      },
      total: val.total,
      weeks: val.weeks.map((val: { w: unknown; a: number; d: number; c: number }) => ({
        startOfTheWeek: val.w as number,
        additions: val.a,
        deletions: val.d,
        commits: val.c,
      })),
    }));
    const pagination = this.getPagination(response.length);

    return { items, ...pagination };
  }

  async getRepoContent(owner: string, repo: string, path: string): Promise<File | Symlink | Directory> {
    const response = await this.gitHubClient.getRepoContent(owner, repo, path);
    return isArray(response.data)
      ? response.data.map((item) => ({
          name: item.name,
          path: item.path,
          sha: item.sha,
          size: item.size,
          type: item.type,
        }))
      : {
          name: response.data.name,
          path: response.data.path,
          size: response.data.size,
          sha: response.data.sha,
          type: response.data.type,
          content: response.data.content,
          encoding: response.data.encoding,
          target: response.data.target,
        };
  }

  async getIssues(owner: string, repo: string): Promise<Paginated<Issue>> {
    const response: IssuesListForRepoResponseItem[] = await this.gitHubClient.paginate('GET /repos/:owner/:repo/issues', owner, repo);

    const items = response.map((val) => ({
      user: {
        id: val.user.id,
        login: val.user.login,
        url: val.user.url,
      },
      url: val.url,
      body: val.body,
      createdAt: val.created_at,
      updatedAt: val.updated_at,
      closedAt: val.closed_at,
      state: val.state,
      id: val.id,
      pullRequestUrl: val.pull_request && val.pull_request.url,
    }));
    const pagination = this.getPagination(response.length);

    return { items, ...pagination };
  }

  async getIssue(owner: string, repo: string, issueNumber: number): Promise<Issue> {
    const response = await this.gitHubClient.getIssue(owner, repo, issueNumber);

    return {
      id: response.data.id,
      user: response.data.user,
      url: response.data.url,
      body: response.data.body,
      createdAt: response.data.created_at,
      updatedAt: response.data.updated_at,
      closedAt: response.data.closed_at,
      state: response.data.state,
    };
  }

  async getIssueComments(owner: string, repo: string, issueNumber: number): Promise<Paginated<IssueComment>> {
    const response = await this.gitHubClient.paginate(
      'GET /repos/:owner/:repo/issues/:issue_number/comments',
      owner,
      repo,
      undefined,
      issueNumber,
    );

    const items = response.map((val) => ({
      user: {
        id: val.user.id,
        login: val.user.login,
        url: val.user.url,
      },
      url: val.url,
      body: val.body,
      createdAt: val.created_at,
      updatedAt: val.updated_at,
      authorAssociation: val.author_association,
      id: val.id,
    }));
    const pagination = this.getPagination(response.length);

    return { items, ...pagination };
  }

  async getPullRequestFiles(owner: string, repo: string, prNumber: number): Promise<Paginated<PullFiles>> {
    const response = await this.gitHubClient.paginate('GET /repos/:owner/:repo/pulls/:pull_number/files', owner, repo, prNumber);

    const items = response.map((val) => ({
      sha: val.sha,
      fileName: val.fileName,
      status: val.status,
      additions: val.additions,
      deletions: val.deletions,
      changes: val.changes,
      contentsUrl: val.contentsUrl,
    }));

    const pagination = this.getPagination(response.length);
    return { items, ...pagination };
  }

  async getPullCommits(owner: string, repo: string, prNumber: number): Promise<Paginated<PullCommits>> {
    const response = await this.gitHubClient.paginate('GET /repos/:owner/:repo/pulls/:pull_number/commits', owner, repo, prNumber);

    const items = response.map((val) => ({
      sha: val.sha,
      commit: {
        url: val.commit.url,
        message: val.commit.message,
        author: {
          name: val.commit.author.name,
          email: val.commit.author.email,
          date: val.commit.author.date,
        },
        tree: {
          sha: val.commit.tree.sha,
          url: val.commit.tree.url,
        },
        verified: val.commit.verification.verified,
      },
    }));

    const pagination = this.getPagination(response.length);
    return { items, ...pagination };
  }

  getPagination(totalCount: number) {
    const hasNextPage = false;
    const hasPreviousPage = false;
    const page = 1;
    const perPage = totalCount;

    return { totalCount, hasNextPage, hasPreviousPage, page, perPage };
  }
}
