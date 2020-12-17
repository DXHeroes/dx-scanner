import { Paginated } from './common/Paginated';
import { Issue, IssueComment } from '../services/git/model';
import { ListGetterOptions } from '.';
export declare enum IssueState {
    open = "open",
    closed = "closed",
    all = "all"
}
export interface IIssueTrackingInspector {
    listIssues(owner: string, repo: string, options?: {
        withDiffStat?: boolean;
    } & ListGetterOptions<{
        state?: IssueState;
    }>): Promise<Paginated<Issue>>;
    getIssue(owner: string, repo: string, id: number): Promise<Issue>;
    listIssueComments(owner: string, repo: string, id: number): Promise<Paginated<IssueComment>>;
    purgeCache(): void;
}
//# sourceMappingURL=IIssueTrackingInspector.d.ts.map