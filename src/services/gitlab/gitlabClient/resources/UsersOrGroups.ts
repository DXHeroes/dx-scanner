/* eslint-disable @typescript-eslint/no-explicit-any */
import { GitLabClient } from '../GitLabClient';
import { CustomAxiosResponse, parseResponse } from '../gitlabUtils';
import { Links } from './model';

export class Users extends GitLabClient {
  api = this.createAxiosInstance();

  async getUser(userName: string): Promise<CustomAxiosResponse<User[]>> {
    const endpoint = `users`;
    const params = { username: userName };

    const response = await this.api.get(endpoint, { params });
    return parseResponse(response);
  }

  async getGroup(groupName: string): Promise<CustomAxiosResponse<Group>> {
    const endpoint = `groups/${encodeURIComponent(groupName)}`;

    // Increase timeout as the request for group info takes longer than the other requests
    const response = await this.api.get(endpoint, { timeout: 20000 });
    return parseResponse(response);
  }
}

export interface User {
  id: number;
  name: string;
  username: string;
  state: string;
  avatar_url: string;
  web_url: string;
}

export interface Group {
  id: number;
  web_url: string;
  name: string;
  path: string;
  description: string;
  visibility: string;
  share_with_group_lock: boolean;
  require_two_factor_authentication: boolean;
  two_factor_grace_period: number;
  project_creation_level: string;
  auto_devops_enabled?: any;
  subgroup_creation_level: string;
  emails_disabled: boolean;
  mentions_disabled: boolean;
  lfs_enabled: boolean;
  avatar_url: string;
  request_access_enabled: boolean;
  full_name: string;
  full_path: string;
  parent_id?: any;
  ldap_cn?: any;
  ldap_access?: any;
  file_template_project_id?: any;
  marked_for_deletion_on?: any;
  projects: Project[];
  shared_projects: SharedProject[];
  shared_runners_minutes_limit: number;
  extra_shared_runners_minutes_limit?: any;
}

export interface SharedWithGroup {
  group_id: number;
  group_name: string;
  group_full_path: string;
  group_access_level: number;
  expires_at?: any;
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
  tag_list: string[];
  ssh_url_to_repo: string;
  http_url_to_repo: string;
  web_url: string;
  readme_url: string;
  avatar_url: string;
  star_count: number;
  forks_count: number;
  last_activity_at: Date;
  _links: Links;
  empty_repo: boolean;
  archived: boolean;
  visibility: string;
  resolve_outdated_diff_discussions?: boolean;
  container_registry_enabled?: boolean;
  issues_enabled?: boolean;
  merge_requests_enabled?: boolean;
  wiki_enabled?: boolean;
  jobs_enabled?: boolean;
  snippets_enabled?: boolean;
  can_create_merge_request_in: boolean;
  issues_access_level: string;
  repository_access_level: string;
  merge_requests_access_level: string;
  wiki_access_level: string;
  builds_access_level: string;
  snippets_access_level: string;
  pages_access_level: string;
  emails_disabled?: boolean;
  shared_runners_enabled: boolean;
  lfs_enabled: boolean;
  creator_id: number;
  import_status: string;
  open_issues_count: number;
  ci_default_git_depth?: number;
  public_jobs: boolean;
  build_timeout: number;
  auto_cancel_pending_pipelines: string;
  build_coverage_regex: string;
  ci_config_path: string;
  shared_with_groups: SharedWithGroup[];
  only_allow_merge_if_pipeline_succeeds: boolean;
  request_access_enabled: boolean;
  only_allow_merge_if_all_discussions_are_resolved?: boolean;
  remove_source_branch_after_merge?: boolean;
  printing_merge_request_link_enabled: boolean;
  merge_method: string;
  suggestion_commit_message: string;
  auto_devops_enabled: boolean;
  auto_devops_deploy_strategy: string;
  autoclose_referenced_issues: boolean;
  approvals_before_merge: number;
  mirror: boolean;
  external_authorization_classification_label: string;
  packages_enabled?: boolean;
  service_desk_enabled?: boolean;
  service_desk_address: string;
  marked_for_deletion_at?: any;
  mirror_user_id?: number;
  mirror_trigger_builds?: boolean;
  only_mirror_protected_branches?: boolean;
  mirror_overwrites_diverged_branches?: boolean;
}

export interface SharedProject {
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
  avatar_url: string;
  star_count: number;
  forks_count: number;
  last_activity_at: Date;

  empty_repo: boolean;
  archived: boolean;
  visibility: string;
  resolve_outdated_diff_discussions?: boolean;
  container_registry_enabled: boolean;
  issues_enabled: boolean;
  merge_requests_enabled?: boolean;
  wiki_enabled: boolean;
  jobs_enabled?: boolean;
  snippets_enabled: boolean;
  can_create_merge_request_in: boolean;
  issues_access_level: string;
  repository_access_level: string;
  merge_requests_access_level: string;
  wiki_access_level: string;
  builds_access_level: string;
  snippets_access_level: string;
  pages_access_level: string;
  emails_disabled?: boolean;
  shared_runners_enabled: boolean;
  lfs_enabled: boolean;
  creator_id: number;
  import_status: string;
  open_issues_count: number;
  ci_default_git_depth?: number;
  public_jobs: boolean;
  build_timeout: number;
  auto_cancel_pending_pipelines: string;
  build_coverage_regex: string;
  ci_config_path: string;
  only_allow_merge_if_pipeline_succeeds: boolean;
  request_access_enabled: boolean;
  only_allow_merge_if_all_discussions_are_resolved?: boolean;
  remove_source_branch_after_merge?: boolean;
  printing_merge_request_link_enabled: boolean;
  merge_method: string;
  suggestion_commit_message?: any;
  auto_devops_enabled: boolean;
  auto_devops_deploy_strategy: string;
  autoclose_referenced_issues: boolean;
  approvals_before_merge: number;
  mirror: boolean;
  external_authorization_classification_label: string;
  packages_enabled?: boolean;
  service_desk_enabled?: boolean;
  service_desk_address: string;
  marked_for_deletion_at?: any;
  owner: User;
}
