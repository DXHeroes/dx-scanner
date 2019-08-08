import { MetadataType } from './model';

export type VirtualFileSystemEntry = VirtualFile | VirtualDirectory;

export interface VirtualFile {
  data: string;
  type: MetadataType.file;
}

export interface VirtualDirectory {
  children: { [key: string]: VirtualFileSystemEntry };
  type: MetadataType.dir;
}
