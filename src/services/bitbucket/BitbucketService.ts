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
import { PullRequest } from '../git/model';
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
    if (response.data.values !== undefined) {
      const values: PullsListResponseItem[] = response.data && <PullsListResponseItem[]>(<unknown>response.data.values);
    }

    console.log(response, 'response 61');
    const values =
      response.data.values &&
      response.data.values.map((val) => ({
        user: {
          id: val.author && val.author.uuid, //
          login: val.author && val.author.nickname, //
          url: val.author && val.author.links && val.author.links.html && val.author.links.html.href, //
        },
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        url: val.destination!.repository!.links!.html!.href, //
        body: val.description, //
        createdAt: val.created_on, //
        updatedAt: val.updated_on, //
        closedAt: val.closed_by, //
        mergedAt: val.merge_commit, //
        state: <string>val.state, //
        id: val.id, //
        // base: {
        //   repo: {
        //     url: val.base.repo.url,
        //     name: val.base.repo.name,
        //     id: val.base.repo.id,
        //     owner: val.base.repo.owner,
        //   },
        // },
      }));

    const pagination = {
      hasNextPage: response.data.next ? true : false,
      hasPreviousPage: response.data.previous ? true : false,
      page: response.data.page,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      perPage: response.data.values!.length,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      totalCount: response.data.values!.length,
    };
    const items = values ? values : [];

    // const pagination = this.getPagination(response.length);

    return { items, pagination };
  }

  async getPullRequest(owner: string, repo: string, prNumber: number) {
    const params = {
      pull_request_id: prNumber,
      repo_slug: repo,
      username: owner,
    };

    const response = await this.client.pullrequests.get(params);
    return response;
  }

  async getPullRequestFiles(owner: string, repo: string, prNumber: number) {
    throw new Error('Method not implemented.');
  }

  async getPullCommits(owner: string, repo: string, prNumber: number) {
    const params: Bitbucket.Params.PullrequestsListCommits = {
      pull_request_id: prNumber.toString(),
      repo_slug: repo,
      username: owner,
    };
    const response = await this.client.pullrequests.listCommits(params);
    return response;
  }

  async getIssues(owner: string, repo: string) {
    const params: Bitbucket.Params.IssueTrackerList = {
      repo_slug: repo,
      username: owner,
    };
    const response = this.client.issue_tracker.list(params);
    return response;
  }

  async getIssue(owner: string, repo: string, issueNumber: number) {
    const params: Bitbucket.Params.IssueTrackerGet = {
      issue_id: issueNumber.toString(),
      repo_slug: repo,
      username: owner,
    };
    const response = this.client.issue_tracker.get(params);
    return response;
  }

  async getIssueComments(owner: string, repo: string, issueNumber: number) {
    const params: Bitbucket.Params.IssueTrackerListComments = {
      issue_id: issueNumber.toString(),
      repo_slug: repo,
      username: owner,
    };
    const response = this.client.issue_tracker.listComments(params);
    return response;
  }
  //: Promise<Octokit.Response<T>>
  //:Promise<Octokit.Response<T>>
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

  // getPagination(totalCount: number) {
  //   const hasNextPage = false;
  //   const hasPreviousPage = false;
  //   const page = 1;
  //   const perPage = totalCount;

  //   return { totalCount, hasNextPage, hasPreviousPage, page, perPage };
  // }
}
