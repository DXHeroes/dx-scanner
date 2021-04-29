import { ScanningStrategy } from '../detectors';
import { ArgumentsProvider } from '../scanner';
import { RepositoryConfig } from '../scanner/RepositoryConfig';
import { BitbucketService, GitHubService } from '../services';
import { CreatedUpdatedPullRequestComment } from '../services/git/model';
import { GitLabService } from '../services/gitlab/GitLabService';
import { IReporter, PracticeWithContextForReporter } from './IReporter';
export declare class CIReporter implements IReporter {
    private readonly argumentsProvider;
    private readonly repositoryConfig;
    private readonly scanningStrategy;
    private readonly gitHubService;
    private readonly bitbucketService;
    private readonly gitLabService;
    private config;
    private readonly d;
    constructor(argumentsProvider: ArgumentsProvider, repositoryConfig: RepositoryConfig, scanningStrategy: ScanningStrategy, gitHubService: GitHubService, bitbucketService: BitbucketService, gitLabService: GitLabService);
    report(practicesAndComponents: PracticeWithContextForReporter[]): Promise<CreatedUpdatedPullRequestComment | undefined>;
    buildReport(practicesAndComponents: PracticeWithContextForReporter[]): string;
    private postMessage;
    private detectConfiguration;
}
//# sourceMappingURL=CIReporter.d.ts.map