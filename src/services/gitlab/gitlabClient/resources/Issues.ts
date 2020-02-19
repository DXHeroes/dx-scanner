/* eslint-disable @typescript-eslint/camelcase */
import { GitLabConstructor } from '../GitLabClient';
import { ListGetterOptions, PaginationParams } from '../../../../inspectors';
import { GitLabIssueState } from '../../IGitLabService';
import { parseResponse } from '../Utils';

export class Issues extends GitLabConstructor {
  api = this.createAxiosInstance();

  async list(projectId: string, options?: ListGetterOptions<{ state?: GitLabIssueState }>) {
    const endpoint = `projects/${encodeURIComponent(projectId)}/issues`;

    const params = {
      page: options?.pagination?.page,
      per_page: options?.pagination?.perPage,
      state: options?.filter?.state,
    };

    const response = await this.api.get(endpoint, { params });
    return parseResponse(response);
  }

  async get(projectId: string, issueIId: number) {
    const endpoint = `projects/${encodeURIComponent(projectId)}/issues/${issueIId}`;

    const response = await this.api.get(endpoint);
    return parseResponse(response);
  }

  async comments(projectId: string, issueIId: number, pagination?: PaginationParams) {
    const endpoint = `projects/${encodeURIComponent(projectId)}/issues/${issueIId}/notes`;

    const params = {
      page: pagination?.page,
      per_page: pagination?.perPage,
    };

    const response = await this.api.get(endpoint, { params });
    return parseResponse(response);
  }
}
