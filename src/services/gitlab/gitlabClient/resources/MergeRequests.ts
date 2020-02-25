/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from 'axios';
import { ListGetterOptions, PaginationParams } from '../../../../inspectors';
import { GitLabPullRequestState } from '../../IGitLabService';
import { GitLabClient } from '../GitLabClient';
import { CustomAxiosResponse, parseResponse } from '../gitlabUtils';
import { User } from './UsersOrGroups';
import { TimeStats, TaskCompletionStatus } from './model';

export class MergeRequests extends GitLabClient {
  api = this.createAxiosInstance();

  /**
   *
   * @param projectId - The ID or URL path of the project, e.g. DXHeroes/dx-scanner
   * @param options
   *
   * List all merge requests for project.
   */
  async list(
    projectId: string,
    options?: ListGetterOptions<{ state?: GitLabPullRequestState }>,
  ): Promise<CustomAxiosResponse<MergeRequest[]>> {
    const endpoint = `projects/${encodeURIComponent(projectId)}/merge_requests`;

    const params = {
      page: options?.pagination?.page,
      per_page: options?.pagination?.perPage,
      state: options?.filter?.state,
    };

    const response: AxiosResponse<MergeRequest[]> = await this.api.get(endpoint, { params });
    return parseResponse(response);
  }

  /**
   *
   * @param projectId - The ID or URL path of the project, e.g. DXHeroes/dx-scanner
   * @param mergeRequestIId
   * @param options
   *
   * Get single pull request (merge request) of given merge_request_iid
   */
  async get(projectId: string, mergeRequestIId: number): Promise<CustomAxiosResponse<MergeRequest>> {
    const endpoint = `projects/${encodeURIComponent(projectId)}/merge_requests/${mergeRequestIId}`;

    const response: AxiosResponse<MergeRequest> = await this.api.get(endpoint);
    return parseResponse(response);
  }

  /**
   *
   * @param projectId - The ID or URL path of the project, e.g. DXHeroes/dx-scanner
   * @param mergeRequestIId
   * @param options
   *
   * List all commits for merge request of given iid
   */
  async listCommits(projectId: string, mergeRequestIId: number, pagination?: PaginationParams): Promise<CustomAxiosResponse<Commit[]>> {
    const endpoint = `projects/${encodeURIComponent(projectId)}/merge_requests/${mergeRequestIId}/commits`;

    const params = {
      page: pagination?.page,
      per_page: pagination?.perPage,
    };

    const response: AxiosResponse<Commit[]> = await this.api.get(endpoint, { params });
    return parseResponse(response);
  }

  /**
   *
   * @param projectId - The ID or URL path of the project, e.g. DXHeroes/dx-scanner
   * @param mergeRequestIId
   * @param pagination
   *
   * Gets a list of all notes for a single merge request.
   */
  async listComments(
    projectId: string,
    mergeRequestIId: number,
    pagination?: PaginationParams,
  ): Promise<CustomAxiosResponse<MergeComment[]>> {
    const endpoint = `projects/${encodeURIComponent(projectId)}/merge_requests/${mergeRequestIId}/notes`;

    const params = {
      page: pagination?.page,
      per_page: pagination?.perPage,
    };

    const response: AxiosResponse<MergeComment[]> = await this.api.get(endpoint, { params });
    return parseResponse(response);
  }

  /**
   *
   * @param projectId - The ID or URL path of the project, e.g. DXHeroes/dx-scanner
   * @param mergeRequestIId
   * @param body
   *
   * Creates a new note for a single merge request.
   * If you create a note where the body only contains an Award Emoji, you’ll receive this object back.
   */
  async createComment(projectId: string, mergeRequestIId: number, body: string): Promise<CustomAxiosResponse<MergeComment>> {
    const endpoint = `projects/${encodeURIComponent(projectId)}/merge_requests/${mergeRequestIId}/notes`;

    const response: AxiosResponse<MergeComment> = await this.api.post(endpoint, { data: body });
    return parseResponse(response);
  }

  /**
   *
   * @param projectId
   * @param mergeRequestIId
   * @param body
   * @param commentId
   *
   * Modify existing note of a merge request
   */
  async updateComment(
    projectId: string,
    mergeRequestIId: number,
    body: string,
    commentId: number,
  ): Promise<CustomAxiosResponse<MergeComment>> {
    const endpoint = `projects/${encodeURIComponent(projectId)}/merge_requests/${mergeRequestIId}/notes/${commentId}`;

    const response: AxiosResponse<MergeComment> = await this.api.put(endpoint, { data: body });
    return parseResponse(response);
  }
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
