import { Bitbucket, APIClient, Schema, Params } from 'bitbucket';
import { Response } from 'bitbucket/src/request/types';
import { AuthBasic } from 'bitbucket/src/plugins/auth/types';
import { grey } from 'colors';
import Debug from 'debug';
import GitUrlParse from 'git-url-parse';
import { inject, injectable } from 'inversify';
import { inspect } from 'util';
import axios from 'axios';
import qs from 'qs';
import { IVCSService } from '..';
import { ArgumentsProvider } from '../../scanner';
import { ICache } from '../../scanner/cache/ICache';
import { Types } from '../../types';
import { ListGetterOptions, PullRequestState, Paginated } from '../../inspectors';
import { IssueState } from '../../inspectors/IIssueTrackingInspector';
import {
  PullRequest,
  PullFiles,
  PullCommits,
  Issue,
  IssueComment,
  PullRequestReview,
  Commit,
  PullRequestComment,
  CreatedUpdatedPullRequestComment,
  Contributor,
  ContributorStats,
  Symlink,
  File,
  Directory,
  Branch,
} from '../git/model';
import { VCSServicesUtils } from '../git/VCSServicesUtils';
import { DeepRequired } from '../../lib/deepRequired';
import { InMemoryCache } from '../../scanner/cache';
import { BitbucketPullRequestState, BitbucketIssueState } from './IBitbucketService';
import { RepositoryConfig } from '../../scanner/RepositoryConfig';

const debug = Debug('cli:services:git:bitbucket-service');

@injectable()
export class BitbucketService implements IVCSService {
  private client: APIClient;
  private readonly argumentsProvider: ArgumentsProvider;
  private cache: ICache;
  private callCount = 0;
  private authenticated = false;
  private readonly repositoryConfig: RepositoryConfig;

  constructor(
    @inject(Types.ArgumentsProvider) argumentsProvider: ArgumentsProvider,
    @inject(Types.RepositoryConfig) repositoryConfig: RepositoryConfig,
  ) {
    this.cache = new InMemoryCache();
    this.argumentsProvider = argumentsProvider;
    this.repositoryConfig = repositoryConfig;
    this.client = Bitbucket({
      notice: false,
    });
  }

  purgeCache() {
    this.cache.purge();
  }

  authenticate() {
    if (this.authenticated || !this.argumentsProvider.auth) return;

    let username: string;
    let password: string | undefined;
    if (this.argumentsProvider.auth && this.argumentsProvider.auth.includes(':')) {
      username = this.argumentsProvider.auth.split(':')[0];
      password = this.argumentsProvider.auth.split(':')[1];
    } else {
      username = GitUrlParse(this.argumentsProvider.uri).owner;
      password = this.argumentsProvider.auth;
    }

    let auth: AuthBasic;
    if (this.argumentsProvider.auth) {
      auth = { username, password };
      this.client = Bitbucket({
        notice: false,
        auth,
      });
      this.authenticated = true; // set authentication to instance
    }
  }

  getRepo(owner: string, repo: string) {
    this.authenticate();
    const params: Params.RepositoriesGet = {
      repo_slug: repo,
      workspace: owner,
    };

    return this.unwrap(this.client.repositories.get(params));
  }

  async listPullRequests(
    owner: string,
    repo: string,
    options?: { withDiffStat?: boolean } & ListGetterOptions<{ state?: PullRequestState }>,
  ): Promise<Paginated<PullRequest>> {
    this.authenticate();
    const apiUrl = `https://api.bitbucket.org/2.0/repositories/${owner}/${repo}/pullrequests`;
    const ownerUrl = `https://bitbucket.org/${owner}`;

    let state;
    if (options?.filter?.state) {
      state = VCSServicesUtils.getBitbucketPRState(options.filter.state);
    }
    const ownerId = `${(await this.unwrap(this.client.repositories.get({ repo_slug: repo, workspace: owner }))).data.owner?.uuid}`;
    const response = <DeepRequired<Response<Schema.PaginatedPullrequests>>>await this.unwrap(
      axios.get(apiUrl, {
        params: { state, page: options?.pagination?.page, pagelen: options?.pagination?.perPage },
        paramsSerializer: function (params) {
          return qs.stringify(params, { arrayFormat: 'repeat', encode: false });
        },
      }),
    );

    const items = await Promise.all(
      response.data.values.map(async (val) => {
        const pullRequest = {
          user: {
            id: val.author.uuid,
            login: val.author.nickname,
            url: val.author.links.html.href,
          },
          title: val.title,
          url: val.links.html.href,
          body: val.summary.markup,
          sha: val.source?.commit?.hash,
          createdAt: val.created_on,
          updatedAt: val.updated_on,
          closedAt:
            val.state === BitbucketPullRequestState.closed || val.state === BitbucketPullRequestState.declined ? val.updated_on : null,
          mergedAt: val.state === BitbucketPullRequestState.closed ? val.updated_on : null,
          state: val.state,
          id: val.id,
          base: {
            repo: {
              url: val.destination.repository.links.html.href,
              name: val.destination.repository.name,
              id: val.destination.repository.uuid,
              owner: {
                login: owner,
                id: ownerId,
                url: ownerUrl,
              },
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

    const pagination = this.getPagination(response.data);

    return { items, ...pagination };
  }

  async getPullRequest(owner: string, repo: string, prNumber: number, withDiffStat?: boolean): Promise<PullRequest> {
    this.authenticate();

    const params = {
      pull_request_id: prNumber,
      repo_slug: repo,
      workspace: owner,
    };

    const ownerUrl = `https://bitbucket.org/${owner}`;
    const ownerId = `${(await this.unwrap(this.client.repositories.get({ repo_slug: repo, workspace: owner }))).data.owner?.uuid}`;

    const response = <DeepRequired<Response<Schema.Pullrequest>>>await this.unwrap(this.client.pullrequests.get(params));

    const pullRequest = {
      user: {
        id: response.data.author.uuid,
        login: response.data.author.nickname,
        url: response.data.author.links.html.href,
      },
      title: response.data.title,
      url: response.data.links.html.href,
      body: response.data.summary.raw,
      sha: response.data.source.commit.hash,
      createdAt: response.data.created_on,
      updatedAt: response.data.updated_on,
      closedAt:
        response.data.state === BitbucketPullRequestState.closed || response.data.state === BitbucketPullRequestState.declined
          ? response.data.updated_on
          : null,
      mergedAt: response.data.state === BitbucketPullRequestState.closed ? response.data.updated_on : null,
      state: response.data.state,
      id: response.data.id,
      base: {
        repo: {
          url: response.data.destination.repository.links.html.href,
          name: response.data.destination.repository.name,
          id: response.data.destination.repository.uuid,
          owner: {
            login: owner,
            id: ownerId,
            url: ownerUrl,
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

  async listPullRequestFiles(owner: string, repo: string, prNumber: number): Promise<Paginated<PullFiles>> {
    this.authenticate();
    throw new Error('Method not implemented yet.');
  }

  async listPullCommits(owner: string, repo: string, prNumber: number, options?: ListGetterOptions): Promise<Paginated<PullCommits>> {
    this.authenticate();
    const params: Params.PullrequestsListCommits = {
      pull_request_id: prNumber.toString(),
      repo_slug: repo,
      workspace: owner,
    };

    if (options?.pagination?.page) {
      params.page = options.pagination.page.toString();
    }
    if (options?.pagination?.perPage) {
      params.pagelen = options.pagination.perPage;
    }

    const response = <DeepRequired<Response<BitbucketCommit>>>await this.unwrap(this.client.pullrequests.listCommits(params));

    const items = response.data.values.map((val) => {
      const commitUrl = `https://bitbucket.org/${val.repository.full_name}/commits/${val.hash}`;
      return {
        sha: val.hash,
        commit: {
          url: commitUrl,
          message: val.message,
          author: {
            name: val.author.raw,
            email: this.extractEmailFromString(val.author.raw) || '',
            date: val.date,
          },
          tree: {
            sha: val.hash,
            url: commitUrl,
          },
          //TODO
          verified: false,
        },
      };
    });

    const pagination = this.getPagination(response.data);

    return { items, ...pagination };
  }

  async listIssues(owner: string, repo: string, options?: ListGetterOptions<{ state?: IssueState }>): Promise<Paginated<Issue>> {
    this.authenticate();
    const apiUrl = `https://api.bitbucket.org/2.0/repositories/${owner}/${repo}/issues`;

    const state = VCSServicesUtils.getBitbucketIssueState(options?.filter?.state);
    // get state for q parameter
    const stringifiedState = VCSServicesUtils.getBitbucketStateQueryParam(state);

    const params = {
      q: stringifiedState,
      page: options?.pagination?.page,
      pagelen: options?.pagination?.perPage,
    };

    const response = <DeepRequired<Response<Schema.PaginatedIssues>>>await this.unwrap(
      axios.get(apiUrl, {
        params,
        paramsSerializer: qs.stringify,
      }),
    );

    const items = response.data.values.map((val) => ({
      user: {
        id: val.reporter.uuid,
        login: val.reporter.nickname,
        url: val.reporter.links.html.href,
      },
      url: val.repository.links.html.href,
      body: val.content.raw,
      createdAt: val.created_on,
      updatedAt: val.updated_on,
      closedAt: val.state === BitbucketIssueState.resolved || val.state === BitbucketIssueState.closed ? val.updated_on : null,
      state: val.state,
      id: val.id,
    }));
    const pagination = this.getPagination(response.data);

    return { items, ...pagination };
  }

  async getIssue(owner: string, repo: string, issueNumber: number): Promise<Issue> {
    this.authenticate();

    const params: Params.IssueTrackerGet = {
      issue_id: issueNumber.toString(),
      repo_slug: repo,
      workspace: owner,
    };
    const response = <DeepRequired<Response<Schema.Issue>>>await this.unwrap(this.client.issue_tracker.get(params));

    return {
      id: response.data.id,
      user: {
        login: response.data.reporter.nickname,
        id: response.data.reporter.uuid,
        url: response.data.reporter.links.html.href,
      },
      url: response.data.links.html.href,
      body: response.data.content.raw,
      createdAt: response.data.created_on,
      updatedAt: response.data.updated_on,
      closedAt:
        response.data.state === BitbucketIssueState.resolved || response.data.state === BitbucketIssueState.closed
          ? response.data.updated_on
          : null,
      state: response.data.state,
    };
  }

  async listIssueComments(owner: string, repo: string, issueNumber: number): Promise<Paginated<IssueComment>> {
    this.authenticate();
    const params: Params.IssueTrackerListComments = {
      issue_id: issueNumber.toString(),
      repo_slug: repo,
      workspace: owner,
    };
    const response = <DeepRequired<Response<Schema.PaginatedIssueComments>>>(
      await this.unwrap(this.client.issue_tracker.listComments(params))
    );

    const items = response.data.values.map((val) => ({
      user: {
        id: val.user.uuid,
        login: val.user.nickname,
        url: val.user.links.html.href,
      },
      url: val.links.html.href,
      body: val.content.raw,
      createdAt: val.created_on,
      updatedAt: val.updated_on,
      authorAssociation: val.user.username,
      id: val.id,
    }));
    const pagination = this.getPagination(response.data);

    return { items, ...pagination };
  }

  async listBranches(owner: string, repo: string, options?: ListGetterOptions): Promise<Paginated<Branch>> {
    this.authenticate();

    const [responseBranches, responseBranchingModel] = await Promise.all([
      this.client.refs.listBranches({
        repo_slug: repo,
        workspace: owner,
        page: options?.pagination?.page?.toString(),
        pagelen: options?.pagination?.perPage,
      }),
      this.client.branching_model.get({
        repo_slug: repo,
        workspace: owner,
      }),
    ]);
    const items: Branch[] =
      responseBranches.data.values?.map((val) => ({
        name: val.name || '',
        type: val.name === responseBranchingModel.data.development?.branch?.name ? 'default' : 'unknown',
      })) || [];
    const pagination = this.getPagination({
      ...responseBranches.data,
      values: responseBranches.data.values?.filter(Boolean) as Schema.Branch[],
    });

    return { items, ...pagination };
  }

  async listPullRequestReviews(owner: string, repo: string, prNumber: number): Promise<Paginated<PullRequestReview>> {
    this.authenticate();
    throw new Error('Method not implemented yet.');
  }

  async listRepoCommits(owner: string, repo: string, options?: ListGetterOptions): Promise<Paginated<Commit>> {
    this.authenticate();
    const params: Params.RepositoriesListCommits = {
      repo_slug: repo,
      workspace: owner,
    };
    if (options?.pagination?.page) params.page = options.pagination.page.toString();
    if (options?.pagination?.perPage) params.pagelen = options.pagination.perPage;

    const response = <DeepRequired<Response<BitbucketCommit>>>await this.unwrap(this.client.repositories.listCommits(params));
    const items = response.data.values.map((val) => {
      return {
        sha: val.hash,
        url: `https://bitbucket.org/${val.repository.full_name}/commits/${val.hash}`,
        message: val.message,
        author: {
          name: val.author.user.nickname,
          email: this.extractEmailFromString(val.author.raw) || '',
          date: val.date,
        },
        tree: {
          sha: val.parents[0].hash,
          url: `https://bitbucket.org/${val.repository.full_name}/commits/${val.parents[0].hash}`,
        },
        // TODO
        verified: false,
      };
    });

    const pagination = this.getPagination(response.data);

    return { items, ...pagination };
  }

  async getCommit(owner: string, repo: string, commitSha: string): Promise<Commit> {
    this.authenticate();
    const params: Params.CommitsGet = {
      node: commitSha,
      repo_slug: repo,
      workspace: owner,
    };
    const response = <DeepRequired<Response<Schema.Commit>>>await this.unwrap(this.client.commits.get(params));

    return {
      sha: response.data.hash,
      url: `https://bitbucket.org/${response.data.repository.full_name}/commits/${response.data.hash}`,
      message: response.data.message,
      author: {
        name: response.data.author.user.nickname,
        email: this.extractEmailFromString(response.data.author.raw) || '',
        date: response.data.date,
      },
      tree: {
        sha: response.data.parents[0].hash,
        url: `https://bitbucket.org/${response.data.repository.full_name}/commits/${response.data.parents[0].hash}`,
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
    this.authenticate();

    const response = <DeepRequired<Response<Schema.PaginatedPullrequestComments>>>await this.client.pullrequests.listComments({
      pull_request_id: prNumber,
      repo_slug: repo,
      workspace: owner,
      page: `${options?.pagination?.page}`,
      pagelen: options?.pagination?.perPage,
    });

    const items = response.data.values.map((comment) => ({
      user: { id: comment.user.uuid, login: comment.user.username, url: comment.user.website },
      id: comment.id,
      url: comment.links.html.href,
      body: comment.content.markup,
      createdAt: comment.created_on,
      updatedAt: comment.updated_on,
      authorAssociation: comment.user.username,
    }));

    const pagination = this.getPagination(response.data);
    return { items, ...pagination };
  }

  /**
   * Add Comment to a Pull Request
   */
  async createPullRequestComment(owner: string, repo: string, prNumber: number, body: string): Promise<CreatedUpdatedPullRequestComment> {
    this.authenticate();
    const response = <DeepRequired<Response<Schema.Comment>>>await this.unwrap(
      this.client.pullrequests.createComment({
        pull_request_id: prNumber,
        repo_slug: repo,
        workspace: owner,
        _body: { type: 'pullrequest_comment', content: { raw: body, markup: 'markdown' } },
      }),
    );

    const comment = response.data;
    return {
      user: { id: `${comment.user.id}`, login: comment.user.username, url: comment.user.links.html.href },
      id: comment.id,
      url: comment.links.html.href,
      body: comment.content.raw,
      createdAt: comment.created_on,
      updatedAt: comment.updated_on,
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
    this.authenticate();
    const response = <DeepRequired<Response<Schema.Comment>>>await this.unwrap(
      this.client.pullrequests.updateComment({
        pull_request_id: `${pullRequestId}`,
        comment_id: `${commentId}`,
        repo_slug: repo,
        workspace: owner,
        _body: { type: 'pullrequest_comment', content: { raw: body, markup: 'markdown' } },
      }),
    );

    const comment = response.data;
    return {
      user: { id: `${comment.user.id}`, login: comment.user.username, url: comment.user.website },
      id: comment.id,
      url: comment.links.html.href,
      body: comment.content.markup,
      createdAt: comment.created_on,
      updatedAt: comment.updated_on,
    };
  }

  async listContributors(owner: string, repo: string): Promise<Contributor[]> {
    this.authenticate();
    const params: Params.RepositoriesListCommits = {
      repo_slug: repo,
      workspace: owner,
    };
    const commits = await this.paginateCommits(params);

    return (
      commits
        //filter duplicate committer names
        .filter((commit, index, array) => array.findIndex((t) => t.author?.user?.nickname === commit.author?.user?.nickname) === index)
        //create contributor object
        .map((commit) => {
          return {
            user: {
              id: commit.author?.user?.uuid || '',
              url: commit.author?.user?.links?.html?.href || '',
              login: commit.author?.user?.nickname || '',
            },
            contributions: commits.filter((value) => value.author?.user?.nickname === commit.author?.user?.nickname).length,
          };
        })
    );
  }

  async listContributorsStats(owner: string, repo: string): Promise<Paginated<ContributorStats>> {
    this.authenticate();
    throw new Error('Method not implemented yet.');
  }

  async getRepoContent(owner: string, repo: string, path: string): Promise<File | Symlink | Directory | null> {
    this.authenticate();
    throw new Error('Method not implemented yet.');
  }

  /**
   * Add additions, deletions and changes of pull request when the getPullRequests() is called with withDiffStat = true
   */
  async getPullsDiffStat(owner: string, repo: string, prNumber: number) {
    const diffStatData = (
      await this.unwrap(this.client.pullrequests.getDiffStat({ repo_slug: repo, workspace: owner, pull_request_id: prNumber.toString() }))
    ).data;

    let linesRemoved = 0,
      linesAdded = 0;

    diffStatData.values.forEach((val: { lines_removed: number; lines_added: number }) => {
      linesRemoved += val.lines_removed;
      linesAdded += val.lines_added;
    });

    return {
      additions: linesAdded,
      deletions: linesRemoved,
      changes: linesAdded + linesRemoved,
    };
  }

  private async paginateCommits(params: Params.RepositoriesListCommits) {
    let response = <Response<BitbucketCommit>>await this.unwrap(this.client.repositories.listCommits(params));
    let values = response.data.values;
    while (this.client.hasNextPage(response.data)) {
      response = <Response<BitbucketCommit>>await this.unwrap(this.client.request(response.data.next, params));
      values = values.concat(response.data.values);
    }
    return values;
  }

  private unwrap<T>(clientPromise: Promise<Response<T>>) {
    return clientPromise
      .then((response) => {
        this.debugBitbucketResponse(response);
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

  private debugBitbucketResponse = <T>(response: Response<T>) => {
    this.callCount++;
    debug(
      grey(`Bitbucket API Hit: ${this.callCount}. Remaining ${response.headers['x-ratelimit-remaining']} hits. (${response.headers.link})`),
    );
  };

  getPagination<T>(data: { next?: string; previous?: string; page?: number; values: T[] }) {
    const hasNextPage = !!data.next;
    const hasPreviousPage = !!data.previous;
    const page = data.page;
    const perPage = data.values && data.values.length;
    const totalCount = data.values && data.values.length;

    return { totalCount, hasNextPage, hasPreviousPage, page, perPage };
  }

  private extractEmailFromString = (text: string): string | undefined => {
    const emailRegex = /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/gim;
    const email = text.match(emailRegex);
    if (email) return email[0];
    return undefined;
  };
}

export interface BitbucketCommit {
  next: string;
  page: number;
  pagelen: number;
  previous: string;
  size: number;
  values: Schema.Commit[];
}
