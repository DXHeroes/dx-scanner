import { AxiosResponse } from 'axios';
import { PaginationParams } from '../../../../inspectors';
import { GitLabClient } from '../GitLabClient';
import { CustomAxiosResponse, parseResponse } from '../gitlabUtils';

export class Contributors extends GitLabClient {
  api = this.createAxiosInstance();

  async list(projectId: string, pagination?: PaginationParams): Promise<CustomAxiosResponse<Contributor[]>> {
    const endpoint = `projects/${encodeURIComponent(projectId)}/repository/contributors`;

    const params = {
      page: pagination?.page,
      per_page: pagination?.perPage,
    };

    const response: AxiosResponse<Contributor[]> = await this.api.get(endpoint, { params });
    return parseResponse(response);
  }
}

export interface Contributor {
  name: string;
  email: string;
  commits: number;
}
