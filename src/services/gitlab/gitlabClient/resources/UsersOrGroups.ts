import { GitLabConstructor } from '../GitLabClient';
import { parseResponse } from '../Utils';

export class Users extends GitLabConstructor {
  api = this.createAxiosInstance();

  /**
   *
   * @param userOrGroupName - Name of user or group
   *
   * Get info about user or group
   */
  async get(userOrGroupName: string) {
    let response;

    try {
      response = await this.getUser(userOrGroupName);
    } catch (error) {
      response = await this.getGroup(userOrGroupName);
    }

    return parseResponse(response);
  }

  private async getUser(userName: string) {
    const endpoint = `users?username=${userName}`;

    return this.api.get(endpoint);
  }

  private async getGroup(groupName: string) {
    const endpoint = `groups?=${groupName}`;

    return this.api.get(endpoint);
  }
}
