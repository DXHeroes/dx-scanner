import fs from 'fs';
import * as nodePath from 'path';
import { ErrorFactory } from '../lib/errors/ErrorFactory';
import { injectable } from 'inversify';
import { IProjectFilesBrowserService, Metadata, MetadataType } from './model';

@injectable()
export class FileSystemService implements IProjectFilesBrowserService {
  async exists(path: string) {
    try {
      await fs.promises.lstat(path);
      return true;
    } catch (error) {
      return false;
    }
  }

  async readDirectory(path: string) {
    return fs.promises.readdir(path);
  }

  readFile(path: string) {
    return fs.promises.readFile(path, 'utf-8');
  }

  writeFile(path: string, content: string) {
    return fs.promises.writeFile(path, content);
  }

  async createDirectory(path: string) {
    if (!(await this.isDirectory(nodePath.dirname(path)))) {
      throw ErrorFactory.newArgumentError('No such directory');
    }

    return fs.promises.mkdir(path);
  }

  async deleteDirectory(path: string) {
    const exists = await this.exists(path);
    if (!exists || (exists && !(await this.isDirectory(path)))) {
      throw ErrorFactory.newArgumentError('No such directory');
    }

    return fs.promises.rmdir(path);
  }

  async createFile(path: string, data: string) {
    if (!(await this.isDirectory(nodePath.dirname(path)))) {
      throw ErrorFactory.newArgumentError('No such directory');
    }

    //append data to a file, creating the file if it does not yet exist
    return fs.promises.appendFile(path, data);
  }

  deleteFile(path: string) {
    return fs.promises.unlink(path);
  }

  async isFile(path: string) {
    const stats = await fs.promises.lstat(path);
    return stats.isFile();
  }

  async isDirectory(path: string) {
    const stats = await fs.promises.lstat(path);
    return stats.isDirectory();
  }

  async getMetadata(path: string): Promise<Metadata> {
    if (!(await this.exists(path))) {
      throw ErrorFactory.newInternalError(`File doesn't exist (${path})`);
    }

    const extension = nodePath.extname(path);
    const stats = await fs.promises.lstat(path);

    const metadata: Omit<Metadata, 'type'> = {
      path,
      name: nodePath.basename(path),
      baseName: nodePath.basename(path, extension),
      extension: extension === '' ? undefined : extension,
      //return size in bytes
      size: stats.size,
    };

    if (await this.isDirectory(path)) {
      return {
        ...metadata,
        extension: undefined,
        type: MetadataType.dir,
      };
    }

    return {
      ...metadata,
      type: MetadataType.file,
    };
  }

  async flatTraverse(path: string, fn: (meta: Metadata) => void | boolean) {
    const dirContent = await fs.promises.readdir(path);
    for (const cnt of dirContent) {
      const absolutePath = nodePath.resolve(path, cnt);
      const metadata = await this.getMetadata(absolutePath);

      const lambdaResult = fn(metadata);
      if (lambdaResult === false) return false;

      if (metadata.type === MetadataType.dir) {
        await this.flatTraverse(metadata.path, fn);
      }
    }
  }
}
