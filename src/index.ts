import 'reflect-metadata';
import { createRootContainer } from './inversify.config';
import { Scanner, ScanResult } from './scanner/Scanner';
import { Command, flags } from '@oclif/command';
import cli from 'cli-ux';
import { ServiceError, ErrorCode } from './lib/errors';
import updateNotifier from 'update-notifier';
import { ScanningStrategyDetectorUtils } from './detectors/utils/ScanningStrategyDetectorUtils';
import { PracticeImpact } from './model';

class DXScannerCommand extends Command {
  static description = 'Scan your project for possible DX recommendations.';
  static usage = ['[PATH] [OPTIONS]'];

  static flags = {
    // add --version flag to show CLI version
    version: flags.version({ char: 'v', description: 'Output the version number' }),
    help: flags.help({ char: 'h', description: 'Help' }),
    // flag with a value (-n, --name=VALUE)
    authorization: flags.string({
      char: 'a',
      description:
        'Credentials to the repository. (in format "token" or "username:token"; can be set as ENV variable DX_GIT_SERVICE_TOKEN)',
    }),
    json: flags.boolean({ char: 'j', description: 'Print report in JSON' }),
    recursive: flags.boolean({ char: 'r', description: 'Scan all components recursively in all sub folders' }),
    init: flags.boolean({ char: 'i', description: 'Initialize DX Scanner configuration' }),
    fail: flags.string({
      options: ['high', 'medium', 'small', 'off', 'all'],
      description: 'Run scanner in failure mode. Exits process with code 1 for any non-practicing condition of given level.',
    }),
  };

  static args = [{ name: 'path', default: process.cwd() }];

  static aliases = ['dxs', 'dxscanner'];
  static examples = ['dx-scanner', 'dx-scanner ./ --fail=high', 'dx-scanner github.com/DXHeroes/dx-scanner'];

  async run() {
    const { args, flags } = this.parse(DXScannerCommand);
    const scanPath = args.path;

    let authorization = flags.authorization ? flags.authorization : this.loadAuthTokenFromEnvs();
    const json = flags.json ? flags.json : undefined;
    const fail = flags.fail ? <PracticeImpact | 'all'>flags.fail : PracticeImpact.high;

    const notifier = updateNotifier({ pkg: this.config.pjson });
    const hrstart = process.hrtime();

    cli.action.start(`Scanning URI: ${scanPath}`);

    const container = createRootContainer({ uri: scanPath, auth: authorization, json, fail, recursive: flags.recursive });
    const scanner = container.get(Scanner);

    let scanResult: ScanResult;
    try {
      scanResult = await scanner.scan();
    } catch (error) {
      if (error instanceof ServiceError && error.code === ErrorCode.AUTHORIZATION_ERROR) {
        if (ScanningStrategyDetectorUtils.isGitHubPath(scanPath)) {
          authorization = await cli.prompt('Insert your GitHub personal access token. https://github.com/settings/tokens\n', {
            type: 'hide',
          });
        } else if (ScanningStrategyDetectorUtils.isBitbucketPath(scanPath)) {
          authorization = await cli.prompt(
            'Insert your Bitbucket credentials (in format "appPassword" or "username:appPasword"). https://confluence.atlassian.com/bitbucket/app-passwords-828781300.html\n',
            { type: 'hide' },
          );
        }

        const container = createRootContainer({ uri: scanPath, auth: authorization, json, fail, recursive: flags.recursive });
        const scanner = container.get(Scanner);

        scanResult = await scanner.scan();
      } else {
        throw error;
      }
    }
    cli.action.stop();
    notifier.notify({ isGlobal: true });

    const hrend = process.hrtime(hrstart);

    console.info('Scan duration %ds.', hrend[0]);

    if (scanResult.shouldExitOnEnd) {
      process.exit(1);
    }
  }

  /**
   * Loads API token from environment variables
   */
  private loadAuthTokenFromEnvs = (): string | undefined => {
    // eslint-disable-next-line no-process-env
    const ev = process.env;
    return ev.DX_GIT_SERVICE_TOKEN || ev.GITHUB_TOKEN;
  };
}

export = DXScannerCommand;
