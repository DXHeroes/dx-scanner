import { GitLabClient } from '../GitLabClient';
import { CustomAxiosResponse, parseResponse } from '../gitlabUtils';
import { User } from './UsersOrGroups';

export class Version extends GitLabClient {
  api = this.createAxiosInstance();

  async check(): Promise<any> {
    const endpoint = 'version';

    const response = await this.api.get(endpoint);
    return response;
  }
}
