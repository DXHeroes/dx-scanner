import { ArgumentsProvider } from '../scanner';
import { RepositoryConfig } from '../scanner/RepositoryConfig';
import { BitbucketService, GitHubService } from '../services';
import { GitLabService } from '../services/gitlab/GitLabService';
import { IDetector } from './IDetector';
import { AccessType, ServiceType } from './IScanningStrategy';
export declare class ScanningStrategyDetector implements IDetector<string, ScanningStrategy> {
    private gitHubService;
    private bitbucketService;
    private gitLabService;
    private readonly argumentsProvider;
    private readonly repositoryConfig;
    private readonly d;
    private isOnline;
    constructor(gitHubService: GitHubService, bitbucketService: BitbucketService, gitLabService: GitLabService, argumentsProvider: ArgumentsProvider, repositoryConfig: RepositoryConfig);
    detect(): Promise<ScanningStrategy>;
    private determineInputType;
    private determineRemoteAccessType;
    private determineGitLabRemoteServiceType;
}
export interface ScanningStrategy {
    serviceType: ServiceType | undefined;
    accessType: AccessType | undefined;
    remoteUrl: RemoteUrl;
    localPath: string | undefined;
    rootPath: string | undefined;
    isOnline: boolean;
}
export interface RemoteService {
    serviceType: ServiceType | undefined;
    remoteUrl: RemoteUrl;
}
export declare type RemoteUrl = string | undefined;
export interface ScanningStrategyParams {
    path: string;
}
//# sourceMappingURL=ScanningStrategyDetector.d.ts.map