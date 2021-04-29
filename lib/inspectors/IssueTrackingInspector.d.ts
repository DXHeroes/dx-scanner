import { ListGetterOptions } from '.';
import { VCSService } from '../model';
import { Issue, IssueComment } from '../services/git/model';
import { Paginated } from './common/Paginated';
import { IIssueTrackingInspector, IssueState } from './IIssueTrackingInspector';
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