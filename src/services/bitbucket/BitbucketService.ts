/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/camelcase */
import Bitbucket from 'bitbucket';
import { grey } from 'colors';
import Debug from 'debug';
import GitUrlParse from 'git-url-parse';
import { inject, injectable } from 'inversify';
import { inspect } from 'util';
import { Paginated } from '../../inspectors/common/Paginated';
import { ArgumentsProvider } from '../../inversify.config';
import { DeepRequired } from '../../lib/deepRequired';
import { ICache } from '../../scanner/cache/ICache';
import { InMemoryCache } from '../../scanner/cache/InMemoryCache';
import { Types } from '../../types';
import {
  Issue,
  IssueComment,
  PullCommits,
  PullRequest,
  PullFiles,
  PullRequestReview,
  Commit,
  Contributor,
  ContributorStats,
  Symlink,
  Directory,
  File,
} from '../git/model';
import { ICVSService, BitbucketPullRequestState } from '../git/ICVSService';
import { ListGetterOptions } from '../../inspectors/common/ListGetterOptions';
import { PullRequestState } from '../../inspectors/ICollaborationInspector';
const debug = Debug('cli:services:git:bitbucket-service');

@injectable()
export class BitbucketService implements ICVSService {
  private readonly client: Bitbucket;
  private cache: ICache;
  private callCount = 0;

  constructor(@inject(Types.ArgumentsProvider) argumentsProvider: ArgumentsProvider) {
    this.cache = new InMemoryCache();

    const clientOptions: Bitbucket.Options = {
      hideNotice: true,
    };

    this.client = new Bitbucket(clientOptions);

    let username: string;
    let password: string | undefined;
    if (argumentsProvider.auth && argumentsProvider.auth.includes(':')) {
      username = argumentsProvider.auth.split(':')[0];
      password = argumentsProvider.auth.split(':')[1];
    } else {
      username = GitUrlParse(argumentsProvider.uri).owner;
      password = argumentsProvider.auth;
    }

    let auth: Bitbucket.Auth;
    if (argumentsProvider.auth) {
      auth = { type: 'apppassword', username, password: password! };
      this.client.authenticate(auth);
    }
  }

  purgeCache() {
    this.cache.purge();
  }

  getRepo(owner: string, repo: string) {
    const params: Bitbucket.Params.RepositoriesGet = {
      repo_slug: repo,
      username: owner,
    };

    return this.unwrap(this.client.repositories.get(params));
  }

  async getPullRequests(
    owner: string,
    repo: string,
    options?: ListGetterOptions<{ state?: BitbucketPullRequestState }>,
  ): Promise<Paginated<PullRequest>> {
    const params: Bitbucket.Params.PullrequestsList = {
      repo_slug: repo,
      username: owner,
    };

    let state;
    if (options !== undefined && options.filter !== undefined && options.filter.state !== undefined) {
      state = options.filter.state;
      Object.assign(params, { state: state });
    }

    const response = <DeepRequired<Bitbucket.Response<Bitbucket.Schema.PaginatedPullrequests>>>await this.client.pullrequests.list(params);
    const url = 'www.bitbucket.org';

    const values = response.data.values.map(async (val) => {
      const ownerId = <string>(
        (await this.client.users.get({ username: `${val.destination.repository.full_name.split('/').shift()}` })).data.uuid
      );
      return {
        user: {
          id: val.author.uuid,
          login: val.author.nickname,
          url: val.author.links.html.href,
        },
        url: val.links.html.href,
        body: val.description,
        createdAt: val.created_on,
        updatedAt: val.updated_on,
        //TODO
        closedAt: null,
        //TODO
        mergedAt: null,
        state: val.state,
        id: val.id,
        base: {
          repo: {
            url: val.destination.repository.links.html.href,
            name: val.destination.repository.name,
            id: val.destination.repository.uuid,
            owner: {
              login: <string>val.destination.repository.full_name.split('/').shift(),
              id: ownerId ? ownerId : 'undefined',
              url: url.concat(`/${val.destination.repository.full_name.split('/').shift()}`),
            },
          },
        },
      };
    });

    const pagination = this.getPagination(response.data);

    const items = await Promise.all(values);

    return { items, ...pagination };
  }

  async getPullRequest(owner: string, repo: string, prNumber: number): Promise<PullRequest> {
    const params = {
      pull_request_id: prNumber,
      repo_slug: repo,
      username: owner,
    };

    const response = <DeepRequired<Bitbucket.Response<Bitbucket.Schema.Pullrequest>>>await this.client.pullrequests.get(params);
    response.data;

    return {
      user: {
        id: response.data.author.uuid,
        login: response.data.author.nickname,
        url: response.data.author.links.html.href,
      },
      url: response.data.links.html.href,
      body: response.data.summary.raw,
      createdAt: response.data.created_on,
      updatedAt: response.data.updated_on,
      //TODO
      closedAt: 'undefined',
      //TODO
      mergedAt: null,
      state: response.data.state,
      id: response.data.id,
      base: {
        repo: {
          url: response.data.destination.repository.links.html.href,
          name: response.data.destination.repository.name,
          id: response.data.destination.repository.uuid,
          owner: {
            login: response.data.author.nickname,
            id: response.data.author.uuid,
            url: response.data.author.links.html.href,
          },
        },
      },
    };
  }

  async getPullRequestFiles(owner: string, repo: string, prNumber: number): Promise<Paginated<PullFiles>> {
    throw new Error('Method not implemented yet.');
  }

  async getPullCommits(owner: string, repo: string, prNumber: number): Promise<Paginated<PullCommits>> {
    const params: Bitbucket.Params.PullrequestsListCommits = {
      pull_request_id: prNumber.toString(),
      repo_slug: repo,
      username: owner,
    };

    const response = <DeepRequired<Bitbucket.Response<BitbucketCommit>>>await this.client.pullrequests.listCommits(params);

    const items = response.data.values.map((val) => ({
      sha: val.hash,
      commit: {
        url: val.links.html.href,
        message: val.message,
        author: {
          name: val.author.raw,
          email: 'undefined',
          date: val.date,
        },
        tree: {
          sha: val.hash,
          url: val.links.html.href,
        },
        //TODO
        verified: false,
      },
    }));
    const pagination = this.getPagination(response.data);

    return { items, ...pagination };
  }

  async getIssues(owner: string, repo: string): Promise<Paginated<Issue>> {
    const params: Bitbucket.Params.IssueTrackerList = {
      repo_slug: repo,
      username: owner,
    };
    const response = <DeepRequired<Bitbucket.Response<Bitbucket.Schema.PaginatedIssues>>>await this.client.issue_tracker.list(params);

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
      //TODO
      closedAt: null,
      state: val.state,
      id: val.repository.uuid,
    }));
    const pagination = this.getPagination(response.data);

    return { items, ...pagination };
  }

  async getIssue(owner: string, repo: string, issueNumber: number): Promise<Issue> {
    const params: Bitbucket.Params.IssueTrackerGet = {
      issue_id: issueNumber.toString(),
      repo_slug: repo,
      username: owner,
    };
    const response = <DeepRequired<Bitbucket.Response<Bitbucket.Schema.Issue>>>await this.client.issue_tracker.get(params);

    return {
      id: response.data.repository.uuid,
      user: {
        login: response.data.reporter.nickname,
        id: response.data.reporter.uuid,
        url: response.data.reporter.links.html.href,
      },
      url: response.data.links.html.href,
      body: response.data.content.raw,
      createdAt: response.data.created_on,
      updatedAt: response.data.updated_on,
      //TODO
      closedAt: null,
      state: response.data.state,
    };
  }

  async getIssueComments(owner: string, repo: string, issueNumber: number): Promise<Paginated<IssueComment>> {
    const params: Bitbucket.Params.IssueTrackerListComments = {
      issue_id: issueNumber.toString(),
      repo_slug: repo,
      username: owner,
    };
    const response = <DeepRequired<Bitbucket.Response<Bitbucket.Schema.PaginatedIssueComments>>>(
      await this.client.issue_tracker.listComments(params)
    );

    const items = response.data.values.map((val) => ({
      user: {
        id: val.user.uuid,
        login: val.user.nickname,
        url: val.user.links.html.href,
      },
      url: val.links.html.href,
      body: val.content.raw ? val.content.raw : 'undefined',
      createdAt: val.created_on,
      updatedAt: val.updated_on ? val.updated_on : 'undefined',
      authorAssociation: val.author_association ? val.author_association : 'undefined',
      id: val.id,
    }));
    const pagination = this.getPagination(response.data);

    return { items, ...pagination };
  }

  async getPullRequestReviews(owner: string, repo: string, prNumber: number): Promise<Paginated<PullRequestReview>> {
    throw new Error('Method not implemented yet.');
  }

  async getRepoCommits(owner: string, repo: string) {
    throw new Error('Method not implemented yet.');
  }

  async getCommit(owner: string, repo: string, commitSha: string): Promise<Commit> {
    throw new Error('Method not implemented yet.');
  }

  async getContributors(owner: string, repo: string): Promise<Paginated<Contributor>> {
    throw new Error('Method not implemented yet.');
  }

  async getContributorsStats(owner: string, repo: string): Promise<Paginated<ContributorStats>> {
    throw new Error('Method not implemented yet.');
  }

  async getRepoContent(owner: string, repo: string, path: string): Promise<File | Symlink | Directory | null> {
    throw new Error('Method not implemented yet.');
  }

  private unwrap<T>(clientPromise: Promise<Bitbucket.Response<T>>) {
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

  private debugBitbucketResponse = <T>(response: Bitbucket.Response<T>) => {
    this.callCount++;
    debug(
      grey(`Bitbucket API Hit: ${this.callCount}. Remaining ${response.headers['x-ratelimit-remaining']} hits. (${response.headers.link})`),
    );
  };

  getPagination<T>(data: { next: string; previous: string; page: number; values: T[] }) {
    const hasNextPage = !!data.next;
    const hasPreviousPage = !!data.previous;
    const page = data.page;
    const perPage = data.values && data.values.length;
    const totalCount = data.values && data.values.length;

    return { totalCount, hasNextPage, hasPreviousPage, page, perPage };
  }
}

interface BitbucketCommit {
  next: string;
  page: number;
  pagelen: number;
  previous: string;
  size: number;
  values: Bitbucket.Schema.Commit[];
}
