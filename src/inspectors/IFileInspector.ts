import { Metadata } from '../services/model';

export interface IFileInspector {
  readonly basePath: string | undefined;
  exists(path: string): Promise<boolean>;
  readDirectory(path: string): Promise<string[]>;
  readFile(path: string): Promise<string>;
  isFile(path: string): Promise<boolean>;
  isDirectory(path: string): Promise<boolean>;
  getMetadata(path: string): Promise<Metadata>;
  flatTraverse(path: string, fn: (meta: Metadata) => void | boolean): Promise<void | boolean>;
  scanFor(
    fileName: RegExp | string,
    path: string,
    options?: {
      ignoreSubPaths?: string[];
      shallow?: boolean;
    },
  ): Promise<Metadata[]>;
  purgeCache(): void;
}
