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

    // const clientOptions = {
    //   baseUrl: 'https://api.bitbucket.org/2.0',
    //   headers: {},
    //   options: {
    //     timeout: 10,
    //   },
    // };

    this.client = new Bitbucket();

    let auth: Bitbucket.Auth;
    if (argumentsProvider.auth) {
      auth = { type: 'token', token: argumentsProvider.auth };
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

    const values =
      response.data.values &&
      response.data.values.map((val: any) => ({
        user: {
          id: val.author && val.author.uuid,
          login: val.author && val.author.nickname,
          url: val.author && val.author.links && val.author.links.html && val.author.links.html.href,
        },
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        url: val.links!.html!.href!.html,
        body: val.description,
        createdAt: val.created_on,
        updatedAt: val.updated_on,
        closedAt: val.closed_by,
        mergedAt: val.merge_commit,
        state: <string>val.state,
        id: val.id,
        base: {
          repo: {
            url: val.destination.repository.links.html.href,
            name: val.destination.repository.name,
            id: val.destination.repository.uuid,
            owner: val.destination.repository.fullname.split('/').shift(),
          },
        },
      }));
    const pagination = this.getPagination(response.data);

    const items = values ? values : [];

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
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        id: response.data.author!.uuid,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        login: response.data.author!.nickname,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        url: response.data.author!.website,
      },
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      url: response.data.links!.html!.href,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      body: response.data.summary!.raw,
      createdAt: <string>response.data.created_on,
      updatedAt: <string>response.data.updated_on,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      closedAt: <string>response.data.closed_by!.created_on,
      mergedAt: <string>response.data.merge_commit,
      state: response.data.state,
      id: response.data.id,
      base: {
        repo: {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          url: response.data.destination!.repository!.links!.html!.href,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          name: response.data.destination!.repository!.name,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          id: response.data.destination!.repository!.uuid,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          owner: {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            login: response.data.author!.nickname,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            id: response.data.author!.uuid,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            url: response.data.author!.links!.html!.href,
          },
        },
      },
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getPullRequestFiles(owner: string, repo: string, prNumber: number): Promise<any> {
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
    const response = await this.client.issue_tracker.list(params);

    const values =
      response.data.values &&
      response.data.values.map((val: any) => ({
        user: {
          id: val.reporter.uuid,
          login: val.reporter.nickname,
          url: val.reporter.links.html.href,
        },
        url: val.repository.links.html.href,
        body: val.content.raw,
        createdAt: val.created_on,
        updatedAt: val.updated_on,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        closedAt: undefined,
        state: val.state,
        id: val.repository.uuid,
        // pullRequestUrl: val.pull_request && val.pull_request.url,
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
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      id: response.data.repository!.uuid,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      user: {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        login: response.data.reporter!.nickname,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        id: response.data.reporter!.uuid,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        url: response.data.reporter!.href,
      },
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      url: response.data.links!.html!.href,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      body: response.data.content!.raw,
      createdAt: <string>response.data.created_on,
      updatedAt: <string>response.data.updated_on,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
    const response = await this.client.issue_tracker.listComments(params);

    const items =
      response.data.values &&
      response.data.values.map((val) => ({
        user: {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          id: val.user!.uuid,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          login: val.user!.nickname,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
  //: Promise<Octokit.Response<T>>
  private unwrap<T>(clientPromise: Promise<Bitbucket.Response<Bitbucket.Schema.Repository>>) {
    return clientPromise
      .then((response) => {
        this.debugBitbucketResponse(response);
        return response;
      })
      .catch((error: { response: { status: any; data: any } }) => {
        if (error.response) {
          debug(`${error.response.status} => ${inspect(error.response.data)}`);
        } else {
          debug(inspect(error));
        }
        throw error;
      });
  }

  //: Octokit.Response<T>
  private debugBitbucketResponse = <T>(response: any) => {
    this.callCount++;
    debug(
      grey(`Bitbucket API Hit: ${this.callCount}. Remaining ${response.headers['x-ratelimit-remaining']} hits. (${response.headers.link})`),
    );
  };

  getPagination(data: any) {
    const hasNextPage = !!data.next;
    const hasPreviousPage = !!data.previous;
    const page = data.page;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const perPage = data.values!.length;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const totalCount = data.values!.length;

    return { totalCount, hasNextPage, hasPreviousPage, page, perPage };
  }
}
