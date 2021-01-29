/// <reference types="node" />
/// <reference types="graceful-fs" />
import fs from 'fs';
import { IProjectFilesBrowserService, Metadata } from './model';
import { IFs } from 'memfs';
import { DirectoryJSON } from 'memfs/lib/volume';
/**
 * Service for file system browsing
 *  - uses fs by default
 *  - can work just in memory with memfs
 */
export declare class FileSystemService implements IProjectFilesBrowserService {
    protected fileSystem: IFs | typeof fs;
    private virtualVolume;
    constructor({ isVirtual }?: {
        isVirtual?: boolean | undefined;
    });
    setFileSystem(structure: DirectoryJSON): void;
    clearFileSystem(): void;
    exists(path: string): Promise<boolean>;
    readDirectory(path: string): Promise<string[]>;
    readFile(path: string): Promise<string>;
    writeFile(path: string, content: string): Promise<void>;
    createDirectory(path: string): Promise<void>;
    deleteDirectory(path: string): Promise<void>;
    createFile(path: string, data: string): Promise<void>;
    deleteFile(path: string): Promise<void>;
    isFile(path: string): Promise<boolean>;
    isDirectory(path: string): Promise<boolean>;
    getMetadata(path: string): Promise<Metadata>;
    flatTraverse(path: string, fn: (meta: Metadata) => void | boolean): Promise<void>;
}
//# sourceMappingURL=FileSystemService.d.ts.map