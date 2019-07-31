/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { Repository } from '../../model';
import { GitHubClient } from './GitHubClient';
import { GitHubUrlParser } from './GitHubUrlParser';
import { isArray } from 'util';
import { injectable } from 'inversify';
import { ICache } from '../../scanner/cache/ICache';
import { ErrorFactory } from '../../lib/errors/ErrorFactory';
import { GitHubPullRequestState, GitHubFile, GitHubDir } from '../../services/git/IGitHubService';

@injectable()
export class Git {
  private repository: Repository;
  private gitHubClient: GitHubClient;
  private cache: ICache;

  constructor(repository: Repository, githubClient: GitHubClient, cache: ICache) {
    this.repository = repository;
    this.gitHubClient = githubClient;
    this.cache = cache;
  }

  //should be explicit-member-accessibility disabled? There is just a warning
  async listDirectory(path: string): Promise<(GitHubFile | GitHubDir)[]> {
    return this.cache.getOrSet(this.contentCacheKey(path), async () => {
      const params = GitHubUrlParser.getOwnerAndRepoName(this.repository.url);
      const result = await this.gitHubClient.getRepoContent(params.owner, params.repoName, path);
      if (isArray(result)) {
        return result;
      } else {
        throw ErrorFactory.newInternalError(`${path} is not a directory`);
      }
    });
  }

  async getFile(path: string) {
    return this.cache.getOrSet(this.contentCacheKey(path), async () => {
      const params = GitHubUrlParser.getOwnerAndRepoName(this.repository.url);
      const result = await this.gitHubClient.getRepoContent(params.owner, params.repoName, path);
      if (!isArray(result)) {
        return result;
      } else {
        throw ErrorFactory.newInternalError(`${path} is not a file`);
      }
    });
  }

  async getContributorCount(): Promise<number> {
    const params = GitHubUrlParser.getOwnerAndRepoName(this.repository.url);
    return this.gitHubClient.getContributors(params.owner, params.repoName).then((r) => r.data.length);
  }

  async getPullRequestCount(): Promise<number> {
    const params = GitHubUrlParser.getOwnerAndRepoName(this.repository.url);
    return this.gitHubClient.getPullRequests(params.owner, params.repoName, GitHubPullRequestState.all).then((r) => {
      if (!r) {
        throw ErrorFactory.newInternalError('Could not get pull requests');
      }
      return r.data.length;
    });
  }

  getTextFileContent(path: string): Promise<string> {
    return this.getFile(path).then((f) => {
      if (!f) {
        throw ErrorFactory.newInternalError(`Could not get content of ${path}`);
      }
      return Buffer.from(f.data, 'base64').toString('utf-8');
    });
  }

  private contentCacheKey(path: string): string {
    const params = GitHubUrlParser.getOwnerAndRepoName(this.repository.url);
    return `${params.owner}:${params.repoName}:content:${path}`;
  }
}
