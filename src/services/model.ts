import { FileSystemService } from './FileSystemService';
import { VirtualFileSystemService } from './VirtualFileSystemService';

export type ProjectFilesBrowserServices = FileSystemService | VirtualFileSystemService;

export interface IProjectFilesBrowserService {
  exists(path: string): Promise<boolean>;
  readDirectory(path: string): Promise<object>;
  readFile(path: string): Promise<string>;
  writeFile(path: string, content: string): Promise<void>;
  createDirectory(path: string): Promise<void>;
  deleteDirectory(path: string): Promise<void>;
  createFile(path: string, data: string): Promise<void>;
  deleteFile(path: string): Promise<void>;
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
  // symlink = 'symlink',
}
