import { GitLabClient } from '../GitLabClient';
import { CustomAxiosResponse, parseResponse } from '../gitlabUtils';

export class Version extends GitLabClient {
  api = this.createAxiosInstance();

  async check(): Promise<CustomAxiosResponse<VersionResponse>> {
    const endpoint = 'version';
    const response = await this.api.get(endpoint);
    return parseResponse(response);
  }
}

export type VersionResponse = {
  version: string;
  revision: string;
};
