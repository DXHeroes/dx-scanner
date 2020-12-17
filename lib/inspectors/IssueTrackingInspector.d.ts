import { IIssueTrackingInspector, IssueState } from './IIssueTrackingInspector';
import { Paginated } from './common/Paginated';
import { Issue, IssueComment } from '../services/git/model';
import { VCSService } from '../model';
import { ListGetterOptions } from '.';
export declare class IssueTrackingInspector implements IIssueTrackingInspector {
    private service;
    private cache;
    constructor(service: VCSService);
    purgeCache(): void;
    listIssues(owner: string, repo: string, options?: {
        withDiffStat?: boolean;
    } & ListGetterOptions<{
        state?: IssueState;
    }>): Promise<Paginated<Issue>>;
    getIssue(owner: string, repo: string, issueId: number): Promise<Issue>;
    listIssueComments(owner: string, repo: string, issueId: number): Promise<Paginated<IssueComment>>;
}
//# sourceMappingURL=IssueTrackingInspector.d.ts.map