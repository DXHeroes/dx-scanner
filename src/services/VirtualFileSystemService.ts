import { IProjectFilesBrowserService, Metadata, MetadataType } from './model';
import { VirtualDirectory, VirtualFileSystemEntry } from './IVirtualFileSystemService';
import * as _ from 'lodash';
import { injectable } from 'inversify';
import { ErrorFactory } from '../lib/errors';
import { Omit } from 'lodash';
import * as nodePath from 'path';

@injectable()
export class VirtualFileSystemService implements IProjectFilesBrowserService {
  private structure: VirtualDirectory | undefined;

  constructor() {
    this.structure = undefined;
  }

  setFileSystem(structure: VirtualDirectory) {
    this.structure = structure;
  }

  clearFileSystem() {
    this.structure = undefined;
  }

  private pathAsStructureArray(path: string): string[] {
    // because of windows separator
    path = path.replace("\\", "")

    path = nodePath.posix.resolve(path);

    let pathAsArray = [];
    const root = nodePath.posix.parse(path).root;

    while (path !== root) {
      pathAsArray.unshift('children', nodePath.posix.basename(path));
      path = nodePath.posix.dirname(path);
    }

    // Append the non-Posix root
    if (root !== nodePath.posix.sep) {
      pathAsArray.unshift('children', root);
    }
    return pathAsArray;
  }

  private findEntry(path: string): VirtualFileSystemEntry {
    if (this.structure === undefined) {
      throw ErrorFactory.newInternalError('structure is undefined');
    }

    path = nodePath.posix.normalize(nodePath.posix.sep + path);
    const structurePath = this.pathAsStructureArray(path);

    if (structurePath.length === 0) {
      return this.structure;
    }
    return _.get(this.structure, structurePath);
  }

  private setEntry(path: string, entry: VirtualFileSystemEntry) {
    if (this.structure === undefined) {
      throw ErrorFactory.newInternalError('structure is undefined');
    }

    path = nodePath.posix.resolve(path);
    // Throws an error if the parent is not a directory
    this.findParentEntry(path);

    this.structure = _.set(this.structure, this.pathAsStructureArray(path), entry);
  }

  private unsetEntry(path: string) {
    const parentEntry = this.findParentEntry(path);
    const name = nodePath.posix.basename(path);
    if (name === undefined) {
      throw ErrorFactory.newInternalError('no such file or directory');
    }
    delete parentEntry.children[name];
  }

  private findEntryNoFollow(path: string): VirtualFileSystemEntry | undefined {
    path = path.replace("\\", "\/")
    path = nodePath.posix.normalize(path)

    const parentEntry = this.findParentEntry(path);
    const name = nodePath.posix.basename(path);
    if (name === undefined) {
      throw ErrorFactory.newInternalError('no such file or directory');
    }
    return parentEntry.children[name];
  }

  private findParentEntry(path: string): VirtualDirectory {
    if (this.structure === undefined) {
      throw ErrorFactory.newInternalError('structure is undefined');
    }

    console.log("pathpath", path)

    const dirName = nodePath.posix.dirname(path);
    console.log("dirName", dirName)


    if (dirName === path) {
      return this.structure;
    }

    const entry = this.findEntry(dirName);
    if (entry === undefined || entry.type !== MetadataType.dir) {
      throw ErrorFactory.newInternalError('is not a directory');
    }
    return entry;
  }

  async exists(path: string) {
    const entry = this.findEntry(path);
    return entry !== undefined ? true : false;
  }

  async readDirectory(path: string) {
    const entry = this.findEntry(path);
    if (entry === undefined) {
      throw ErrorFactory.newInternalError('No such file or directory');
    }
    if (entry.type !== MetadataType.dir) {
      throw ErrorFactory.newInternalError('Is not a directory');
    }

    return _.keys(entry.children);
  }

  async readFile(path: string) {
    const entry = this.findEntry(path);
    if (entry === undefined) {
      throw ErrorFactory.newInternalError('No such file or directory');
    }
    if (entry.type !== MetadataType.file) {
      throw ErrorFactory.newInternalError('Is not a file');
    }

    return entry.data;
  }

  async writeFile(path: string, content: string) {
    let entry = this.findEntry(path);
    if (entry !== undefined && entry.type !== MetadataType.file) {
      throw ErrorFactory.newInternalError('is not a file');
    }
    this.setEntry(path, { type: MetadataType.file, data: content });
  }

  async createDirectory(path: string) {
    if (this.findEntryNoFollow(path) !== undefined) {
      throw ErrorFactory.newInternalError('Dir already exists');
    }
    this.setEntry(path, { type: MetadataType.dir, children: {} });
  }

  async deleteDirectory(path: string) {
    if (await this.isDirectory(path)) {
      this.unsetEntry(path);
    } else {
      throw ErrorFactory.newInternalError('Is not a directory');
    }
  }

  async createFile(path: string, data: string) {
    let originalData: string;
    try {
      originalData = await this.readFile(path);
    } catch {
      originalData = '';
    }

    await this.writeFile(path, originalData + data);
  }

  async deleteFile(path: string) {
    if (await this.isFile(path)) {
      this.unsetEntry(path);
    } else {
      throw ErrorFactory.newInternalError('Is not a file');
    }
  }

  async isFile(path: string) {
    const entry = this.findEntryNoFollow(path);
    if (entry === undefined) {
      throw ErrorFactory.newInternalError('no such file or directory');
    }
    return entry.type === MetadataType.file;
  }

  async isDirectory(path: string) {
    const entry = this.findEntryNoFollow(path);
    if (entry === undefined) {
      throw ErrorFactory.newInternalError('no such file or directory');
    }
    return entry.type === MetadataType.dir;
  }

  async getMetadata(path: string): Promise<Metadata> {
    const name = nodePath.posix.basename(path);
    const splitName = name.split('.');

    // dotfiles doesn't have an extension
    const extension: string | undefined = name.startsWith('.') ? undefined : `.${splitName[splitName.length - 1]}`;

    const metadata: Omit<Metadata, 'type'> = {
      path,
      name,
      baseName: name.replace(extension || '', ''),
      extension,
      //return size in bytes
      size: 0,
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
    const dirContent = await this.readDirectory(path);
    for (const cnt of dirContent) {
      const cntPath = nodePath.posix.join(path, cnt);
      const metadata = await this.getMetadata(cntPath);

      const lambdaResult = fn(metadata);
      if (lambdaResult === false) return false;

      if (metadata.type === MetadataType.dir) {
        await this.flatTraverse(metadata.path, fn);
      }
    }
  }
}
