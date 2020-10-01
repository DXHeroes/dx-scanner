import Debug from 'debug';
import { inject, injectable } from 'inversify';
import { inspect } from 'util';
import { IVCSService, ServicePagination } from '..';
import { IssueState, ListGetterOptions, Paginated, PullRequestState, PaginationParams } from '../../inspectors';
import { ArgumentsProvider } from '../../scanner';
import { InMemoryCache } from '../../scanner/cache';
import { ICache } from '../../scanner/cache/ICache';
import { Types } from '../../types';
import {
  Commit,
  Contributor,
  ContributorStats,
  CreatedUpdatedPullRequestComment,
  Directory,
  File,
  Issue,
  IssueComment,
  Lines,
  PullCommits,
  PullFiles,
  PullRequest,
  PullRequestComment,
  PullRequestReview,
  Symlink,
  UserInfo,
  Branch,
} from '../git/model';
import { VCSServicesUtils } from '../git/VCSServicesUtils';
import { CustomAxiosResponse, GitLabClient, PaginationGitLabCustomResponse } from './gitlabClient/gitlabUtils';
import { RepositoryConfig } from '../../scanner/RepositoryConfig';
import _ from 'lodash';
const debug = Debug('cli:services:git:gitlab-service');

@injectable()
export class GitLabService implements IVCSService {
  private client: GitLabClient;
  private cache: ICache;
  private callCount = 0;
  private readonly argumentsProvider: ArgumentsProvider;
  private readonly host: string;
  private readonly repositoryConfig: RepositoryConfig;

  constructor(
    @inject(Types.ArgumentsProvider) argumentsProvider: ArgumentsProvider,
    @inject(Types.RepositoryConfig) repositoryConfig: RepositoryConfig,
  ) {
    this.argumentsProvider = argumentsProvider;
    this.repositoryConfig = repositoryConfig;
    this.host = repositoryConfig.host!;

    this.cache = new InMemoryCache();

    this.client = new GitLabClient({
      token: this.argumentsProvider.auth,
      host: this.repositoryConfig.baseUrl,
    });
  }

  purgeCache() {
    this.cache.purge();
  }

  async checkVersion() {
    return (await this.client.Version.check()).data;
  }

  getRepo(owner: string, repo: string) {
    return this.unwrap(this.client.Projects.get(`${owner}/${repo}`));
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

    const { data, pagination } = await this.unwrap(
      this.client.MergeRequests.list(`${owner}/${repo}`, {
        pagination: options?.pagination,
        filter: { state },
      }),
    );

    const user = await this.getUserInfo(owner);

    const items: PullRequest[] = await Promise.all(
      data.map(async (val) => {
        const pullRequest = {
          user: {
            id: val.author.id.toString(),
            login: val.author.username,
            url: val.author.web_url,
          },
          title: val.title,
          url: val.web_url,
          body: val.description,
          sha: val.sha,
          createdAt: val.created_at.toString(),
          updatedAt: val.updated_at.toString(),
          closedAt: val.closed_at ? val.closed_at?.toString() : null,
          mergedAt: val.merged_at ? val.merged_at?.toString() : null,
          state: val.state,
          id: val.iid,
          base: {
            repo: {
              url: `${this.host}/${owner}/${repo}`,
              name: repo,
              id: val.project_id.toString(),
              owner: user,
            },
          },
        };
        // Get number of changes, additions and deletions in PullRequest if the withDiffStat is true
        if (options?.withDiffStat) {
          //TODO
          // https://gitlab.com/gitlab-org/gitlab/issues/206904
          const lines = await this.getPullsDiffStat(owner, repo, val.iid);
          return { ...pullRequest, lines };
        }
        return pullRequest;
      }),
    );
    const customPagination = this.getPagination(pagination);

    return { items, ...customPagination };
  }

  /**
   * Get a single pull request.
   */
  async getPullRequest(owner: string, repo: string, prNumber: number, withDiffStat?: boolean): Promise<PullRequest> {
    const { data } = await this.unwrap(this.client.MergeRequests.get(`${owner}/${repo}`, prNumber));
    const user = await this.getUserInfo(owner);

    const pullRequest: PullRequest = {
      user: {
        id: data.author.id.toString(),
        login: data.author.username,
        url: data.author.web_url,
      },
      title: data.title,
      url: data.web_url,
      sha: data.sha,
      body: data.description,
      createdAt: data.created_at.toString(),
      updatedAt: data.updated_at.toString(),
      closedAt: data.closed_at ? data.closed_at?.toString() : null,
      mergedAt: data.merged_at ? data.merged_at?.toString() : null,
      state: data.state,
      id: data.iid,
      base: {
        repo: {
          url: `${this.host}/${owner}/${repo}`,
          name: repo,
          id: data.project_id.toString(),
          owner: user,
        },
      },
    };

    if (withDiffStat) {
      const lines = await this.getPullsDiffStat(owner, repo, prNumber);
      return { ...pullRequest, lines };
    }

    return pullRequest;
  }

  async listPullRequestFiles(owner: string, repo: string, prNumber: number): Promise<Paginated<PullFiles>> {
    throw new Error('Method not implemented yet.');
  }

  async listPullCommits(owner: string, repo: string, prNumber: number, options?: ListGetterOptions): Promise<Paginated<PullCommits>> {
    const { data, pagination } = await this.unwrap(
      this.client.MergeRequests.listCommits(`${owner}/${repo}`, prNumber, options?.pagination),
    );

    const items = <PullCommits[]>await Promise.all(
      data.map(async (val) => {
        const commitDetail = await this.unwrap(this.client.Commits.get(`${owner}/${repo}`, val.id));

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
              sha: commitDetail.data.parent_ids[0],
              url: `${this.host}/${owner}/${repo}/merge_requests/${prNumber}/diffs?commit_id=${commitDetail.data.parent_ids[0]}`,
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

    const { data, pagination } = await this.unwrap(
      this.client.Issues.list(`${owner}/${repo}`, {
        pagination: options?.pagination,
        filter: { state },
      }),
    );

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
    const { data } = await this.unwrap(this.client.Issues.get(`${owner}/${repo}`, issueNumber));

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

  async listIssueComments(owner: string, repo: string, issueNumber: number, options?: ListGetterOptions): Promise<Paginated<IssueComment>> {
    const { data, pagination } = await this.unwrap(this.client.Issues.listComments(`${owner}/${repo}`, issueNumber, options?.pagination));

    const items = data.map((val) => ({
      user: {
        id: val.author.id.toString(),
        login: val.author.username,
        url: val.author.web_url,
      },
      url: `${this.host}/projects/${owner}/${repo}/notes/${val.id}`,
      // https://docs.gitlab.com/ee/api/notes.html
      body: val.body,
      createdAt: val.created_at.toString(),
      updatedAt: val.updated_at.toString(),
      authorAssociation: val.author.username,
      id: val.id,
    }));
    const customPagination = this.getPagination(pagination);

    return { items, ...customPagination };
  }

  async listBranches(owner: string, repo: string, options?: ListGetterOptions): Promise<Paginated<Branch>> {
    throw new Error('Method not implemented yet.');
  }

  async listPullRequestReviews(owner: string, repo: string, prNumber: number): Promise<Paginated<PullRequestReview>> {
    throw new Error('Method not implemented yet.');
  }

  async listRepoCommits(owner: string, repo: string, options?: ListGetterOptions): Promise<Paginated<Commit>> {
    const { data, pagination } = await this.unwrap(this.client.Commits.list(`${owner}/${repo}`, options?.pagination));

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
    const { data } = await this.unwrap(this.client.Commits.get(`${owner}/${repo}`, commitSha));

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
    const { data, pagination } = await this.unwrap(
      this.client.MergeRequests.listComments(`${owner}/${repo}`, prNumber, options?.pagination),
    );

    const items = data.map((val) => ({
      user: { id: val.author.id.toString(), login: val.author.username, url: val.author.web_url },
      id: val.id,
      url: `${this.host}/projects/${owner}/${repo}/merge_requests/${prNumber}/notes`,
      body: val.body,
      createdAt: val.created_at.toString(),
      updatedAt: val.updated_at.toString(),
      authorAssociation: val.author.username,
    }));

    const customPagination = this.getPagination(pagination);
    return { items, ...customPagination };
  }

  /**
   * Add Comment to a Pull Request
   */
  async createPullRequestComment(owner: string, repo: string, prNumber: number, body: string): Promise<CreatedUpdatedPullRequestComment> {
    const { data } = await this.unwrap(this.client.MergeRequests.createComment(`${owner}/${repo}`, prNumber, body));

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
    const { data } = await this.unwrap(this.client.MergeRequests.updateComment(`${owner}/${repo}`, pullRequestId, body, commentId));

    return {
      user: { id: `${data.author.id}`, login: data.author.username, url: data.author.web_url },
      id: data.id,
      url: `${this.host}/projects/${owner}/${repo}/merge_requests/${pullRequestId}/notes`,
      body: data.body,
      createdAt: data.created_at.toString(),
      updatedAt: data.updated_at.toString(),
    };
  }

  async listRepos() {
    const { data } = await this.unwrap(this.client.Projects.list());
    return data;
  }

  async listGroups() {
    const { data } = await this.unwrap(this.client.Users.listGroups());
    return data;
  }

  async listContributors(owner: string, repo: string, options?: ListGetterOptions): Promise<Contributor[]> {
    const commits = await this.getAllCommits(`${owner}/${repo}`, options?.pagination);
    const items = await Promise.all(
      commits
        //filter duplicate committer names
        .filter((commit, index, array) => array.findIndex((c) => c.committer_name === commit.committer_name) === index)
        //get user info and create contributor object
        .map(async (commit) => {
          return {
            user: await this.getUserInfo(commit.committer_name),
            contributions: commits.filter((value) => value.committer_name === commit.committer_name).length,
          };
        }),
    );
    return items;
  }

  private async getAllCommits(projectId: string, pagination?: PaginationParams) {
    let response = await this.unwrap(this.client.Commits.list(projectId, pagination));
    let data = response.data;
    while (response.pagination.next) {
      const updatedPagination = _.merge(pagination, { page: response.pagination.next });
      response = await this.unwrap(this.client.Commits.list(projectId, updatedPagination));
      data = data.concat(response.data);
    }
    return data;
  }

  async listContributorsStats(owner: string, repo: string): Promise<Paginated<ContributorStats>> {
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
      userInfo = await this.unwrap(this.client.Users.getUser(owner));
      return {
        id: userInfo.data[0].id.toString(),
        login: userInfo.data[0].username,
        url: userInfo.data[0].web_url,
      };
    } catch (error) {
      userInfo = await this.unwrap(this.client.Users.getGroup(owner));

      return {
        id: userInfo.data.id.toString(),
        login: userInfo.data.name,
        url: userInfo.data.web_url,
      };
    }
  }

  private getPagination(pagination: PaginationGitLabCustomResponse): ServicePagination {
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
  private unwrap<T>(clientPromise: Promise<CustomAxiosResponse<T>>): Promise<CustomAxiosResponse<T>> {
    return clientPromise
      .then((response) => {
        this.debugGitLabResponse(response);
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
   * Debug GitLab response
   * - count API calls and inform about remaining rate limit
   */
  private debugGitLabResponse = <T>(response: CustomAxiosResponse<T>) => {
    this.callCount++;
    debug(`GitLab API Hit: ${this.callCount}. Remaining ${response.headers['RateLimit-Remaining']} hits.`);
  };
}
