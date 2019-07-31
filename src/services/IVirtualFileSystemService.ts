import { MetadataType } from './model';

export type VirtualFileSystemEntry = VirtualFile | VirtualDirectory | VirtualSymbolicLink;

export interface VirtualFile {
  data: string;
  type: MetadataType.file;
}

export interface VirtualDirectory {
  children: { [key: string]: VirtualFileSystemEntry };
  type: MetadataType.dir;
}

export interface VirtualSymbolicLink {
  target: string;
  type: MetadataType.symlink;
}
