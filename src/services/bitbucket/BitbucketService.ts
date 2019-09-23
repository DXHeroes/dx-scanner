/* eslint-disable @typescript-eslint/camelcase */
import { injectable, inject } from 'inversify';
// import {
//   PullRequest,
//   Contributor,
//   PullRequestReview,
//   Commit,
//   ContributorStats,
//   Directory,
//   File,
//   Issue,
//   PullFiles,
//   PullCommits,
//   IssueComment,
//   Symlink,
// } from './model';
import { Paginated } from '../../inspectors/common/Paginated';
import {
  IssuesListForRepoResponseItem,
  PullsListResponseItem,
  PullsListReviewsResponseItem,
  ReposGetContributorsStatsResponseItem,
} from '@octokit/rest';
import { isArray } from 'util';
import { ListGetterOptions } from '../../inspectors/common/ListGetterOptions';
import Octokit from '@octokit/rest';
import { grey } from 'colors';
import { inspect } from 'util';
import Debug from 'debug';
import { delay } from '../../lib/delay';
import { Types } from '../../types';
import { ArgumentsProvider } from '../../inversify.config';
import { ICache } from '../../scanner/cache/ICache';
import { InMemoryCache } from '../../scanner/cache/InMemoryCahce';
import Bitbucket from 'bitbucket';
const debug = Debug('cli:services:git:github-service');

// implements IBitbucketService
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

  async getPullRequests(owner: string, repo: string) {
    const paramas: Bitbucket.Params.PullrequestsList = {
      repo_slug: repo,
      username: owner,
    };
    const response = await this.client.pullrequests.list(paramas);
    return response;
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
}
