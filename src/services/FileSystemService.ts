import fs from 'fs';
import * as nodePath from 'path';
import { injectable } from 'inversify';
import { IProjectFilesBrowserService, Metadata, MetadataType } from './model';
import { IFs, createFsFromVolume } from 'memfs';
import { Volume as VSVolume, DirectoryJSON } from 'memfs/lib/volume';
import { ErrorFactory } from '../lib/errors';

/**
 * Service for file system browsing
 *  - uses fs by default
 *  - can work just in memory with memfs
 */
@injectable()
export class FileSystemService implements IProjectFilesBrowserService {
  protected fileSystem: IFs | (typeof fs);
  private virtualVolume: VSVolume | undefined;

  constructor({ isVirtual = false } = {}) {
    if (!isVirtual) {
      this.fileSystem = fs;
      this.virtualVolume = undefined;
    } else {
      this.virtualVolume = new VSVolume();
      this.fileSystem = createFsFromVolume(this.virtualVolume);
    }
  }

  setFileSystem(structure: DirectoryJSON) {
    if (!this.virtualVolume) throw ErrorFactory.newInternalError('No virtual volume set');
    this.clearFileSystem();
    this.virtualVolume.fromJSON(structure);
  }

  clearFileSystem() {
    if (!this.virtualVolume) throw ErrorFactory.newInternalError('No virtual volume set');
    this.virtualVolume.reset();
  }

  async exists(path: string) {
    try {
      await this.fileSystem.promises.lstat(path);
      return true;
    } catch (error) {
      return false;
    }
  }

  readDirectory(path: string) {
    // <typeof fs> is small hack because TS thinks
    //   that it's different interface by default
    return (<typeof fs>this.fileSystem).promises.readdir(path);
  }

  readFile(path: string) {
    return <Promise<string>>this.fileSystem.promises.readFile(path, 'utf-8');
  }

  writeFile(path: string, content: string) {
    return this.fileSystem.promises.writeFile(path, content);
  }

  createDirectory(path: string) {
    return this.fileSystem.promises.mkdir(path);
  }

  deleteDirectory(path: string) {
    return this.fileSystem.promises.rmdir(path);
  }

  createFile(path: string, data: string) {
    return this.fileSystem.promises.appendFile(path, data);
  }

  deleteFile(path: string) {
    return this.fileSystem.promises.unlink(path);
  }

  async isFile(path: string) {
    const stats = await this.fileSystem.promises.lstat(path);
    return stats.isFile();
  }

  async isDirectory(path: string) {
    const stats = await this.fileSystem.promises.lstat(path);
    return stats.isDirectory();
  }

  async getMetadata(path: string): Promise<Metadata> {
    const extension = nodePath.extname(path);
    const stats = await this.fileSystem.promises.lstat(path);

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
    // <typeof fs> is small hack because TS thinks
    //   that it's different interface by default
    const dirContent = await (<typeof fs>this.fileSystem).promises.readdir(path);
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
