import { IProjectFilesBrowserService, Metadata, MetadataType } from './model';
import { injectable } from 'inversify';
import { Omit } from 'lodash';
import * as nodePath from 'path';
import { fs as vfs, vol } from 'memfs';
import { DirectoryJSON } from 'memfs/lib/volume';

@injectable()
export class VirtualFileSystemService implements IProjectFilesBrowserService {
  setFileSystem(structure: DirectoryJSON) {
    this.clearFileSystem();
    vol.fromJSON(structure);
  }

  clearFileSystem() {
    vol.reset();
  }

  async exists(path: string) {
    try {
      await vfs.promises.lstat(path);
      return true;
    } catch (error) {
      return false;
    }
  }

  async readDirectory(path: string) {
    return <Promise<string[]>>vfs.promises.readdir(path);
  }

  async readFile(path: string) {
    return <Promise<string>>vfs.promises.readFile(path, 'utf-8');
  }

  async writeFile(path: string, content: string) {
    return vfs.promises.writeFile(path, content);
  }

  async createDirectory(path: string) {
    return vfs.promises.mkdir(path);
  }

  async deleteDirectory(path: string) {
    return vfs.promises.rmdir(path);
  }

  async createFile(path: string, data: string) {
    return vfs.promises.appendFile(path, data);
  }

  async deleteFile(path: string) {
    return vfs.promises.unlink(path);
  }

  async isFile(path: string) {
    const stats = await vfs.promises.lstat(path);
    return stats.isFile();
  }

  async isDirectory(path: string) {
    const stats = await vfs.promises.lstat(path);
    return stats.isDirectory();
  }

  async getMetadata(path: string): Promise<Metadata> {
    const extension = nodePath.extname(path);
    const stats = await vfs.promises.lstat(path);

    const metadata: Omit<Metadata, 'type'> = {
      path,
      name: nodePath.basename(path),
      baseName: nodePath.basename(path, extension),
      extension: extension === '' ? undefined : extension,
      //return size in bytes
      size: <number>stats.size,
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
    const dirContent = await vfs.promises.readdir(path);
    for (const cnt of dirContent) {
      const absolutePath = nodePath.resolve(path, <string>cnt);
      const metadata = await this.getMetadata(absolutePath);

      const lambdaResult = fn(metadata);
      if (lambdaResult === false) return false;

      if (metadata.type === MetadataType.dir) {
        await this.flatTraverse(metadata.path, fn);
      }
    }
  }
}
