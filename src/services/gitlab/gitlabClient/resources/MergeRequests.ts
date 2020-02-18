/* eslint-disable @typescript-eslint/no-explicit-any */
import { GitLabClient } from '../GitLabClient';
import { bundler, parseResponse } from '../Utils';
import { ListGetterOptions } from '../../../../inspectors';
import { GitLabPullRequestState } from '../../IGitLabService';

export class MergeRequests extends GitLabClient {
  api = this.createAxiosInstance();

  mergeRequests = 'merge_requests';
  /**
   *
   * @param projectId - The ID or URL path of the project, e.g. DXHeroes/dx-scanner
   *
   * List all merge requests for project.
   */
  async list(projectId: string, options?: ListGetterOptions<{ state?: GitLabPullRequestState }>) {
    const endpoint = `projects/${encodeURIComponent(projectId)}/merge_requests`;

    const queryParams = {
      page: options?.pagination?.page,
      // eslint-disable-next-line @typescript-eslint/camelcase
      per_page: options?.pagination?.perPage,
      state: options?.filter?.state,
    };

    const response = await this.api.get(endpoint, { params: queryParams });
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
  async get(projectId: string, mergeRequestIId: number, options?: ListGetterOptions<{ state?: GitLabPullRequestState }>) {
    const endpoint = `projects/${encodeURIComponent(projectId)}/merge_requests/${mergeRequestIId}`;

    const queryParams = {
      page: options?.pagination?.page,
      // eslint-disable-next-line @typescript-eslint/camelcase
      per_page: options?.pagination?.perPage,
      state: options?.filter?.state,
    };

    const response = await this.api.get(endpoint, { params: queryParams });
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
  async commits(projectId: string, mergeRequestIId: number, options?: ListGetterOptions) {
    const endpoint = `projects/${encodeURIComponent(projectId)}/merge_requests/${mergeRequestIId}/commits`;
    const queryParams = {
      page: options?.pagination?.page,
      // eslint-disable-next-line @typescript-eslint/camelcase
      per_page: options?.pagination?.perPage,
    };
    const response = await this.api.get(endpoint, { params: queryParams });
    return parseResponse(response);
  }
}

//TODO move to another file
export const GitLabCustom = bundler({ MergeRequests });

export type GitLabCustom = InstanceType<typeof GitLabCustom>;
