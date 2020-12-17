import { Repository, VCSService } from '../../model';
import { IProjectFilesBrowserService, Metadata } from '../model';
export declare class Git implements IProjectFilesBrowserService {
    private repository;
    private service;
    constructor(repository: Repository, service: VCSService);
    exists(path: string): Promise<boolean>;
    readDirectory(path: string): Promise<string[]>;
    readFile(path: string): Promise<string>;
    isFile(path: string): Promise<boolean>;
    isDirectory(path: string): Promise<boolean>;
    getMetadata(path: string): Promise<Metadata>;
    flatTraverse(path: string, fn: (meta: Metadata) => void | boolean): Promise<void | boolean>;
    getContributorCount(): Promise<number>;
    getPullRequestCount(): Promise<number>;
    private getRepoContent;
    private followSymLinks;
}
//# sourceMappingURL=Git.d.ts.map