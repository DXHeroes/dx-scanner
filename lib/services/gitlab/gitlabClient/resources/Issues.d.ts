import { PaginationParams } from '../../../../inspectors';
import { GitLabIssueState } from '../../IGitLabService';
import { GitLabClient } from '../GitLabClient';
import { CustomAxiosResponse, ListFilterOptions } from '../gitlabUtils';
import { User } from './UsersOrGroups';
import { TimeStats, TaskCompletionStatus } from './model';
export declare class Issues extends GitLabClient {
    api: import("axios").AxiosInstance;
    list(projectId: string, options?: ListFilterOptions<{
        state?: GitLabIssueState;
    }>): Promise<CustomAxiosResponse<Issue[]>>;
    get(projectId: string, issueIId: number): Promise<CustomAxiosResponse<Issue>>;
    listComments(projectId: string, issueIId: number, pagination?: PaginationParams): Promise<CustomAxiosResponse<IssueComment[]>>;
}
export interface Issue {
    id: number;
    iid: number;
    project_id: number;
    title: string;
    description: string;
    state: string;
    created_at: Date;
    updated_at: Date;
    closed_at?: Date;
    closed_by?: User;
    labels: string[];
    milestone?: Milestone;
    assignees: User[];
    author: User;
    assignee?: User;
    user_notes_count: number;
    merge_requests_count: number;
    upvotes: number;
    downvotes: number;
    due_date?: any;
    confidential: boolean;
    discussion_locked?: any;
    web_url: string;
    time_stats: TimeStats;
    task_completion_status: TaskCompletionStatus;
    weight?: number;
    has_tasks: boolean;
    _links: Links;
    references: References;
    moved_to_id?: any;
    epic_iid?: any;
    epic?: any;
}
export interface IssueComment {
    id: number;
    body: string;
    attachment?: any;
    author: User;
    created_at: Date;
    updated_at: Date;
    system: boolean;
    noteable_id: number;
    noteable_type: string;
    noteable_iid: number;
    resolvable: boolean;
}
export interface Milestone {
    id: number;
    iid: number;
    group_id: number;
    title: string;
    description: string;
    state: string;
    created_at: Date;
    updated_at: Date;
    due_date: string;
    start_date: string;
    web_url: string;
}
export interface Links {
    self: string;
    notes: string;
    award_emoji: string;
    project: string;
}
export interface References {
    short: string;
    relative: string;
    full: string;
}
//# sourceMappingURL=Issues.d.ts.map