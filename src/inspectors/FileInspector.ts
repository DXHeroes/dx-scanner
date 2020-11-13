import { IFileInspector } from './IFileInspector';
import { Metadata, MetadataType, ProjectFilesBrowserService } from '../services/model';
import debug from 'debug';
import { injectable, optional, inject } from 'inversify';
import { Types } from '../types';
import * as nodePath from 'path';
import { ICache } from '../scanner/cache/ICache';
import { InMemoryCache } from '../scanner/cache/InMemoryCache';
import { FileSystemService } from '../services';

@injectable()
export class FileInspector implements IFileInspector {
  readonly basePath: string | undefined;
  private projectFilesBrowser: ProjectFilesBrowserService;
  private cache: ICache;

  constructor(
    @inject(Types.IProjectFilesBrowser) projectFilesBrowser: ProjectFilesBrowserService,
    @inject(Types.FileInspectorBasePath) @optional() basePath: string | undefined,
  ) {
    this.basePath = basePath && this.normalizePath(basePath);
    this.projectFilesBrowser = projectFilesBrowser;

    this.cache = new InMemoryCache();
  }

  purgeCache() {
    this.cache.purge();
  }

  exists(path: string) {
    return this.cache.getOrSet(`${this.basePath}:exists:${path}`, async () => {
      return this.projectFilesBrowser.exists(this.normalizePath(path));
    });
  }

  readDirectory(path: string) {
    return this.cache.getOrSet(`${this.basePath}:readDirectory:${path}`, async () => {
      return this.projectFilesBrowser.readDirectory(this.normalizePath(path));
    });
  }

  readFile(path: string) {
    return this.cache.getOrSet(`${this.basePath}:readFile:${path}`, async () => {
      return this.projectFilesBrowser.readFile(this.normalizePath(path));
    });
  }

  writeFile(path: string, data: string) {
    if (this.projectFilesBrowser instanceof FileSystemService) {
      return this.projectFilesBrowser.writeFile(this.normalizePath(path), data);
    }
    return Promise.resolve();
  }

  appendFile(path: string, data: string) {
    if (this.projectFilesBrowser instanceof FileSystemService) {
      return this.projectFilesBrowser.createFile(this.normalizePath(path), data);
    }
    return Promise.resolve();
  }

  isFile(path: string) {
    return this.cache.getOrSet(`${this.basePath}:isFile:${path}`, async () => {
      return this.projectFilesBrowser.isFile(this.normalizePath(path));
    });
  }

  isDirectory(path: string) {
    return this.cache.getOrSet(`${this.basePath}:isDirectory:${path}`, async () => {
      return this.projectFilesBrowser.isDirectory(this.normalizePath(path));
    });
  }

  getMetadata(path: string) {
    return this.cache.getOrSet(`${this.basePath}:getMetadata:${path}`, async () => {
      return this.projectFilesBrowser.getMetadata(this.normalizePath(path));
    });
  }

  flatTraverse(path: string, fn: (meta: Metadata) => void | boolean): Promise<boolean | void> {
    return this.cache.getOrSet(`${this.basePath}:flatTraverse:${path}:${fn}`, async () => {
      return this.projectFilesBrowser.flatTraverse(path, fn);
    });
  }

  private normalizePath(path: string): string {
    if (this.basePath && !path.startsWith(this.basePath)) {
      path = `${this.basePath}/${path}`;
    }

    return nodePath.normalize(nodePath.resolve(path));
  }

  async scanFor(
    fileName: RegExp | string,
    path: string,
    options?: {
      ignoreSubPaths?: string[];
      shallow?: boolean;
      ignoreErrors?: boolean;
    },
  ): Promise<Metadata[]> {
    return this.cache.getOrSet(`${this.basePath}:scanFor:${fileName}:${path}:${options}`, async () => {
      path = this.normalizePath(path);
      options = options || {};
      options.ignoreSubPaths = options.ignoreSubPaths || [];
      let result: Metadata[] = [];
      let dirContents: string[] = [];

      try {
        dirContents = await this.readDirectory(path);
      } catch (error) {
        if (error.code !== 'ENOENT' || (error.code === 'ENOENT' && options.ignoreErrors !== true)) {
          throw error;
        }
      }

      debug(`Scanning for ${fileName.toString()} in ${path}`);
      if (options.ignoreSubPaths) {
        options.ignoreSubPaths.forEach((pathToIgnore) => {
          if (path.startsWith(this.normalizePath(pathToIgnore))) {
            return result;
          }
        });
      }
      const forbiddenDirNames = ['.git', 'node_modules'];
      // debug(dirContents);
      await Promise.all(
        dirContents.map(async (entry) => {
          const entryMetadata = await this.getMetadata(`${path}/${entry}`);
          if (entryMetadata.type === MetadataType.file) {
            if (entryMetadata.name.match(fileName)) {
              result.push(entryMetadata);
            }
          } else if (
            options?.shallow !== true &&
            entryMetadata.type === MetadataType.dir &&
            forbiddenDirNames.indexOf(entryMetadata.name) === -1
          ) {
            const subResult = await this.scanFor(fileName, entryMetadata.path, options);
            result = [...result, ...subResult];
          }
        }),
      );

      return result;
    });
  }
}
