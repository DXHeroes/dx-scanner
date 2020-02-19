/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/camelcase */
import { Response } from 'bitbucket/src/request/types';
import Debug from 'debug';
import { Gitlab } from 'gitlab';
import { inject, injectable } from 'inversify';
import { inspect } from 'util';
import { ArgumentsProvider } from '../../scanner';
import { InMemoryCache } from '../../scanner/cache';
import { ICache } from '../../scanner/cache/ICache';
import { Types } from '../../types';
import { GitServiceUtils } from '../git/GitServiceUtils';
import { ListGetterOptions, PullRequestState, Paginated } from '../../inspectors';
import { PullRequest, PullCommits, PullFiles } from '../git/model';
import { VCSServicesUtils } from '../git/VCSServicesUtils';
import _ from 'lodash';
import { GitLabConstructor } from './gitlabClient/GitLabClient';
import { GitLabClient } from '../gitlab/gitlabClient/GitLabClient';
import { ThinPullRequestsPractice } from '../../practices/LanguageIndependent/ThinPullRequestsPractice';
import { parse } from 'path';
import util from 'util';
import { PaginationGitLabCustomResponse } from './gitlabClient/Utils';
const debug = Debug('cli:services:git:bitbucket-service');

@injectable()
//implements IVCSService
export class GitLabService {
  private readonly customClient: GitLabClient;
  private readonly client: Gitlab;
  private cache: ICache;
  private callCount = 0;
  private readonly argumentsProvider: ArgumentsProvider;
  private readonly host: string;

  constructor(@inject(Types.ArgumentsProvider) argumentsProvider: ArgumentsProvider) {
    this.argumentsProvider = argumentsProvider;
    const parsedUrl = GitServiceUtils.parseGitlabUrl(argumentsProvider.uri);
    this.host = parsedUrl.host || 'https://gitlab.com';

    this.cache = new InMemoryCache();

    this.client = new Gitlab({
      token: argumentsProvider.auth,
      host: this.host,
    });

    this.customClient = new GitLabClient({
      token: argumentsProvider.auth,
      host: this.host,
    });
  }

  purgeCache() {
    this.cache.purge();
  }

  getRepo(owner: string, repo: string) {
    return this.client.Projects.show(`${owner}/${repo}`);
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

    const parsedUrl = GitServiceUtils.parseGitlabUrl(this.argumentsProvider.uri);
    const repoUrl = `${parsedUrl.host}/${owner}/${repo}`;
    let ownerInfo = (<any>await this.client.Users.all({ username: owner }))[0];
    if (!ownerInfo) {
      ownerInfo = <any>await this.client.Groups.show(owner);
    }

    const items = <PullRequest[]>await Promise.all(
      data.map((val: any) => {
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
          //const lines = await this.getPullsDiffStat(owner, repo, val.number);
          //return { ...pullRequest, lines };
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
    //TODO - to function
    const parsedUrl = GitServiceUtils.parseGitlabUrl(this.argumentsProvider.uri);

    const repoUrl = `${parsedUrl.host}/${owner}/${repo}`;
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
          url: repoUrl,
          name: repo,
          id: response.project_id,
          owner: {
            url: `${parsedUrl.host}/${owner}`,
            id: ownerInfo.id,
            login: ownerInfo.username,
          },
        },
      },
    };

    //TODO add withDiffStat()
    // // Get number of changes, additions and deletions in PullRequest if the withDiffStat is true
    // if (withDiffStat) {
    //     const lines = await this.getPullsDiffStat(owner, repo, prNumber);
    //     return { ...pullRequest, lines };
    //   }
    return pullRequest;
  }

  async listPullRequestFiles(owner: string, repo: string, prNumber: number): Promise<Paginated<PullFiles>> {
    throw new Error('Method not implemented yet.');
  }

  async listPullCommits(owner: string, repo: string, prNumber: number, options?: ListGetterOptions): Promise<Paginated<PullCommits>> {
    const { data, pagination } = await this.customClient.MergeRequests.commits(`${owner}/${repo}`, prNumber, options?.pagination);

    const items = <PullCommits[]>await Promise.all(
      data.map(async (val: any) => {
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
              date: val.created_at,
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

  //TODO interface for pagination
  getPagination(pagination: PaginationGitLabCustomResponse) {
    const hasNextPage = !!pagination.next;
    const hasPreviousPage = !!pagination.previous;
    const page = pagination.current;
    const perPage = pagination.perPage;

    return { totalCount: pagination.total, hasNextPage, hasPreviousPage, page, perPage };
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
