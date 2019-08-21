import { FileSystemService } from './FileSystemService';

export type ProjectFilesBrowserServices = FileSystemService;

export interface IProjectFilesBrowserService {
  exists(path: string): Promise<boolean>;
  readDirectory(path: string): Promise<object>;
  readFile(path: string): Promise<string>;
  isFile(path: string): Promise<boolean>;
  isDirectory(path: string): Promise<boolean>;
  getMetadata(path: string): Promise<Metadata>;
  flatTraverse(path: string, fn: (meta: Metadata) => void | boolean): Promise<void | boolean>;
}

export interface Metadata {
  path: string;
  name: string;
  baseName: string;
  type: MetadataType;
  size: number;
  extension: string | undefined;
}

export enum MetadataType {
  file = 'file',
  dir = 'dir',
}
