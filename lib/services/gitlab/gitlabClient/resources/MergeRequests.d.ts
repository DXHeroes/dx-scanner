import { ListGetterOptions, PaginationParams } from '../../../../inspectors';
import { GitLabPullRequestState } from '../../IGitLabService';
import { GitLabClient } from '../GitLabClient';
import { CustomAxiosResponse } from '../gitlabUtils';
import { TaskCompletionStatus, TimeStats } from './model';
import { User } from './UsersOrGroups';
export declare class MergeRequests extends GitLabClient {
    api: import("axios").AxiosInstance;
    /**
     *
     * @param projectId - The ID or URL path of the project, e.g. DXHeroes/dx-scanner
     * @param options
     *
     * List all merge requests for project.
     */
    list(projectId: string, options?: ListGetterOptions<{
        state?: GitLabPullRequestState | GitLabPullRequestState[];
        sourceBranch?: string;
    }>): Promise<CustomAxiosResponse<MergeRequest[]>>;
    /**
     *
     * @param projectId - The ID or URL path of the project, e.g. DXHeroes/dx-scanner
     * @param mergeRequestIId
     * @param options
     *
     * Get single pull request (merge request) of given merge_request_iid
     */
    get(projectId: string, mergeRequestIId: number): Promise<CustomAxiosResponse<MergeRequest>>;
    /**
     *
     * @param projectId - The ID or URL path of the project, e.g. DXHeroes/dx-scanner
     * @param mergeRequestIId
     * @param options
     *
     * List all commits for merge request of given iid
     */
    listCommits(projectId: string, mergeRequestIId: number, pagination?: PaginationParams): Promise<CustomAxiosResponse<Commit[]>>;
    /**
     *
     * @param projectId - The ID or URL path of the project, e.g. DXHeroes/dx-scanner
     * @param mergeRequestIId
     * @param pagination
     *
     * Gets a list of all notes for a single merge request.
     */
    listComments(projectId: string, mergeRequestIId: number, pagination?: PaginationParams): Promise<CustomAxiosResponse<MergeComment[]>>;
    /**
     *
     * @param projectId - The ID or URL path of the project, e.g. DXHeroes/dx-scanner
     * @param mergeRequestIId
     * @param body
     *
     * Creates a new note for a single merge request.
     * If you create a note where the body only contains an Award Emoji, you’ll receive this object back.
     */
    createComment(projectId: string, mergeRequestIId: number, body: string): Promise<CustomAxiosResponse<MergeComment>>;
    /**
     *
     * @param projectId
     * @param mergeRequestIId
     * @param body
     * @param commentId
     *
     * Modify existing note of a merge request
     */
    updateComment(projectId: string, mergeRequestIId: number, body: string, commentId: number): Promise<CustomAxiosResponse<MergeComment>>;
}
export interface MergeRequest {
    id: number;
    iid: number;
    project_id: number;
    title: string;
    description: string;
    state: string;
    created_at: Date;
    updated_at: Date;
    merged_by: User;
    merged_at?: Date;
    closed_by: User;
    closed_at?: Date;
    target_branch: string;
    source_branch: string;
    user_notes_count: number;
    upvotes: number;
    downvotes: number;
    assignee: User;
    author: User;
    assignees: User[];
    source_project_id: number;
    target_project_id: number;
    labels: string[];
    work_in_progress: boolean;
    milestone?: any;
    merge_when_pipeline_succeeds: boolean;
    merge_status: string;
    sha: string;
    merge_commit_sha: string;
    squash_commit_sha?: any;
    discussion_locked?: any;
    should_remove_source_branch?: boolean;
    force_remove_source_branch: boolean;
    reference: string;
    web_url: string;
    time_stats: TimeStats;
    squash: boolean;
    task_completion_status: TaskCompletionStatus;
    has_conflicts: boolean;
    blocking_discussions_resolved: boolean;
}
export interface Commit {
    id: string;
    short_id: string;
    created_at: Date;
    parent_ids: any[];
    title: string;
    message: string;
    author_name: string;
    author_email: string;
    authored_date: Date;
    committer_name: string;
    committer_email: string;
    committed_date: Date;
}
export interface MergeComment {
    id: number;
    type: string;
    body: string;
    attachment?: any;
    author: User;
    created_at: Date;
    updated_at: Date;
    system: boolean;
    noteable_id: number;
    noteable_type: string;
    resolvable: boolean;
    noteable_iid: number;
    position: Position;
    resolved?: boolean;
    resolved_by: User;
}
export interface Position {
    base_sha: string;
    start_sha: string;
    head_sha: string;
    old_path: string;
    new_path: string;
    position_type: string;
    old_line?: any;
    new_line: number;
}
//# sourceMappingURL=MergeRequests.d.ts.map