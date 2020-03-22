export class ScanningStrategyDetectorUtils {
  static isLocalPath(path: string): boolean {
    return this.testPath(path, /^(?!http|ssh).*$/) && !this.isRemoteServicePath(path);
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
  static isGitLabPath(path: string): boolean | undefined {
    if (this.testPath(path, /gitlab\.com/)) return true;
    return undefined;
  }

  static isRemoteServicePath(path: string): boolean {
    return this.isGitHubPath(path) || this.isBitbucketPath(path) || !!this.isGitLabPath(path); // || ...
  }

  static testPath(path: string, regex: RegExp): boolean {
    return new RegExp(regex).test(path);
  }

  static normalizePath(path: string): string {
    // src.: https://stackoverflow.com/a/3809435/10826693
    const isUrl = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(path);

    if (isUrl && this.testPath(path, /^(?!http|ssh).*$/)) {
      return `https://${path}`;
    }

    return path;
  }
}
