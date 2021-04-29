import { ClientOptions } from './GitLabClient';
import { AxiosResponse } from 'axios';
import { PaginationParams } from '../../../inspectors';
import { MergeRequests } from './resources/MergeRequests';
import { Issues } from './resources/Issues';
import { Commits } from './resources/Commits';
import { Projects } from './resources/Projects';
import { Users } from './resources/UsersOrGroups';
import { Version } from './resources/Version';
import { Branches } from './resources/Branches';
import { Contributors } from './resources/Contributors';
interface Constructor {
    new (...args: any): any;
}
declare type Mapper<T extends {
    [name: string]: Constructor;
}, P extends keyof T> = {
    [name in P]: InstanceType<T[name]>;
};
export interface Bundle<T extends {
    [name: string]: Constructor;
}, P extends keyof T> {
    new (options?: ClientOptions): Mapper<T, P>;
}
export declare const bundler: <T extends {
    [name: string]: Constructor;
}, P extends keyof T>(services: T) => Bundle<T, P>;
export declare const GitLabClient: Bundle<{
    MergeRequests: typeof MergeRequests;
    Issues: typeof Issues;
    Commits: typeof Commits;
    Projects: typeof Projects;
    Users: typeof Users;
    Version: typeof Version;
    Branches: typeof Branches;
    Contributors: typeof Contributors;
}, "MergeRequests" | "Issues" | "Commits" | "Projects" | "Users" | "Version" | "Branches" | "Contributors">;
export declare type GitLabClient = InstanceType<typeof GitLabClient>;
export declare const parseResponse: <T>(response: AxiosResponse<T>) => CustomAxiosResponse<T>;
export interface PaginationGitLabCustomResponse {
    total: number;
    next: number | null;
    current: number;
    previous: number | null;
    perPage: number;
    totalPages: number;
}
export interface CustomAxiosResponse<T> {
    headers: any;
    data: T;
    pagination: PaginationGitLabCustomResponse;
}
export interface ListFilterOptions<Filter = Record<string, unknown>> {
    pagination?: PaginationParams;
    filter?: Filter;
}
export {};
//# sourceMappingURL=gitlabUtils.d.ts.map