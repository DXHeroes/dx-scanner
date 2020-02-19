import { GitLabConstructor } from '../GitLabClient';
import { parseResponse } from '../Utils';

export class Projects extends GitLabConstructor {
  api = this.createAxiosInstance();

  async get(projectId: string) {
    const endpoint = `projects/${encodeURIComponent(projectId)}`;

    const response = await this.api.get(endpoint);
    return parseResponse(response);
  }
}
