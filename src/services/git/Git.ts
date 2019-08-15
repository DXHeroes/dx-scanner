import { Repository } from '../../model';
import { GitHubClient } from './GitHubClient';
import { GitHubUrlParser } from './GitHubUrlParser';
import { isArray } from 'util';
import { injectable } from 'inversify';
import { ICache } from '../../scanner/cache/ICache';
import { ErrorFactory } from '../../lib/errors/ErrorFactory';
import { GitHubPullRequestState, GitHubFile, GitHubDir } from '../../services/git/IGitHubService';
import * as nodePath from 'path';

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

  async exists(path: string): Promise<boolean> {
    const result = await this.getRepoContent(await this.followSymLinks(path));
    return result !== null;
  }

  async listDirectory(path: string): Promise<(GitHubFile | GitHubDir)[]> {
    const result = await this.getRepoContent(path);
    if (result !== null && isArray(result.data)) {
      return result.data;
    } else {
      throw ErrorFactory.newInternalError(`${path} is not a directory`);
    }
  }

  async getFile(path: string) {
    const result = await this.getRepoContent(path);
    if (result !== null && !isArray(result.data)) {
      return result.data;
    } else {
      throw ErrorFactory.newInternalError(`${path} is not a file`);
    }
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

  private getRepoContent(path: string) {
    const params = GitHubUrlParser.getOwnerAndRepoName(this.repository.url);
    const key = `${params.owner}:${params.repoName}:content:${path}`;

    return this.cache.getOrSet(key, async () => {
      try {
        return await this.gitHubClient.getRepoContent(params.owner, params.repoName, path);
      } catch (e) {
        if (e.name !== 'HttpError' || e.status !== 404) {
          throw e;
        }

        return null;
      }
    });
  }

  private async followSymLinks(path: string, directory?: string): Promise<string> {
    directory = directory !== undefined ? directory : '';

    let name: string;
    path = nodePath.posix.normalize(path);
    // In case of an absolute path, name should be the root including the path separator
    name = nodePath.posix.isAbsolute(path) ? nodePath.posix.parse(path).root : path.split(nodePath.posix.sep)[0];
    path = nodePath.posix.relative(name, path);
    const child = await this.getRepoContent(nodePath.posix.join(directory, name));

    if (child !== null) {
      if (isArray(child.data)) {
        if (path.length !== 0) {
          path = await this.followSymLinks(path, nodePath.posix.join(directory, name));
        }
      } else {
        switch (child.data.type) {
          case 'file':
            break;
          case 'symlink':
            path = await this.followSymLinks(nodePath.posix.join(child.data.target, path), directory);
            name = '';
            break;
        }
      }
    }
    return nodePath.join(name, path);
  }
}
