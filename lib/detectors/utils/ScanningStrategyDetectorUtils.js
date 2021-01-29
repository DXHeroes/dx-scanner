"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScanningStrategyDetectorUtils = void 0;
class ScanningStrategyDetectorUtils {
    static isLocalPath(path) {
        return this.testPath(path, /^(?!http|ssh).*$/) && !this.isRemoteServicePath(path);
    }
    static isGitHubPath(path) {
        return this.testPath(path, /github\.com/);
    }
    static isBitbucketPath(path) {
        return this.testPath(path, /bitbucket\.org/);
    }
    /**
     * Tests if the path is Gitlab service
     *  - if the url is not gitlab.com it tests the version endpoint of gitlab then
     *  - if the version endpoint returns unauthorized, the body of Scanner prompts user for credentials
     */
    static isGitLabPath(path) {
        if (this.testPath(path, /gitlab\.com/))
            return true;
        return undefined;
    }
    static isRemoteServicePath(path) {
        return this.isGitHubPath(path) || this.isBitbucketPath(path) || !!this.isGitLabPath(path); // || ...
    }
    static testPath(path, regex) {
        return new RegExp(regex).test(path);
    }
    static normalizePath(path) {
        // src.: https://stackoverflow.com/a/3809435/10826693
        const isUrl = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(path);
        if (isUrl && this.testPath(path, /^(?!http|ssh).*$/)) {
            return `https://${path}`;
        }
        return path;
    }
}
exports.ScanningStrategyDetectorUtils = ScanningStrategyDetectorUtils;
//# sourceMappingURL=ScanningStrategyDetectorUtils.js.map