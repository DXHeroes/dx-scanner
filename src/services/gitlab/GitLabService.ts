/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/camelcase */
import { Response } from 'bitbucket/src/request/types';
import Debug from 'debug';
import { Gitlab } from 'gitlab';
import { inject, injectable } from 'inversify';
import { inspect } from 'util';
import { IVCSService } from '..';
import { IssueState, ListGetterOptions, Paginated, PullRequestState } from '../../inspectors';
import { ArgumentsProvider } from '../../scanner';
import { InMemoryCache } from '../../scanner/cache';
import { ICache } from '../../scanner/cache/ICache';
import { Types } from '../../types';
import { GitServiceUtils } from '../git/GitServiceUtils';
import {
  Commit,
  Contributor,
  ContributorStats,
  CreatedUpdatedPullRequestComment,
  Directory,
  File,
  Issue,
  IssueComment,
  PullCommits,
  PullFiles,
  PullRequest,
  PullRequestComment,
  PullRequestReview,
  Symlink,
  UserInfo,
  Lines,
} from '../git/model';
import { VCSServicesUtils } from '../git/VCSServicesUtils';
import { GitLabClient, PaginationGitLabCustomResponse } from './gitlabClient/gitlabUtils';
const debug = Debug('cli:services:git:gitlab-service');

@injectable()
export class GitLabService implements IVCSService {
  private readonly customClient: GitLabClient;
  private readonly client: Gitlab;
  private cache: ICache;
  private callCount = 0;
  private readonly argumentsProvider: ArgumentsProvider;
  private readonly host: string;

  constructor(@inject(Types.ArgumentsProvider) argumentsProvider: ArgumentsProvider) {
    this.argumentsProvider = argumentsProvider;
    const parsedUrl = GitServiceUtils.parseUrl(argumentsProvider.uri);
    this.host = parsedUrl.host;

    this.cache = new InMemoryCache();

    this.client = new Gitlab({
      token: argumentsProvider.auth,
      host: `${parsedUrl.protocol}://${this.host}`,
    });

    this.customClient = new GitLabClient({
      token: argumentsProvider.auth,
      host: `${parsedUrl.protocol}://${this.host}`,
    });
  }

  purgeCache() {
    this.cache.purge();
  }

  getRepo(owner: string, repo: string) {
    return this.customClient.Projects.get(`${owner}/${repo}`);
  }

  /**
   * Lists all pull requests in the repo.
   */
  async listPullRequests(
    owner: string,
    repo: string,
    options?: { withDiffStat?: boolean } & ListGetterOptions<{ state?: PullRequestState }>,
  ): Promise<Paginated<PullRequest>> {
    const state = VCSServicesUtils.getGitLabPRState(options?.filter?.state);

    const { data, pagination } = <any>await this.client.MergeRequests.all({
      page: options?.pagination?.page,
      per_page: options?.pagination?.perPage,
      showPagination: true,

      projectId: `${owner}/${repo}`,
      state,
    });

    const parsedUrl = GitServiceUtils.parseUrl(this.argumentsProvider.uri);
    const repoUrl = `${parsedUrl.host}/${owner}/${repo}`;
    let ownerInfo = (<any>await this.client.Users.all({ username: owner }))[0];
    if (!ownerInfo) {
      ownerInfo = <any>await this.client.Groups.show(owner);
    }

    const items = await Promise.all(
      <PullRequest[]>await Promise.all(
        data.map(async (val: any) => {
          const pullRequest = {
            user: {
              id: val.author.id,
              login: val.author.username,
              url: val.author.web_url,
            },
            url: val.web_url,
            body: val.desciption,
            createdAt: val.created_at,
            updatedAt: val.updated_at,
            closedAt: val.closed_at,
            state: val.state,
            id: val.iid, //id?
            base: {
              repo: {
                url: repoUrl,
                name: repo,
                id: val.project_id,
                owner: {
                  url: `${parsedUrl.host}/${owner}`,
                  id: ownerInfo.id,
                  login: ownerInfo.username,
                },
              },
            },
          };
          // Get number of changes, additions and deletions in PullRequest if the withDiffStat is true
          if (options?.withDiffStat) {
            //TODO
            // https://gitlab.com/gitlab-org/gitlab/issues/206904
            const lines = await this.getPullsDiffStat(owner, repo, val.number);
            return { ...pullRequest, lines };
          }
          return pullRequest;
        }),
      ),
    );
    const customPagination = this.getPagination(pagination);

    return { items, ...customPagination };
  }

  /**
   * Get a single pull request.
   */
  async getPullRequest(owner: string, repo: string, prNumber: number, withDiffStat?: boolean): Promise<PullRequest> {
    //TODO - to function

    let ownerInfo = (<any>await this.client.Users.all({ username: owner }))[0];
    if (!ownerInfo) {
      ownerInfo = <any>await this.client.Groups.show(owner);
    }

    const response = <any>await this.client.MergeRequests.show(`${owner}/${repo}`, prNumber);

    const pullRequest = {
      user: {
        id: response.author.id,
        login: response.author.username,
        url: response.author.web_url,
      },
      url: response.web_url,
      body: response.desciption,
      createdAt: response.created_at,
      updatedAt: response.updated_at,
      closedAt: response.closed_at,
      mergedAt: response.merged_at,
      state: response.state,
      id: response.iid,
      base: {
        repo: {
          url: `${this.host}/${owner}/${repo}`,
          name: repo,
          id: response.project_id,
          owner: {
            url: `${this.host}/${owner}`,
            id: ownerInfo.id,
            login: ownerInfo.username,
          },
        },
      },
    };

    //TODO
    if (withDiffStat) {
      const lines: any = await this.getPullsDiffStat(owner, repo, prNumber);
      return { ...pullRequest, lines };
    }

    return pullRequest;
  }

  async listPullRequestFiles(owner: string, repo: string, prNumber: number): Promise<Paginated<PullFiles>> {
    throw new Error('Method not implemented yet.');
  }

  async listPullCommits(owner: string, repo: string, prNumber: number, options?: ListGetterOptions): Promise<Paginated<PullCommits>> {
    const { data, pagination } = await this.customClient.MergeRequests.listCommits(`${owner}/${repo}`, prNumber, options?.pagination);

    const items = <PullCommits[]>await Promise.all(
      data.map(async (val) => {
        //TODO use custom client
        const commitDetail = <any>await this.client.Commits.show(`${owner}/${repo}`, val.id);
        const commit = {
          sha: val.id,
          commit: {
            url: `${this.host}/${owner}/${repo}/merge_requests/${prNumber}/diffs?commit_id=${val.id}`,
            message: val.message,
            author: {
              name: val.author_name, //get username?
              email: val.author_email,
              date: val.created_at.toString(),
            },
            tree: {
              sha: commitDetail.parent_ids[0],
              url: `${this.host}/${owner}/${repo}/merge_requests/${prNumber}/diffs?commit_id=${commitDetail.parent_ids[0]}`,
            },
            //TODO
            verified: false,
          },
        };
        return commit;
      }),
    );
    const customPagination = this.getPagination(pagination);

    return { items, ...customPagination };
  }

  async listIssues(owner: string, repo: string, options?: ListGetterOptions<{ state?: IssueState }>): Promise<Paginated<Issue>> {
    const state = VCSServicesUtils.getGitLabIssueState(options?.filter?.state);

    const { data, pagination } = await this.customClient.Issues.list(`${owner}/${repo}`, {
      pagination: options?.pagination,
      filter: { state },
    });

    const user: UserInfo = await this.getUserInfo(owner);

    const items: Issue[] = data.map((val) => ({
      user: user,
      url: val.web_url,
      body: val.description,
      createdAt: val.created_at.toString(),
      updatedAt: val.updated_at.toString(),
      closedAt: val.closed_at ? val.closed_at?.toString() : null,
      state: val.state,
      id: val.iid,
    }));
    const customPagination = this.getPagination(pagination);

    return { items, ...customPagination };
  }

  async getIssue(owner: string, repo: string, issueNumber: number): Promise<Issue> {
    const { data } = await this.customClient.Issues.get(`${owner}/${repo}`, issueNumber);

    return {
      id: data.iid,
      user: {
        login: data.author.username,
        id: data.author.id.toString(),
        url: data.author.web_url,
      },
      url: data.web_url,
      body: data.description,
      createdAt: data.created_at.toString(),
      updatedAt: data.updated_at.toString(),
      closedAt: data.closed_at ? data.closed_at.toString() : null,
      state: data.state,
    };
  }

  async listIssueComments(owner: string, repo: string, issueNumber: number): Promise<Paginated<IssueComment>> {
    const { data, pagination } = await this.customClient.Issues.listComments(`${owner}/${repo}`, issueNumber);

    const items = data.map((val) => ({
      user: {
        id: val.author.id.toString(),
        login: val.author.username,
        url: val.author.web_url,
      },
      url: `${this.host}/projects/${owner}/${repo}/notes/${val.id}`,
      // https://docs.gitlab.com/ee/api/notes.html
      body: undefined,
      createdAt: val.created_at.toString(),
      updatedAt: val.updated_at.toString(),
      authorAssociation: val.author.username,
      id: val.id,
    }));
    const customPagination = this.getPagination(pagination);

    return { items, ...customPagination };
  }

  async listPullRequestReviews(owner: string, repo: string, prNumber: number): Promise<Paginated<PullRequestReview>> {
    throw new Error('Method not implemented yet.');
  }

  async listRepoCommits(owner: string, repo: string, sha?: string, options?: ListGetterOptions): Promise<Paginated<Commit>> {
    const { data, pagination } = await this.customClient.Commits.list(`${owner}/${repo}`);

    const items = data.map((val) => {
      return {
        sha: val.id,
        url: `${this.host}/projects/${owner}/${repo}/repository/commits/${val.short_id}`,
        message: val.message,
        author: {
          name: val.author_name,
          email: val.author_email,
          date: val.committed_date.toString(),
        },
        tree: {
          sha: val.parent_ids[0],
          url: `${this.host}/projects/${owner}/${repo}/repository/commits/${val.parent_ids[0]}`,
        },
        // TODO
        verified: false,
      };
    });

    const customPagination = this.getPagination(pagination);

    return { items, ...customPagination };
  }

  async getCommit(owner: string, repo: string, commitSha: string): Promise<Commit> {
    const { data } = await this.customClient.Commits.get(`${owner}/${repo}`, commitSha);

    return {
      sha: data.id,
      url: `${this.host}/projects/${owner}/${repo}/repository/commits/${data.short_id}`,
      message: data.message,
      author: {
        name: data.author_name,
        email: data.author_email,
        date: data.committed_date.toString(),
      },
      tree: {
        sha: data.parent_ids[0],
        url: `${this.host}/projects/${owner}/${repo}/repository/commits/${data.parent_ids[0]}`,
      },
      // TODO
      verified: false,
    };
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
    const { data, pagination } = await this.customClient.MergeRequests.listComments(`${owner}/${repo}`, prNumber, options?.pagination);

    const items = data.map((val) => ({
      user: { id: val.author.id.toString(), login: val.author.username, url: val.author.web_url },
      id: val.id,
      url: `${this.host}/projects/${owner}/${repo}/merge_requests/${prNumber}/notes`,
      body: val.body,
      createdAt: val.created_at.toString(),
      updatedAt: val.updated_at.toString(),
      authorAssociation: val.attachment,
    }));

    const customPagination = this.getPagination(pagination);
    return { items, ...customPagination };
  }

  /**
   * Add Comment to a Pull Request
   */
  async createPullRequestComment(owner: string, repo: string, prNumber: number, body: string): Promise<CreatedUpdatedPullRequestComment> {
    const { data } = await this.customClient.MergeRequests.createComment(`${owner}/${repo}`, prNumber, body);

    return {
      user: { id: `${data.author.id}`, login: data.author.username, url: data.author.web_url },
      id: data.id,
      url: `${this.host}/projects/${owner}/${repo}/merge_requests/${prNumber}/notes`,
      body: data.body,
      createdAt: data.created_at.toString(),
      updatedAt: data.updated_at.toString(),
    };
  }

  /**
   * Update Comment on a Pull Request
   */
  async updatePullRequestComment(
    owner: string,
    repo: string,
    commentId: number,
    body: string,
    pullRequestId: number,
  ): Promise<CreatedUpdatedPullRequestComment> {
    const { data, pagination } = await this.customClient.MergeRequests.updateComment(`${owner}/${repo}`, pullRequestId, body, commentId);

    return {
      user: { id: `${data.author.id}`, login: data.author.username, url: data.author.web_url },
      id: data.id,
      url: `${this.host}/projects/${owner}/${repo}/merge_requests/${pullRequestId}/notes`,
      body: data.body,
      createdAt: data.created_at.toString(),
      updatedAt: data.updated_at.toString(),
    };
  }

  async listContributors(owner: string, repo: string): Promise<Paginated<Contributor>> {
    throw new Error('Method not implemented yet.');
  }

  async getContributorsStats(owner: string, repo: string): Promise<Paginated<ContributorStats>> {
    throw new Error('Method not implemented yet.');
  }

  async getRepoContent(owner: string, repo: string, path: string): Promise<File | Symlink | Directory | null> {
    throw new Error('Method not implemented yet.');
  }

  async getPullsDiffStat(owner: string, repo: string, prNumber: number): Promise<Lines> {
    throw new Error('Method not implemented yet for GitLab.');
  }

  private async getUserInfo(owner: string) {
    let userInfo;
    try {
      userInfo = await this.customClient.Users.getUser(owner);

      return {
        id: userInfo.data[0].id.toString(),
        login: userInfo.data[0].username,
        url: userInfo.data[0].web_url,
      };
    } catch (error) {
      userInfo = await this.customClient.Users.getGroup(owner);
      return {
        id: userInfo.data.id.toString(),
        login: userInfo.data.name,
        url: userInfo.data.web_url,
      };
    }
  }

  //TODO interface for pagination
  private getPagination(pagination: PaginationGitLabCustomResponse) {
    const hasNextPage = !!pagination.next;
    const hasPreviousPage = !!pagination.previous;
    const page = pagination.current;
    const perPage = pagination.perPage;
    let totalCount = pagination.total;

    if (Number.isNaN(totalCount)) {
      // If the number of resources is more than 10,000, the X-Total is not present in the response headers.
      // https://docs.gitlab.com/ee/api/#other-pagination-headers
      totalCount = 10000;
    }

    return { totalCount, hasNextPage, hasPreviousPage, page, perPage };
  }

  /**
   * Debug GitLab request promise
   */
  private unwrap<T>(clientPromise: Promise<Response<T>>): Promise<Response<T>> {
    return clientPromise
      .then((response) => {
        //this.debugGitLabResponse(response);
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
  private debugGitLabResponse = <T>(response: Response<T>) => {
    // this.callCount++;
    // debug(`GitHub API Hit: ${this.callCount}. Remaining ${response.headers['x-ratelimit-remaining']} hits. (${response.headers.link})`);
  };
}
