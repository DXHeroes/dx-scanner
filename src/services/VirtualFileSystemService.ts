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
    path = nodePath.resolve(path);

    const pathAsArray = [];
    const root = nodePath.parse(path).root;

    while (path !== root) {
      pathAsArray.unshift('children', nodePath.basename(path));
      path = nodePath.dirname(path);
    }

    // Append the non-Posix root
    if (root !== nodePath.sep) {
      pathAsArray.unshift('children', root);
    }
    return pathAsArray;
  }

  private followSymLinks(path: string, directory?: VirtualDirectory): string {
    directory = directory !== undefined ? directory : this.structure;
    if (directory === undefined) {
      throw ErrorFactory.newInternalError('structure is undefined');
    }

    let name: string;
    path = nodePath.normalize(path);
    // In case of an absolute path, name should be the root including the path separator
    name = nodePath.isAbsolute(path) ? nodePath.parse(path).root : path.split(nodePath.sep)[0];
    path = nodePath.relative(name, path);
    // In case of the Posix root, the child is the structure (Windows roots/drives are also handled as plain directories)
    const child: VirtualFileSystemEntry = name === nodePath.sep ? directory : directory.children[name];

    if (child !== undefined) {
      switch (child.type) {
        case MetadataType.file:
          break;
        case MetadataType.dir:
          if (path.length === 0) {
            break;
          }
          path = this.followSymLinks(path, child);
          break;
        case MetadataType.symlink:
          path = this.followSymLinks(nodePath.join(child.target, path), directory);
          name = '';
          break;
      }
    }
    return nodePath.join(name, path);
  }

  private findEntry(path: string): VirtualFileSystemEntry {
    if (this.structure === undefined) {
      throw ErrorFactory.newInternalError('structure is undefined');
    }

    path = nodePath.normalize('/' + path);
    path = this.followSymLinks(path);

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

    path = nodePath.resolve(path);
    path = this.followSymLinks(path);
    // Throws an error if the parent is not a directory
    this.findParentEntry(path);

    this.structure = _.set(this.structure, this.pathAsStructureArray(path), entry);
  }

  private unsetEntry(path: string) {
    const parentEntry = this.findParentEntry(path);
    const name = nodePath.basename(path);
    if (name === undefined) {
      throw ErrorFactory.newInternalError('no such file or directory');
    }
    delete parentEntry.children[name];
  }

  private findEntryNoFollow(path: string): VirtualFileSystemEntry | undefined {
    const parentEntry = this.findParentEntry(path);
    const name = nodePath.basename(path);
    if (name === undefined) {
      throw ErrorFactory.newInternalError('no such file or directory');
    }
    return parentEntry.children[name];
  }

  private findParentEntry(path: string): VirtualDirectory {
    if (this.structure === undefined) {
      throw ErrorFactory.newInternalError('structure is undefined');
    }

    const dirName = nodePath.dirname(path);
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
    const entry = this.findEntry(path);
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
    if ((await this.isFile(path)) || (await this.isSymbolicLink(path))) {
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

  async isSymbolicLink(path: string) {
    const entry = this.findEntryNoFollow(path);
    if (entry === undefined) {
      throw ErrorFactory.newInternalError('no such file or directory');
    }
    return entry.type === MetadataType.symlink;
  }

  async getMetadata(path: string): Promise<Metadata> {
    const name = nodePath.basename(path);
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

    if (await this.isFile(path)) {
      return {
        ...metadata,
        type: MetadataType.file,
      };
    }

    if (await this.isDirectory(path)) {
      return {
        ...metadata,
        extension: undefined,
        type: MetadataType.dir,
      };
    }

    if (await this.isSymbolicLink(path)) {
      return {
        ...metadata,
        type: MetadataType.symlink,
      };
    }

    throw ErrorFactory.newInternalError("It's not file, dir nor symlink");
  }

  async flatTraverse(path: string, fn: (meta: Metadata) => void | boolean) {
    const dirContent = await this.readDirectory(path);
    for (const cnt of dirContent) {
      const cntPath = nodePath.join(path, cnt);
      const metadata = await this.getMetadata(cntPath);

      const lambdaResult = fn(metadata);
      if (lambdaResult === false) return false;

      if (metadata.type === MetadataType.dir) {
        await this.flatTraverse(metadata.path, fn);
      }
    }
  }
}
