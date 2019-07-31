import fs from 'fs';
import * as nodePath from 'path';
import { ErrorFactory } from '../lib/errors/ErrorFactory';
import { injectable } from 'inversify';
import { IProjectFilesBrowserService, Metadata, MetadataType } from './model';

@injectable()
export class FileSystemService implements IProjectFilesBrowserService {
  async exists(path: string) {
    try {
      await fs.promises.access(path, fs.constants.F_OK);
      return true;
    } catch (error) {
      return false;
    }
  }

  readDirectory(path: string) {
    return fs.promises.readdir(path);
  }

  readFile(path: string) {
    return fs.promises.readFile(path, 'utf-8');
  }

  writeFile(path: string, content: string) {
    return fs.promises.writeFile(path, content);
  }

  createDirectory(path: string) {
    return fs.promises.mkdir(path);
  }

  deleteDirectory(path: string) {
    return fs.promises.rmdir(path);
  }

  createFile(path: string, data: string) {
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

  async isSymbolicLink(path: string) {
    const stats = await fs.promises.lstat(path);
    return stats.isSymbolicLink();
  }

  async getMetadata(path: string): Promise<Metadata> {
    if (!this.exists(path)) {
      throw ErrorFactory.newInternalError("File doesn't exist");
    }

    const extension = nodePath.posix.extname(path);
    const stats = await fs.promises.lstat(path);

    const metadata: Omit<Metadata, 'type'> = {
      path,
      name: nodePath.posix.basename(path),
      baseName: nodePath.posix.basename(path, extension),
      extension: extension === '' ? undefined : extension,
      //return size in bytes
      size: stats.size,
    };

    if (await this.isFile(path)) {
      return {
        ...metadata,
        type: MetadataType.file,
      };
    } else if (await this.isDirectory(path)) {
      return {
        ...metadata,
        extension: undefined,
        type: MetadataType.dir,
      };
    } else if (await this.isSymbolicLink(path)) {
      return {
        ...metadata,
        type: MetadataType.symlink,
      };
    }

    throw ErrorFactory.newInternalError("It's not file, dir nor symlink");
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
