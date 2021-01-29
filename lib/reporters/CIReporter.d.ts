import { IReporter, PracticeWithContextForReporter } from './IReporter';
import { ArgumentsProvider } from '../scanner';
import { GitHubService, BitbucketService } from '../services';
import { CreatedUpdatedPullRequestComment } from '../services/git/model';
import { GitLabService } from '../services/gitlab/GitLabService';
import { RepositoryConfig } from '../scanner/RepositoryConfig';
import { ScanningStrategy } from '../detectors';
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