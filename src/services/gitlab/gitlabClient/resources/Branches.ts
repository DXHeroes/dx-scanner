import { AxiosResponse } from 'axios';
import { PaginationParams } from '../../../../inspectors';
import { GitLabClient } from '../GitLabClient';
import { CustomAxiosResponse, parseResponse } from '../gitlabUtils';

export class Branches extends GitLabClient {
  api = this.createAxiosInstance();

  async list(projectId: string, pagination?: PaginationParams): Promise<CustomAxiosResponse<Branch[]>> {
    const endpoint = `projects/${encodeURIComponent(projectId)}/repository/branches`;

    const params = {
      page: pagination?.page,
      per_page: pagination?.perPage,
    };

    const response: AxiosResponse<Branch[]> = await this.api.get(endpoint, { params });
    return parseResponse(response);
  }
}

export interface Branch {
  name: string;
  default: boolean;
}
