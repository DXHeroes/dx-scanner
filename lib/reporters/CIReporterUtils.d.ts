import { VCSServiceType } from '../services';
export declare class CIReporterUtils {
    static loadConfigurationTravis(): CIReporterConfig;
    static loadConfigurationGitHubActions(): CIReporterConfig;
    static loadConfigurationBitbucket(): CIReporterConfig;
    static loadConfigurationAppveyor(): CIReporterConfig;
}
export declare type CIReporterConfig = {
    service: VCSServiceType;
    pullRequestId: number | undefined;
    repository: {
        owner: string;
        name: string;
    };
};
//# sourceMappingURL=CIReporterUtils.d.ts.map