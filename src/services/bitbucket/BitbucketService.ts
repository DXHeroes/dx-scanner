/* eslint-disable @typescript-eslint/camelcase */
import Bitbucket from 'bitbucket';
import { grey } from 'colors';
import Debug from 'debug';
import { inject, injectable } from 'inversify';
import { inspect } from 'util';
import { ArgumentsProvider } from '../../inversify.config';
import { ICache } from '../../scanner/cache/ICache';
import { InMemoryCache } from '../../scanner/cache/InMemoryCahce';
import { Types } from '../../types';
import { IGitHubService, GitHubPullRequestState } from '../git/IGitHubService';
import { ListGetterOptions } from '../../inspectors/common/ListGetterOptions';
import { PullsListResponseItem } from '@octokit/rest';
import { Paginated } from '../../inspectors/common/Paginated';
import { PullRequest, Issue } from '../git/model';
import GitUrlParse from 'git-url-parse';
const debug = Debug('cli:services:git:github-service');

// implements IBitbucketService
//implements IGitHubService
@injectable()
export class BitbucketService {
  private readonly client: Bitbucket;
  private cache: ICache;
  private callCount = 0;

  constructor(@inject(Types.ArgumentsProvider) argumentsProvider: ArgumentsProvider) {
    this.cache = new InMemoryCache();

    const clientOptions: Bitbucket.Options = {
      hideNotice: true,
    };

    this.client = new Bitbucket(clientOptions);

    const username = GitUrlParse(argumentsProvider.uri).owner;

    let auth: Bitbucket.Auth;
    if (argumentsProvider.auth) {
      auth = { type: 'apppassword', username: username, password: argumentsProvider.auth };
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

  async getPullRequests(owner: string, repo: string): Promise<Paginated<PullRequest>> {
    const paramas: Bitbucket.Params.PullrequestsList = {
      repo_slug: repo,
      username: owner,
    };
    const response = await this.client.pullrequests.list(paramas);
    const url = 'www.bitbucket.org';
    let data = <Required<Bitbucket.Schema.PaginatedPullrequests>>response.data

    const items = data.values.map((val) => ({
      user: {
        id: <string>val.author!.uuid,
        login: <string>val.author!.nickname,
        url:  <string>val.author!.links!.html!.href,
      },
      url: <string>val.links!.html!.href,
      body: <string>val.description,
      createdAt: <string>val.created_on,
      updatedAt: <string>val.updated_on,
      closedAt: null,
      mergedAt: null,
      state: <string>val.state,
      id: <number>val.id,
      base: {
        repo: {
          url: <string>val.destination!.repository!.links!.html!.href,
          name: <string>val.destination!.repository!.name,
          id: <string>val.destination!.repository!.uuid,
          owner: {
            login: <string>val.destination!.repository!.full_name!.split('/').shift(),
            id: (<string><unknown>this.client.users.get({ username: <string>val.destination!.repository!.full_name!.split('/').shift() })),
            url: url.concat(`/${val.destination!.repository!.full_name!.split('/').shift()}`)
          }     
        },
      },
    }));
    const pagination = this.getPagination(response.data);

    return { items, ...pagination };
  }

  async getPullRequest(owner: string, repo: string, prNumber: number) {
    const params = {
      pull_request_id: prNumber,
      repo_slug: repo,
      username: owner,
    };

    const response = await this.client.pullrequests.get(params);
    response.data;

    return {
      user: {
        id: response.data.author!.uuid,
        login: response.data.author!.nickname,
        url: response.data.author!.website,
      },
      url: response.data.links!.html!.href,
      body: response.data.summary!.raw,
      createdAt: <string>response.data.created_on,
      updatedAt: <string>response.data.updated_on,
      closedAt: <string>response.data.closed_by!.created_on,
      mergedAt: <string>response.data.merge_commit,
      state: response.data.state,
      id: response.data.id,
      base: {
        repo: {
          url: response.data.destination!.repository!.links!.html!.href,
          name: response.data.destination!.repository!.name,
          id: response.data.destination!.repository!.uuid,
          owner: {
            login: response.data.author!.nickname,
            id: response.data.author!.uuid,
            url: response.data.author!.links!.html!.href,
          },
        },
      },
    };
  }

  async getPullRequestFiles(owner: string, repo: string, prNumber: number): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async getPullCommits(owner: string, repo: string, prNumber: number) {
    const params: Bitbucket.Params.PullrequestsListCommits = {
      pull_request_id: prNumber.toString(),
      repo_slug: repo,
      username: owner,
    };
    const response = await this.client.pullrequests.listCommits(params);

    const items = response.data.values.map((val: any) => ({
      sha: val.sha,
      commit: {
        url: val.links.html.href,
        message: val.message,
        author: {
          name: val.author.raw,
          email: undefined,
          date: val.date,
        },
        tree: {
          sha: val.hash,
          url: val.links.html.href,
        },
        verified: undefined,
      },
    }));
    const pagination = this.getPagination(response.data);

    return { items, ...pagination };
  }

  async getIssues(owner: string, repo: string) {
    const params: Bitbucket.Params.IssueTrackerList = {
      repo_slug: repo,
      username: owner,
    };
    const response: Bitbucket.Response<Bitbucket.Schema.PaginatedIssues> = await this.client.issue_tracker.list(params);

    const values = response.data.values!.map((val) => ({
      user: {
        id: val.reporter!.uuid,
        login: val.reporter!.nickname,
        url: val.reporter!.links!.html!.href,
      },
      url: val.repository!.links!.html!.href,
      body: val.content!.raw,
      createdAt: val.created_on,
      updatedAt: val.updated_on,
      closedAt: undefined,
      state: val.state,
      id: val.repository!.uuid,
    }));
    const pagination = this.getPagination(response.data);

    const items = values ? values : [];

    return { items, ...pagination };
  }

  async getIssue(owner: string, repo: string, issueNumber: number) {
    const params: Bitbucket.Params.IssueTrackerGet = {
      issue_id: issueNumber.toString(),
      repo_slug: repo,
      username: owner,
    };
    const response = await this.client.issue_tracker.get(params);

    return {
      id: response.data.repository!.uuid,
      user: {
        login: response.data.reporter!.nickname,
        id: response.data.reporter!.uuid,
        url: response.data.reporter!.href,
      },
      url: response.data.links!.html!.href,
      body: response.data.content!.raw,
      createdAt: <string>response.data.created_on,
      updatedAt: <string>response.data.updated_on,
      closedAt: undefined,
      state: <string>response.data.state,
    };
  }

  async getIssueComments(owner: string, repo: string, issueNumber: number) {
    const params: Bitbucket.Params.IssueTrackerListComments = {
      issue_id: issueNumber.toString(),
      repo_slug: repo,
      username: owner,
    };
    const response: Bitbucket.Response<Bitbucket.Schema.PaginatedIssueComments> = await this.client.issue_tracker.listComments(params);

    let data = <Required<Bitbucket.Schema.PaginatedIssueComments>>response.data

    const items = data.values.map((val) => ({
      user: {
        id: val.user!.uuid,
        login: val.user!.nickname,
        url: val.user!.links!.html!.href,
      },
      url: val.links!.html!.href,
      body: val.content!.raw,
      createdAt: val.created_on,
      updatedAt: val.updated_on,
      authorAssociation: val.author_association,
      id: val.id,
    }));
    const pagination = this.getPagination(response.data);

    return { items, ...pagination };
  }

  private unwrap<T>(clientPromise: Promise<any>) {
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

  getPagination(data: any) {
    const hasNextPage = !!data.next;
    const hasPreviousPage = !!data.previous;
    const page = data.page;
    const perPage = data.values && data.values.length;
    const totalCount = data.values && data.values.length;

    return { totalCount, hasNextPage, hasPreviousPage, page, perPage };
  }
}
