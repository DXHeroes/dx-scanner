import { inject, injectable } from 'inversify';
import * as nodePath from 'path';
import { isArray } from 'util';
import { PullRequestState } from '../../inspectors/ICollaborationInspector';
import { ErrorFactory } from '../../lib/errors/ErrorFactory';
import { Repository, VCSService } from '../../model';
import { Types } from '../../types';
import { IProjectFilesBrowserService, Metadata, MetadataType } from '../model';
import { GitServiceUtils } from './GitServiceUtils';
import { Directory, File, Symlink } from './model';

@injectable()
export class Git implements IProjectFilesBrowserService {
  private repository: Repository;
  private service: VCSService;

  constructor(repository: Repository, @inject(Types.IContentRepositoryBrowser) service: VCSService) {
    this.repository = repository;
    this.service = service;
  }

  async exists(path: string): Promise<boolean> {
    const result = await this.getRepoContent(await this.followSymLinks(path));
    return result !== null;
  }

  async readDirectory(path: string): Promise<string[]> {
    const result = await this.getRepoContent(await this.followSymLinks(path));
    if (result !== null && isArray(result)) {
      return result.map((item) => item.name);
    } else {
      throw ErrorFactory.newInternalError(`${path} is not a directory`);
    }
  }

  async readFile(path: string): Promise<string> {
    let result = await this.getRepoContent(await this.followSymLinks(path));
    if (result !== null && !isArray(result)) {
      result = result as File;
      if (!result.content) return '';
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
    const params = GitServiceUtils.getOwnerAndRepoName(this.repository.url);
    return this.service.getContributors(params.owner, params.repoName).then((r) => r.totalCount);
  }

  async getPullRequestCount(): Promise<number> {
    const params = GitServiceUtils.getOwnerAndRepoName(this.repository.url);
    return this.service.getPullRequests(params.owner, params.repoName, { filter: { state: PullRequestState.all } }).then((r) => {
      if (!r) {
        throw ErrorFactory.newInternalError('Could not get pull requests');
      }
      return r.totalCount;
    });
  }

  private getRepoContent(path: string): Promise<File | Symlink | Directory | null> {
    const params = GitServiceUtils.getOwnerAndRepoName(this.repository.url);
    return this.service.getRepoContent(params.owner, params.repoName, path);
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
    return nodePath.posix.join(name, path);
  }
}
