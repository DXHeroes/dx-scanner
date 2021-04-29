import { Metadata, ProjectFilesBrowserService } from '../services/model';
import { IFileInspector } from './IFileInspector';
export declare class FileInspector implements IFileInspector {
    readonly basePath: string | undefined;
    private projectFilesBrowser;
    private cache;
    constructor(projectFilesBrowser: ProjectFilesBrowserService, basePath: string | undefined);
    purgeCache(): void;
    exists(path: string): Promise<boolean>;
    readDirectory(path: string): Promise<string[]>;
    readFile(path: string): Promise<string>;
    writeFile(path: string, data: string): Promise<void>;
    appendFile(path: string, data: string): Promise<void>;
    isFile(path: string): Promise<boolean>;
    isDirectory(path: string): Promise<boolean>;
    getMetadata(path: string): Promise<Metadata>;
    flatTraverse(path: string, fn: (meta: Metadata) => void | boolean): Promise<boolean | void>;
    private normalizePath;
    scanFor(fileName: RegExp | string, path: string, options?: {
        ignoreSubPaths?: string[];
        shallow?: boolean;
        ignoreErrors?: boolean;
    }): Promise<Metadata[]>;
}
//# sourceMappingURL=FileInspector.d.ts.map