import { IReporter, PracticeWithContextForReporter } from './IReporter';
import { injectable, inject } from 'inversify';
import { Types } from '../types';
import { ArgumentsProvider } from '../scanner';
import { VCSServiceType, GitHubService, IVCSService, BitbucketService } from '../services';
import { CIReporterUtils, CIReporterConfig } from './CIReporterUtils';
import { assertNever } from '../lib/assertNever';
import { debug } from 'debug';
import { CreatedUpdatedPullRequestComment, PullRequestComment } from '../services/git/model';
import { CIReportBuilder } from './builders/CIReportBuilder';
import { ScanningStrategyDetectorUtils } from '../detectors/utils/ScanningStrategyDetectorUtils';
import _ from 'lodash';

@injectable()
export class CIReporter implements IReporter {
  private readonly argumentsProvider: ArgumentsProvider;
  private config: CIReporterConfig | undefined;
  private d: debug.Debugger;

  constructor(@inject(Types.ArgumentsProvider) argumentsProvider: ArgumentsProvider) {
    this.d = debug('CIReporter');
    this.argumentsProvider = argumentsProvider;
    this.config = this.detectConfiguration();
    this.d(this.config);
  }

  async report(practicesAndComponents: PracticeWithContextForReporter[]): Promise<CreatedUpdatedPullRequestComment | undefined> {
    if (!this.config) {
      const msg = 'Your CI provider is not supported yet. Please add a feature request on https://github.com/DXHeroes/dx-scanner/issues';
      this.d(msg);
      return;
    } else if (!this.config.pullRequestId) {
      const msg = "This isn't a pull request.";
      this.d(msg);
      return;
    } else if (!ScanningStrategyDetectorUtils.isLocalPath(this.argumentsProvider.uri)) {
      const msg = 'CIReporter works only for local path';
      this.d(msg);
      return;
    }

    const reportString = this.buildReport(practicesAndComponents);
    this.d(reportString);
    return this.postMessage(reportString).catch((error) => {
      this.d(error.message);
      if (error.code === 401 || error.code === 404 || error.code === 403) {
        return undefined;
      }
      throw error;
    });
  }

  buildReport(practicesAndComponents: PracticeWithContextForReporter[]): string {
    const builder = new CIReportBuilder(practicesAndComponents);
    return builder.build();
  }

  private async postMessage(message: string): Promise<CreatedUpdatedPullRequestComment> {
    let client: IVCSService | undefined;

    switch (this.config!.service) {
      case VCSServiceType.github:
        client = new GitHubService(this.argumentsProvider);
        break;
      case VCSServiceType.bitbucket:
        client = new BitbucketService(this.argumentsProvider);
        break;
      default:
        return assertNever(this.config!.service);
    }

    // try to find last report comment
    let prComments: PullRequestComment[] = [];

    let hasNextPage = true;
    let page = 1;
    while (hasNextPage) {
      const res = await client.listPullRequestComments(
        this.config!.repository.owner,
        this.config!.repository.name,
        this.config!.pullRequestId!,
        { pagination: { page, perPage: 50 } },
      );
      prComments = _.concat(prComments, res.items);
      hasNextPage = res.hasNextPage;
      page++;
    }
    this.d(prComments);

    const ciReporterComments = prComments.filter((c) => c.body?.includes(CIReportBuilder.ciReportIndicator));

    let comment: CreatedUpdatedPullRequestComment | undefined;
    if (ciReporterComments.length > 0) {
      // update comment if already exists
      comment = await client.updatePullRequestComment(
        this.config!.repository.owner,
        this.config!.repository.name,
        ciReporterComments[ciReporterComments.length - 1].id,
        message,
      );
    } else {
      // post a comment
      comment = await client.createPullRequestComment(
        this.config!.repository.owner,
        this.config!.repository.name,
        this.config!.pullRequestId!,
        message,
      );
    }

    this.d(comment);
    return comment;
  }

  private detectConfiguration(): CIReporterConfig | undefined {
    // eslint-disable-next-line no-process-env
    const ev = process.env;

    if (ev.TRAVIS && ev.TRAVIS_REPO_SLUG) {
      // detect Travis config
      this.d('Is Travis');
      return CIReporterUtils.loadConfigurationTravis();
    } else if (ev.APPVEYOR === 'True' || ev.APPVEYOR === 'true') {
      // detect Appveyor config
      this.d('Is Appveyor');
      return CIReporterUtils.loadConfigurationAppveyor();
    } else if (ev.GITHUB_ACTIONS === 'true') {
      // detect GitHub Actions config
      this.d('Is Github');
      return CIReporterUtils.loadConfigurationGitHubActions();
    } else if (ev.BITBUCKET_BUILD_NUMBER) {
      // detect Bitbucket config
      this.d('Is Bitbucket');
      return CIReporterUtils.loadConfigurationBitbucket();
    } else {
      // not supported yet
      this.d('Is undefined CI');
      return undefined;
    }
  }
}
