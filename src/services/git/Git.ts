import { Repository } from '../../model';
import { GitHubClient } from './GitHubClient';
import { GitHubUrlParser } from './GitHubUrlParser';
import { isArray } from 'util';
import { injectable } from 'inversify';
import { ICache } from '../../scanner/cache/ICache';
import { ErrorFactory } from '../../lib/errors/ErrorFactory';
import { GitHubPullRequestState, GitHubFile, GitHubDir } from '../../services/git/IGitHubService';
import * as nodePath from 'path';
import { Metadata, MetadataType, IProjectFilesBrowserService } from '../model';

@injectable()
export class Git implements IProjectFilesBrowserService {
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

  async readDirectory(path: string): Promise<string[]> {
    const result = await this.getRepoContent(await this.followSymLinks(path));
    if (result !== null && isArray(result)) {
      return result.map((item: GitHubFile | GitHubDir) => item.name);
    } else {
      throw ErrorFactory.newInternalError(`${path} is not a directory`);
    }
  }

  async readFile(path: string): Promise<string> {
    const result = await this.getRepoContent(await this.followSymLinks(path));
    if (result !== null && !isArray(result)) {
      return Buffer.from(result.content, result.encoding).toString('utf-8');
    } else {
      throw ErrorFactory.newInternalError(`${path} is not a file`);
    }
  }

  async isFile(path: string): Promise<boolean> {
    const result = await this.getRepoContent(await this.followSymLinks(path));
    if (result === null) {
      throw ErrorFactory.newInternalError(`Could not get content of ${path}`);
    }
    return !isArray(result);
  }

  async isDirectory(path: string): Promise<boolean> {
    const result = await this.getRepoContent(await this.followSymLinks(path));
    if (result === null) {
      throw ErrorFactory.newInternalError(`Could not get content of ${path}`);
    }
    return isArray(result);
  }

  async getMetadata(path: string): Promise<Metadata> {
    let extension: string | undefined = nodePath.posix.extname(path);
    const result = await this.getRepoContent(await this.followSymLinks(path));

    const name = nodePath.posix.basename(path);
    const baseName = nodePath.posix.basename(path, extension);
    extension = extension === '' ? undefined : extension;

    if (result === null) {
      throw ErrorFactory.newInternalError(`Could not get content of ${path}`);
    }

    if (isArray(result)) {
      return {
        path,
        name,
        baseName,
        type: MetadataType.dir,
        size: 0,
        extension: undefined,
      };
    }

    return {
      path,
      name,
      baseName,
      type: MetadataType.file,
      size: result.size,
      extension,
    };
  }

  async flatTraverse(path: string, fn: (meta: Metadata) => void | boolean): Promise<void | boolean> {
    const dirContent = await this.readDirectory(path);
    for (const cnt of dirContent) {
      const absolutePath = nodePath.posix.join(path, cnt);
      const metadata = await this.getMetadata(absolutePath);

      const lambdaResult = fn(metadata);
      if (lambdaResult === false) return false;

      if (metadata.type === MetadataType.dir) {
        await this.flatTraverse(metadata.path, fn);
      }
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

  private getRepoContent(path: string) {
    const params = GitHubUrlParser.getOwnerAndRepoName(this.repository.url);
    const key = `${params.owner}:${params.repoName}:content:${path}`;

    return this.cache.getOrSet(key, async () => {
      try {
        const result = await this.gitHubClient.getRepoContent(params.owner, params.repoName, path);
        return result.data;
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
      if (isArray(child)) {
        if (path.length !== 0) {
          path = await this.followSymLinks(path, nodePath.posix.join(directory, name));
        }
      } else {
        switch (child.type) {
          case 'file':
            break;
          case 'symlink':
            path = await this.followSymLinks(nodePath.posix.join(child.target, path), directory);
            name = '';
            break;
        }
      }
    }
    return nodePath.join(name, path);
  }
}
