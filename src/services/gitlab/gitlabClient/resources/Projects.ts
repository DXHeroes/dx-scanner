import { AxiosResponse } from 'axios';
import { GitLabClient } from '../GitLabClient';
import { CustomAxiosResponse, parseResponse } from '../gitlabUtils';
import { Links } from './model';

export class Projects extends GitLabClient {
  api = this.createAxiosInstance();

  async get(projectId: string): Promise<CustomAxiosResponse<Project>> {
    const endpoint = `projects/${encodeURIComponent(projectId)}`;

    const response: AxiosResponse<Project> = await this.api.get(endpoint);
    return parseResponse(response);
  }
}

export interface Project {
  id: number;
  description: string;
  name: string;
  name_with_namespace: string;
  path: string;
  path_with_namespace: string;
  created_at: Date;
  default_branch: string;
  tag_list: any[];
  ssh_url_to_repo: string;
  http_url_to_repo: string;
  web_url: string;
  readme_url: string;
  avatar_url?: any;
  star_count: number;
  forks_count: number;
  last_activity_at: Date;
  namespace: Namespace;
  _links?: Links;
  empty_repo?: boolean;
  archived?: boolean;
  visibility?: string;
}

export interface Namespace {
  id: number;
  name: string;
  path: string;
  kind: string;
  full_path: string;
  parent_id?: any;
  avatar_url: string;
  web_url: string;
}

export interface ForkedFromProject {
  id: number;
  description: string;
  name: string;
  name_with_namespace: string;
  path: string;
  path_with_namespace: string;
  created_at: Date;
  default_branch: string;
  tag_list: any[];
  ssh_url_to_repo: string;
  http_url_to_repo: string;
  web_url: string;
  readme_url: string;
  avatar_url?: any;
  star_count: number;
  forks_count: number;
  last_activity_at: Date;
  namespace: Namespace;
}

export interface GroupAccess {
  access_level: number;
  notification_level: number;
}

export interface Permissions {
  project_access?: any;
  group_access: GroupAccess;
}
