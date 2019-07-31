export class ScanningStrategyDetectorUtils {
  static isLocalPath(path: string): boolean {
    return this.testPath(path, /^(?!http|ssh).*$/) && !this.isRemoteServicePath(path);
  }

  static isGitHubPath(path: string): boolean {
    return this.testPath(path, /github\.com/);
  }

  static isRemoteServicePath(path: string): boolean {
    return this.isGitHubPath(path); // || ...
  }

  static testPath(path: string, regex: RegExp): boolean {
    return new RegExp(regex).test(path);
  }

  static normalizePath(path: string) {
    if (this.isRemoteServicePath(path) && this.testPath(path, /^(?!http|ssh).*$/)) {
      return `https://${path}`;
    }

    return path;
  }
}
