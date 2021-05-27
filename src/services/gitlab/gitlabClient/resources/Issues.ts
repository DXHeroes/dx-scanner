import { AxiosResponse } from 'axios';
import { PaginationParams } from '../../../../inspectors';
import { GitLabIssueState } from '../../IGitLabService';
import { GitLabClient } from '../GitLabClient';
import { CustomAxiosResponse, ListFilterOptions, parseResponse } from '../gitlabUtils';
import { User } from './UsersOrGroups';
import { TimeStats, TaskCompletionStatus } from './model';
import qs from 'qs';

export class Issues extends GitLabClient {
  api = this.createAxiosInstance();

  async list(projectId: string, options?: ListFilterOptions<{ state?: GitLabIssueState }>): Promise<CustomAxiosResponse<Issue[]>> {
    const endpoint = `projects/${encodeURIComponent(projectId)}/issues`;

    const params = {
      page: options?.pagination?.page,
      per_page: options?.pagination?.perPage,
      state: options?.filter?.state,
    };

    const response: AxiosResponse<Issue[]> = await this.api.get(endpoint, {
      params,
      paramsSerializer: (params) => {
        return qs.stringify(params, { arrayFormat: 'repeat', encode: false });
      },
    });
    return parseResponse(response);
  }

  async get(projectId: string, issueIId: number): Promise<CustomAxiosResponse<Issue>> {
    const endpoint = `projects/${encodeURIComponent(projectId)}/issues/${issueIId}`;

    const response: AxiosResponse<Issue> = await this.api.get(endpoint);
    return parseResponse(response);
  }

  async listComments(projectId: string, issueIId: number, pagination?: PaginationParams): Promise<CustomAxiosResponse<IssueComment[]>> {
    const endpoint = `projects/${encodeURIComponent(projectId)}/issues/${issueIId}/notes`;

    const params = {
      page: pagination?.page,
      per_page: pagination?.perPage,
    };

    const response: AxiosResponse<IssueComment[]> = await this.api.get(endpoint, { params });
    return parseResponse(response);
  }
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
  due_date?: string;
  confidential: boolean;
  discussion_locked?: boolean;
  web_url: string;
  time_stats: TimeStats;
  task_completion_status: TaskCompletionStatus;
  weight?: number;
  has_tasks: boolean;
  _links: Links;
  references: References;
  moved_to_id?: number;
  epic_iid?: number;
  epic?: Epic;
}

export interface Epic {
  id: number;
  iid: number;
  title: string;
  url: string;
  group_id: number;
}

export interface IssueComment {
  id: number;
  body: string;
  attachment?: unknown;
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
