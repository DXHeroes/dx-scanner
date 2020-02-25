import axios from 'axios';
import { GitServiceUtils } from '../../services';
import { has } from 'lodash';

export class ScanningStrategyDetectorUtils {
  static async isLocalPath(path: string): Promise<boolean> {
    return this.testPath(path, /^(?!http|ssh).*$/) && !(await this.isRemoteServicePath(path));
  }

  static isGitHubPath(path: string): boolean {
    return this.testPath(path, /github\.com/);
  }

  static isBitbucketPath(path: string): boolean {
    return this.testPath(path, /bitbucket\.org/);
  }

  /**
   * Tests if the path is Gitlab service
   *  - if the url is not gitlab.com it tests the version endpoint of gitlab then
   *  - if the version endpoint returns unauthorized, the body of Scanner prompts user for credentials
   */
  static async isGitLabPath(path: string): Promise<boolean | undefined> {
    if (this.testPath(path, /gitlab\.com/)) return true;

    // axios get GL endpoint
    const parsedUrl = GitServiceUtils.parseUrl(path);
    try {
      const response = await axios.create({ baseURL: `${parsedUrl.protocol}${parsedUrl.host}` }).get('/api/v4/version');
      return has(response.data, 'version') && has(response.data, 'revision');
    } catch (error) {
      if (error.status === 401 || error.status === 404 || error.status === 403) {
        // return undefined if we're not sure that the service is Gitlab
        //  - it prompts user for a credentials
        return undefined;
      }
      throw error;
    }
  }

  static async isRemoteServicePath(path: string): Promise<boolean> {
    return !(await this.isLocalPath(path)) && (this.isGitHubPath(path) || this.isBitbucketPath(path) || !!(await this.isGitLabPath(path))); // || ...
  }

  static testPath(path: string, regex: RegExp): boolean {
    return new RegExp(regex).test(path);
  }

  static async normalizePath(path: string) {
    if ((await this.isRemoteServicePath(path)) && this.testPath(path, /^(?!http|ssh).*$/)) {
      return `https://${path}`;
    }

    return path;
  }
}
