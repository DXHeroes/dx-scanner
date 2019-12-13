import { IReporter, PracticeWithContextForReporter } from './IReporter';
import { injectable, inject } from 'inversify';
import { Types } from '../types';
import { ArgumentsProvider } from '../scanner';
import { VCSServiceType, GitHubService, IVCSService, BitbucketService } from '../services';
import { CIReporterUtils, CIReporterConfig } from './CIReporterUtils';
import { assertNever } from '../lib/assertNever';
import { debug } from 'debug';
import { CreateUpdatePullRequestComment } from '../services/git/model';

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

  async report(practicesAndComponents: PracticeWithContextForReporter[]): Promise<void> {
    if (!this.config) {
      const msg = 'Your CI provider is not supported yet. Please add a feature request on https://github.com/DXHeroes/dx-scanner/issues';
      this.d(msg);
      console.error(msg);
      return;
    } else if (!this.config.pullRequestId) {
      const msg = "This isn't a pull request.";
      this.d(msg);
      console.info(msg);
      return;
    }

    const reportString = this.buildReport(practicesAndComponents);
    this.d(reportString);
    await this.postMessage(reportString);
  }

  buildReport(practicesAndComponents: PracticeWithContextForReporter[]): string {
    //TODO: build a comment message
    return 'Hello world!';
  }

  private async postMessage(message: string): Promise<CreateUpdatePullRequestComment> {
    //TODO: post to specific service
    let client: IVCSService | undefined;

    switch (this.config!.service) {
      case VCSServiceType.github:
        client = new GitHubService(this.argumentsProvider);
        break;
      case VCSServiceType.bitbucket:
        client = new BitbucketService(this.argumentsProvider);
        break;
      default:
        assertNever(this.config!.service);
    }

    //TODO: override old comment
    // const prComments = await client!.getPullRequestComments(
    //   this.config.repository.owner,
    //   this.config.repository.name,
    //   this.config.pullRequestId!,
    // );

    // post a comment
    return await client!.createPullRequestComment(
      this.config!.repository.owner,
      this.config!.repository.name,
      this.config!.pullRequestId!,
      message,
    );
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
