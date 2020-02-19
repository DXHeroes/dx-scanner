/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { GitLabConstructor } from '../GitLabClient';
import { parseResponse } from '../Utils';
import { ListGetterOptions, PaginationParams } from '../../../../inspectors';
import { GitLabPullRequestState } from '../../IGitLabService';

export class MergeRequests extends GitLabConstructor {
  api = this.createAxiosInstance();

  /**
   *
   * @param projectId - The ID or URL path of the project, e.g. DXHeroes/dx-scanner
   * @param options
   *
   * List all merge requests for project.
   */
  async list(projectId: string, options?: ListGetterOptions<{ state?: GitLabPullRequestState }>) {
    const endpoint = `projects/${encodeURIComponent(projectId)}/merge_requests`;

    const params = {
      page: options?.pagination?.page,
      per_page: options?.pagination?.perPage,
      state: options?.filter?.state,
    };

    const response = await this.api.get(endpoint, { params });
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
  async get(projectId: string, mergeRequestIId: number) {
    const endpoint = `projects/${encodeURIComponent(projectId)}/merge_requests/${mergeRequestIId}`;

    const response = await this.api.get(endpoint);
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
  async commits(projectId: string, mergeRequestIId: number, pagination?: PaginationParams) {
    const endpoint = `projects/${encodeURIComponent(projectId)}/merge_requests/${mergeRequestIId}/commits`;

    const params = {
      page: pagination?.page,
      per_page: pagination?.perPage,
    };

    const response = await this.api.get(endpoint, { params });
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
  async comments(projectId: string, mergeRequestIId: number, pagination?: PaginationParams) {
    const endpoint = `projects/${encodeURIComponent(projectId)}/merge_requests/${mergeRequestIId}/notes`;

    const params = {
      page: pagination?.page,
      per_page: pagination?.perPage,
    };

    const response = await this.api.get(endpoint, { params });
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
  async createComment(projectId: string, mergeRequestIId: number, body: string) {
    const endpoint = `projects/${encodeURIComponent(projectId)}/merge_requests/${mergeRequestIId}/notes`;

    const response = await this.api.post(endpoint, { data: body });
    return parseResponse(response);
  }

  /**
   *
   * @param projectId
   * @param mergeRequestIId
   * @param body
   * @param commentId
   *
   * Modify existing note of a merge request.
   */
  async updateComment(projectId: string, mergeRequestIId: number, body: string, commentId: number) {
    const endpoint = `projects/${encodeURIComponent(projectId)}/merge_requests/${mergeRequestIId}/notes/${commentId}`;

    const response = await this.api.put(endpoint, { data: body });
    return parseResponse(response);
  }
}
