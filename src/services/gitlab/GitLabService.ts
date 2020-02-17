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

const debug = Debug('cli:services:git:bitbucket-service');

@injectable()
//implements IVCSService
export class GitLabService {
  private readonly client: Gitlab;
  private cache: ICache;
  private callCount = 0;

  constructor(@inject(Types.ArgumentsProvider) argumentsProvider: ArgumentsProvider) {
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
    //: Promise<Paginated<PullRequest>>
  ) {
    const state = VCSServicesUtils.getGitLabPRState(options?.filter?.state);

    const response = await this.client.MergeRequests.all({
      page: options?.pagination?.page,
      per_page: options?.pagination?.perPage,
      projectId: `${owner}/${repo}`,
      state,
    });

    console.log(response);
    return;
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
