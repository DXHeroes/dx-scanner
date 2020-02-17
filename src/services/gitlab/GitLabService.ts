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
import { Sudo } from 'gitlab/dist/types/core/infrastructure';
import { ListGetterOptions, PullRequestState, Paginated } from '../../inspectors';
import { PullRequest } from '../git/model';
import { VCSServicesUtils } from '../git/VCSServicesUtils';
import _ from 'lodash';

const debug = Debug('cli:services:git:bitbucket-service');

@injectable()
//implements IVCSService
export class GitLabService {
  private readonly client: Gitlab;
  private cache: ICache;
  private callCount = 0;
  private readonly argumentsProvider: ArgumentsProvider;

  constructor(@inject(Types.ArgumentsProvider) argumentsProvider: ArgumentsProvider) {
    this.argumentsProvider = argumentsProvider;
    const parsedUrl = GitServiceUtils.parseGitlabUrl(argumentsProvider.uri);

    this.cache = new InMemoryCache();

    this.client = new Gitlab({
      token: argumentsProvider.auth,
      host: parsedUrl.host || 'https://gitlab.com',
    });
  }

  purgeCache() {
    this.cache.purge();
  }

  getRepo(owner: string, repo: string) {
    return this.client.Projects.show(`${owner}/${repo}`);
  }

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
          id: val.id, //iid?
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

  getPagination(pagination: any) {
    const hasNextPage = pagination.next;
    const hasPreviousPage = pagination.previous;
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
