/* eslint-disable @typescript-eslint/camelcase */
import Octokit from '@octokit/rest';
import Debug from 'debug';
import { inject, injectable } from 'inversify';
import { inspect, isArray } from 'util';
import { ListGetterOptions } from '../../inspectors/common/ListGetterOptions';
import { Paginated } from '../../inspectors/common/Paginated';
import { PullRequestState } from '../../inspectors/ICollaborationInspector';
import { delay } from '../../lib/delay';
import { ErrorFactory } from '../../lib/errors';
import { ICache } from '../../scanner/cache/ICache';
import { InMemoryCache } from '../../scanner/cache/InMemoryCache';
import { Types } from '../../types';
import { IVCSService } from './IVCSService';
import {
  Commit,
  Contributor,
  ContributorStats,
  Directory,
  File,
  Issue,
  IssueComment,
  PullCommits,
  PullFiles,
  PullRequest,
  PullRequestReview,
  RepoContentType,
  Symlink,
  PullRequestComment,
  CreatedUpdatedPullRequestComment,
} from './model';
import { VCSServicesUtils } from './VCSServicesUtils';
import { ArgumentsProvider } from '../../scanner';
const debug = Debug('cli:services:git:github-service');

@injectable()
export class GitHubService implements IVCSService {
  private readonly client: Octokit;
  private cache: ICache;
  private callCount = 0;

  constructor(@inject(Types.ArgumentsProvider) argumentsProvider: ArgumentsProvider) {
    this.cache = new InMemoryCache();

    this.client = new Octokit({
      auth: argumentsProvider.auth,
    });
  }

  purgeCache() {
    this.cache.purge();
  }

  /**
   * The parent and source objects are present when the repository is a fork.
   *
   * 'parent' is the repository this repository was forked from.
   * 'source' is the ultimate source for the network.
   */
  getRepo(owner: string, repo: string) {
    return this.unwrap(this.client.repos.get({ owner, repo }));
  }

  /**
   * Lists all pull requests in the repo.
   */
  async listPullRequests(
    owner: string,
    repo: string,
    options?: { withDiffStat?: boolean } & ListGetterOptions<{ state?: PullRequestState }>,
  ): Promise<Paginated<PullRequest>> {
    const state = VCSServicesUtils.getGithubPRState(options?.filter?.state);

    const params: Octokit.PullsListParams = { owner, repo };
    if (state) params.state = state;
    if (options?.pagination?.page) params.page = options.pagination.page;
    if (options?.pagination?.perPage) params.per_page = options.pagination.perPage;

    const { data } = await this.unwrap(this.client.pulls.list(params));

    const items = await Promise.all(
      data.map(async (val) => {
        const pullRequest = {
          user: {
            id: val.user.id.toString(),
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
              id: val.base.repo.id.toString(),
              owner: { url: val.base.repo.owner.url, id: val.base.repo.owner.id.toString(), login: val.base.repo.owner.login },
            },
          },
        };
        // Get number of changes, additions and deletions in PullRequest if the withDiffStat is true
        if (options?.withDiffStat) {
          const lines = await this.getPullsDiffStat(owner, repo, val.id);
          return { ...pullRequest, lines };
        }
        return pullRequest;
      }),
    );

    const pagination = this.getPagination(data.length);

    return { items, ...pagination };
  }

  /**
   * Get a single pull request.
   */
  async getPullRequest(owner: string, repo: string, prNumber: number, withDiffStat?: boolean): Promise<PullRequest> {
    // eslint-disable-next-line @typescript-eslint/camelcase
    const response = await this.unwrap(this.client.pulls.get({ owner, repo, pull_number: prNumber }));
    const pullRequest = {
      user: {
        id: response.data.user.id.toString(),
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
          id: response.data.base.repo.id.toString(),
          owner: {
            url: response.data.base.repo.owner.url,
            id: response.data.base.repo.owner.id.toString(),
            login: response.data.base.repo.owner.login,
          },
        },
      },
    };
    // Get number of changes, additions and deletions in PullRequest if the withDiffStat is true
    if (withDiffStat) {
      const lines = await this.getPullsDiffStat(owner, repo, prNumber);
      return { ...pullRequest, lines };
    }

    return pullRequest;
  }

  /**
   * Lists all reviews on pull request in the repo.
   */
  async listPullRequestReviews(owner: string, repo: string, prNumber: number): Promise<Paginated<PullRequestReview>> {
    const { data } = await this.unwrap(this.client.pulls.listReviews({ owner, repo, pull_number: prNumber }));

    const items = data.map((val) => ({
      user: {
        id: val.user.id.toString(),
        login: val.user.login,
        url: val.user.url,
      },
      id: val.id,
      body: val.body,
      state: val.state,
      url: val.pull_request_url,
    }));
    const pagination = this.getPagination(data.length);

    return { items, ...pagination };
  }

  /**
   * Lists commits in the repository.
   *
   * The response will include a verification object that describes the result of verifying the commit's signature.
   * To see the included fields in the verification object see https://octokit.github.io/rest.js/#pagination.
   *
   * Sha can be SHA or branch name.
   */
  async listRepoCommits(owner: string, repo: string, sha?: string, options?: ListGetterOptions): Promise<Paginated<Commit>> {
    const { data } = await this.unwrap(
      this.client.repos.listCommits({
        owner,
        repo,
        ...options?.pagination,
      }),
    );

    const items = data.map((val) => ({
      sha: val.sha,
      url: val.url,
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
    }));
    const pagination = this.getPagination(data.length);

    return { items, ...pagination };
  }

  /**
   * Get the Commit of the given commit_sha in the repo.
   */
  async getCommit(owner: string, repo: string, commitSha: string): Promise<Commit> {
    // eslint-disable-next-line @typescript-eslint/camelcase
    const response = await this.unwrap(this.client.git.getCommit({ owner, repo, commit_sha: commitSha }));

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

  /**
   * Lists contributors to the specified repository and sorts them by the number of commits per contributor in descending order.
   */
  async listContributors(owner: string, repo: string): Promise<Paginated<Contributor>> {
    const { data } = await this.unwrap(this.client.repos.listContributors({ owner, repo }));

    const items = data.map((val) => ({
      user: {
        id: val.id.toString(),
        login: val.login,
        url: val.url,
      },
      id: val.id,
      login: val.login,
      url: val.url,
      followersUrl: val.followers_url,
      contributions: val.contributions,
    }));
    const pagination = this.getPagination(data.length);

    return { items, ...pagination };
  }

  /**
   * total - The Total number of commits authored by the contributor.
   *  Weekly Hash (weeks array):
   *
   *    w - Start of the week, given as a Unix timestamp.
   *    a - Number of additions
   *    d - Number of deletions
   *    c - Number of commits
   */
  async getContributorsStats(owner: string, repo: string): Promise<Paginated<ContributorStats>> {
    // Wait for GitHub stats to be recomputed
    await this.unwrap(
      this.client.repos.getContributorsStats({ owner, repo }).then((r) => {
        if (r.status === 202) {
          debug('Waiting for GitHub stats to be recomputed');
          return delay(10_000).then(() => r);
        } else {
          return r;
        }
      }),
    );

    const { data } = await this.unwrap(this.client.repos.getContributorsStats({ owner, repo }));

    const items = data.map((val) => ({
      author: {
        id: val.author.id.toString(),
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
    const pagination = this.getPagination(data.length);

    return { items, ...pagination };
  }

  /**
   * Gets the contents of a file or directory in a repository.
   */
  async getRepoContent(owner: string, repo: string, path: string): Promise<File | Symlink | Directory | null> {
    const key = `${owner}:${repo}:content:${path}`;

    return this.cache.getOrSet(key, async () => {
      let response;
      try {
        response = await this.unwrap(this.client.repos.getContents({ owner, repo, path }));
      } catch (e) {
        if (e.name !== 'HttpError' || e.status !== 404) {
          throw e;
        }

        return null;
      }

      if (isArray(response.data)) {
        return response.data.map((item) => ({
          name: item.name,
          path: item.path,
          sha: item.sha,
          size: item.size,
          type: <RepoContentType>item.type,
        }));
      } else if (response.data.type === RepoContentType.file) {
        return {
          name: response.data.name,
          path: response.data.path,
          size: response.data.size,
          sha: response.data.sha,
          type: response.data.type,
          content: response.data.content,
          encoding: <BufferEncoding>response.data.encoding,
        };
      } else if (response.data.type === RepoContentType.symlink) {
        return {
          name: response.data.name,
          path: response.data.path,
          size: response.data.size,
          sha: response.data.sha,
          type: response.data.type,
          target: `${response.data.target}`,
        };
      } else {
        throw ErrorFactory.newInternalError('Unexpected response');
      }
    });
  }

  /**
   * List all issues in the repo.
   */
  async listIssues(owner: string, repo: string, options?: ListGetterOptions): Promise<Paginated<Issue>> {
    const params: Octokit.IssuesListForRepoParams = { owner, repo };
    if (options?.pagination?.page) params.page = options.pagination.page;
    if (options?.pagination?.perPage) params.per_page = options.pagination.perPage;

    const { data } = await this.unwrap(this.client.issues.listForRepo(params));

    const items = data.map((val) => ({
      user: {
        id: val.user.id.toString(),
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
    const pagination = this.getPagination(data.length);

    return { items, ...pagination };
  }

  /**
   * Get a single issue in the repo.
   */
  async getIssue(owner: string, repo: string, issueNumber: number): Promise<Issue> {
    // eslint-disable-next-line @typescript-eslint/camelcase
    const response = await this.unwrap(this.client.issues.get({ owner, repo, issue_number: issueNumber }));

    return {
      id: response.data.id,
      user: {
        login: response.data.user.login,
        id: response.data.user.id.toString(),
        url: response.data.user.url,
      },
      url: response.data.url,
      body: response.data.body,
      createdAt: response.data.created_at,
      updatedAt: response.data.updated_at,
      closedAt: response.data.closed_at,
      state: response.data.state,
    };
  }

  /**
   * Get All Comments for an Issue
   */
  async listIssueComments(owner: string, repo: string, issueNumber: number, options?: ListGetterOptions): Promise<Paginated<IssueComment>> {
    const params: Octokit.IssuesListCommentsParams = { owner, repo, issue_number: issueNumber };
    if (options?.pagination?.page) params.page = options.pagination.page;
    if (options?.pagination?.perPage) params.per_page = options.pagination.perPage;

    const { data } = await this.unwrap(this.client.issues.listComments(params));

    const items = data.map((val) => ({
      user: {
        id: val.user.id.toString(),
        login: val.user.login,
        url: val.user.url,
      },
      url: val.url,
      body: val.body,
      createdAt: val.created_at,
      updatedAt: val.updated_at,
      authorAssociation: val.user.login,
      id: val.id,
    }));
    const pagination = this.getPagination(data.length);

    return { items, ...pagination };
  }

  /**
   * Lists all pull request files.
   */
  async listPullRequestFiles(owner: string, repo: string, prNumber: number): Promise<Paginated<PullFiles>> {
    const { data } = await this.unwrap(this.client.pulls.listFiles({ owner, repo, pull_number: prNumber }));

    const items = data.map((val) => ({
      sha: val.sha,
      fileName: val.filename,
      status: val.status,
      additions: val.additions,
      deletions: val.deletions,
      changes: val.changes,
      contentsUrl: val.contents_url,
    }));

    const pagination = this.getPagination(data.length);
    return { items, ...pagination };
  }

  /**
   * Lists commits on a pull request.
   */
  async listPullCommits(owner: string, repo: string, prNumber: number, options?: ListGetterOptions): Promise<Paginated<PullCommits>> {
    const params: Octokit.PullsListCommitsParams = { owner, repo, pull_number: prNumber };
    if (options?.pagination?.page) params.page = options.pagination.page;
    if (options?.pagination?.perPage) params.per_page = options.pagination.perPage;

    const { data } = await this.unwrap(this.client.pulls.listCommits(params));

    const items = data.map((val) => ({
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

    const pagination = this.getPagination(data.length);
    return { items, ...pagination };
  }

  /**
   * List Comments for a Pull Request
   */
  async listPullRequestComments(
    owner: string,
    repo: string,
    prNumber: number,
    options?: ListGetterOptions,
  ): Promise<Paginated<PullRequestComment>> {
    const params: Octokit.PullsListCommentsParams = { owner, repo, pull_number: prNumber };
    if (options?.pagination?.page) params.page = options.pagination.page;
    if (options?.pagination?.perPage) params.per_page = options.pagination.perPage;

    const { data } = await this.unwrap(this.client.pulls.listComments(params));

    const items = data.map((comment) => ({
      user: { id: comment.user.id.toString(), login: comment.user.login, url: comment.user.url },
      id: comment.id,
      url: comment.url,
      body: comment.body,
      createdAt: comment.created_at,
      updatedAt: comment.updated_at,
      authorAssociation: comment.user.login,
    }));

    const pagination = this.getPagination(data.length);
    return { items, ...pagination };
  }

  /**
   * Add Comment to a Pull Request
   */
  async createPullRequestComment(owner: string, repo: string, prNumber: number, body: string): Promise<CreatedUpdatedPullRequestComment> {
    const response: Octokit.Response<Octokit.IssuesCreateCommentResponse> = await this.client.issues.createComment({
      owner,
      repo,
      issue_number: prNumber,
      body,
    });

    const comment = response.data;
    return {
      user: { id: comment.user.id.toString(), login: comment.user.login, url: comment.user.url },
      id: comment.id,
      url: comment.url,
      body: comment.body,
      createdAt: comment.created_at,
      updatedAt: comment.updated_at,
    };
  }

  /**
   * Update Comment on a Pull Request
   */
  async updatePullRequestComment(owner: string, repo: string, commentId: number, body: string): Promise<CreatedUpdatedPullRequestComment> {
    const response: Octokit.Response<Octokit.IssuesUpdateCommentResponse> = await this.client.issues.updateComment({
      owner,
      repo,
      comment_id: commentId,
      body,
    });

    const comment = response.data;
    return {
      user: { id: comment.user.id.toString(), login: comment.user.login, url: comment.user.url },
      id: comment.id,
      url: comment.url,
      body: comment.body,
      createdAt: comment.created_at,
      updatedAt: comment.updated_at,
    };
  }

  /**
   * Add additions, deletions and changes of pull request when the getPullRequests() is called with withDiffStat = true
   */
  async getPullsDiffStat(owner: string, repo: string, prNumber: number) {
    // eslint-disable-next-line @typescript-eslint/camelcase
    const response = await this.unwrap(this.client.pulls.get({ owner, repo, pull_number: prNumber }));

    return {
      additions: response.data.additions,
      deletions: response.data.deletions,
      changes: response.data.additions + response.data.deletions,
    };
  }

  getPagination(totalCount: number) {
    const hasNextPage = false;
    const hasPreviousPage = false;
    const page = 1;
    const perPage = totalCount;

    return { totalCount, hasNextPage, hasPreviousPage, page, perPage };
  }

  /**
   * Debug GitHub request promise
   */
  private unwrap<T>(clientPromise: Promise<Octokit.Response<T>>): Promise<Octokit.Response<T>> {
    return clientPromise
      .then((response) => {
        this.debugGitHubResponse(response);
        return response;
      })
      .catch((error) => {
        if (error.response) {
          debug(`${error.response.status} => ${inspect(error.response.data)}`);
        } else {
          debug(inspect(error));
        }
        throw error;
      });
  }

  /**
   * Debug GitHub response
   * - count API calls and inform about remaining rate limit
   */
  private debugGitHubResponse = <T>(response: Octokit.Response<T>) => {
    this.callCount++;
    debug(`GitHub API Hit: ${this.callCount}. Remaining ${response.headers['x-ratelimit-remaining']} hits. (${response.headers.link})`);
  };
}
