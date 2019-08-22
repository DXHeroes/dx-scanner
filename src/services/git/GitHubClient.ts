/* eslint-disable @typescript-eslint/camelcase */
import Octokit from '@octokit/rest';
import { ConsoleOutput, IOutput } from '../../lib/output';
import { inspect } from 'util';
import { injectable, inject } from 'inversify';
import { grey } from 'colors';
import Debug from 'debug';
import { delay } from '../../lib/delay';
import { ListGetterOptions } from '../../inspectors/common/ListGetterOptions';
import { GitHubPullRequestState, GitHubPagination } from './IGitHubService';
import { Types } from '../../types';
import { ArgumentsProvider } from '../../inversify.config';
const debug = Debug('cli:services:git:github-client');

@injectable()
export class GitHubClient {
  private readonly client: Octokit;
  private readonly output: IOutput;
  private callCount = 0;

  constructor(@inject(Types.ArgumentsProvider) argumentsProvider: ArgumentsProvider) {
    this.output = new ConsoleOutput();

    this.client = new Octokit({
      auth: argumentsProvider.auth,
    });
  }

  /**
   * Gets the contents of a file or directory in a repository.
   */
  async getRepoContent(owner: string, repo: string, path: string) {
    return this.unwrap(this.client.repos.getContents({ owner, repo, path }));
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
  async getContributorsStats(owner: string, repo: string) {
    return this.unwrap(
      this.client.repos.getContributorsStats({ owner, repo }).then((r) => {
        if (r.status === 202) {
          debug('Waiting for GitHub stats to be recomputed');
          return delay(10_000).then(() => this.client.repos.getContributorsStats({ owner, repo }));
        } else {
          return r;
        }
      }),
    );
  }

  /**
   * Lists contributors to the specified repository and sorts them by the number of commits per contributor in descending order.
   */
  async getContributors(
    owner: string,
    repo: string,
    options?: ListGetterOptions<{ anon?: boolean | undefined }>,
  ): Promise<Octokit.Response<{ id: number; login: string; url: string; followersUrl: string; contributions: number }[]>> {
    const pagination = options && options.pagination;

    const listParams: Octokit.ReposListContributorsParams = {
      owner,
      repo,
      ...pagination,
    };
    if (options && options.filter && options.filter.anon) {
      //Set anon to true to include anonymous contributors in results.
      listParams['anon'] = 'true';
    }

    return this.unwrap(this.client.repos.listContributors(listParams));
  }

  /**
   * Lists all pull requests in the repo.
   */
  async getPullRequests(
    owner: string,
    repo: string,
    state: GitHubPullRequestState = GitHubPullRequestState.open,
    options?: GitHubPagination,
  ) {
    return this.unwrap(this.client.pulls.list({ owner, repo, state, ...options }));
  }

  /**
   * Get a single pull request.
   */
  async getPullRequest(owner: string, repo: string, prNumber: number) {
    return this.unwrap(this.client.pulls.get({ owner, repo, pull_number: prNumber }));
  }

  /**
   * Lists all reviews on pull request in the repo.
   */
  async getPullRequestReviews(owner: string, repo: string, prNumber: number, options?: GitHubPagination) {
    return this.unwrap(this.client.pulls.listReviews({ pull_number: prNumber, owner, repo, ...options }));
  }

  /**
   * List all issues in the repo.
   */
  async getIssues(owner: string, repo: string, options?: GitHubPagination) {
    return this.unwrap(this.client.issues.listForRepo({ owner, repo, ...options }));
  }

  /**
   * Get a single issue in the repo.
   */
  async getIssue(owner: string, repo: string, issueNumber: number) {
    return this.unwrap(this.client.issues.get({ owner, repo, issue_number: issueNumber }));
  }

  /**
   * Get the Commit of the given commit_sha in the repo.
   */
  async getCommit(owner: string, repo: string, commitSha: string) {
    return this.unwrap(this.client.git.getCommit({ owner, repo, commit_sha: commitSha }));
  }

  /**
   * Lists commits in the repository.
   *
   * The response will include a verification object that describes the result of verifying the commit's signature.
   * To see the included fields in the verification object see https://octokit.github.io/rest.js/#pagination.
   */
  async getRepoCommits(owner: string, repo: string) {
    return this.unwrap(this.client.repos.listCommits({ owner, repo }));
  }

  /**
   * Lists commits on a pull request.
   */
  async getPullCommits(owner: string, repo: string, prNumber: number) {
    return this.unwrap(this.client.pulls.listCommits({ owner, repo, pull_number: prNumber }));
  }

  /**
   * Lists all pull request files.
   */
  async getPullRequestFiles(owner: string, repo: string, prNumber: number) {
    return this.unwrap(this.client.pulls.listFiles({ owner, repo, pull_number: prNumber }));
  }

  /**
   * Get all results across all pages.
   */
  async paginate(uri: string, owner: string, repo: string, prNumber?: number, issueNumber?: number) {
    const object = {
      owner: owner,
      repo: repo,
    };
    if (prNumber) {
      Object.assign(object, { pull_number: prNumber });
    }
    if (issueNumber) {
      Object.assign(object, { issue_number: issueNumber });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.client.paginate(uri, object, (response: Octokit.Response<any>) => {
      this.debugGitHubResponse(response);
      return response.data;
    });
  }

  /**
   * The parent and source objects are present when the repository is a fork.
   *
   * 'parent' is the repository this repository was forked from.
   * 'source' is the ultimate source for the network.
   */
  async get(owner: string, repo: string) {
    return this.unwrap(this.client.repos.get({ owner, repo }));
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
          this.output.error(`${error.response.status} => ${inspect(error.response.data)}`);
        } else {
          this.output.error(error);
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
    debug(
      grey(`GitHub API Hit: ${this.callCount}. Remaining ${response.headers['x-ratelimit-remaining']} hits. (${response.headers.link})`),
    );
  };
}

export interface GitHubAuth {
  username: string;
  passwordOrToken: string;
}
