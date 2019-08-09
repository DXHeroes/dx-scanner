import { MetadataType } from './model';

export type VirtualFileSystemEntry = VirtualFile | VirtualDirectory;

export interface VirtualFile {
  data: string;
  type: MetadataType.file;
}

export type VirtualDirectory = Record<string, string | null>;
