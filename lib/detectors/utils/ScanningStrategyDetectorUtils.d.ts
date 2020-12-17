export declare class ScanningStrategyDetectorUtils {
    static isLocalPath(path: string): boolean;
    static isGitHubPath(path: string): boolean;
    static isBitbucketPath(path: string): boolean;
    /**
     * Tests if the path is Gitlab service
     *  - if the url is not gitlab.com it tests the version endpoint of gitlab then
     *  - if the version endpoint returns unauthorized, the body of Scanner prompts user for credentials
     */
    static isGitLabPath(path: string): boolean | undefined;
    static isRemoteServicePath(path: string): boolean;
    static testPath(path: string, regex: RegExp): boolean;
    static normalizePath(path: string): string;
}
//# sourceMappingURL=ScanningStrategyDetectorUtils.d.ts.map