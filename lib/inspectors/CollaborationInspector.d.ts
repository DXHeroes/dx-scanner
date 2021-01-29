import { VCSService } from '../model';
import { ListGetterOptions } from './common/ListGetterOptions';
import { ICollaborationInspector, PullRequestState } from './ICollaborationInspector';
export declare class CollaborationInspector implements ICollaborationInspector {
    private service;
    private cache;
    constructor(service: VCSService);
    purgeCache(): void;
    listPullRequests(owner: string, repo: string, options?: {
        withDiffStat?: boolean;
    } & ListGetterOptions<{
        state?: PullRequestState;
    }>): Promise<import("./common").Paginated<import("../services/git/model").PullRequest>>;
    getPullRequest(owner: string, repo: string, prNumber: number, withDiffStat?: boolean): Promise<import("../services/git/model").PullRequest>;
    listPullRequestFiles(owner: string, repo: string, prNumber: number): Promise<import("./common").Paginated<import("../services/git/model").PullFiles>>;
    listPullCommits(owner: string, repo: string, prNumber: number, options?: ListGetterOptions): Promise<import("./common").Paginated<import("../services/git/model").PullCommits>>;
    listRepoCommits(owner: string, repo: string, options?: ListGetterOptions): Promise<import("./common").Paginated<import("../services/git/model").Commit>>;
    getPullsDiffStat(owner: string, repo: string, prNumber: number): Promise<import("../services/git/model").Lines>;
}
//# sourceMappingURL=CollaborationInspector.d.ts.map