/* eslint-disable @typescript-eslint/camelcase */
import { GitLabConstructor } from '../GitLabClient';
import { PaginationParams } from '../../../../inspectors';
import { parseResponse, CustomAxiosResponse } from '../Utils';
import { Commit } from './MergeRequests';
import { AxiosResponse } from 'axios';

export class Commits extends GitLabConstructor {
  api = this.createAxiosInstance();

  async list(projectId: string, pagination?: PaginationParams): Promise<CustomAxiosResponse<Commit[]>> {
    const endpoint = `projects/${encodeURIComponent(projectId)}/repository/commits`;

    const params = {
      page: pagination?.page,
      per_page: pagination?.perPage,
    };

    const response: AxiosResponse<Commit[]> = await this.api.get(endpoint, { params });
    return parseResponse(response);
  }

  async get(projectId: string, commitId: string): Promise<CustomAxiosResponse<Commit>> {
    const endpoint = `projects/${encodeURIComponent(projectId)}/repository/commits/${commitId}`;

    const response: AxiosResponse<Commit> = await this.api.get(endpoint);
    return parseResponse(response);
  }
}
