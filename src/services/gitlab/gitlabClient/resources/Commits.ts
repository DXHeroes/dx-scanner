/* eslint-disable @typescript-eslint/camelcase */
import { GitLabConstructor } from '../GitLabClient';
import { PaginationParams } from '../../../../inspectors';
import { parseResponse } from '../Utils';

export class Commits extends GitLabConstructor {
  api = this.createAxiosInstance();

  async list(projectId: string, pagination?: PaginationParams) {
    const endpoint = `projects/${encodeURIComponent(projectId)}/repository/commits`;

    const params = {
      page: pagination?.page,
      per_page: pagination?.perPage,
    };

    const response = await this.api.get(endpoint, { params });
    return parseResponse(response);
  }

  async get(projectId: string, commitId: string) {
    const endpoint = `projects/${encodeURIComponent(projectId)}/repository/commits/${commitId}`;

    const response = await this.api.get(endpoint);
    return parseResponse(response);
  }
}
