import 'reflect-metadata';
import { createRootContainer } from './inversify.config';
import { Scanner, ScanResult } from './scanner/Scanner';
import { Command, flags } from '@oclif/command';
import cli from 'cli-ux';
import { ServiceError } from './lib/errors';
import updateNotifier from 'update-notifier';
import { ScanningStrategyDetectorUtils } from './detectors/utils/ScanningStrategyDetectorUtils';
import { PracticeImpact } from './model';
// import { ScanningStrategyDetectorUtils } from './utils/ScanningStrategyDetectorUtils';

class DXScannerCommand extends Command {
  static description = 'Scan your project for possible DX recommendations.';
  static usage = ['[PATH] [OPTIONS]'];

  static flags = {
    // add --version flag to show CLI version
    version: flags.version({ char: 'v', description: 'output the version number' }),
    help: flags.help({ char: 'h', description: 'Help' }),
    // flag with a value (-n, --name=VALUE)
    authorization: flags.string({ char: 'a', description: 'Credentials to the repository.' }),
    json: flags.boolean({ char: 'j', description: 'Print report in JSON' }),
    init: flags.boolean({ char: 'i', description: 'Initialize DX Scanner configuration' }),
    fail: flags.string({
      options: ['high', 'medium', 'small', 'off', 'all'],
      description: 'Run scanner in failure mode.',
    }),
  };

  static args = [{ name: 'path', default: process.cwd() }];

  static aliases = ['dxs', 'dxscanner'];
  static examples = ['dx-scanner', 'dx-scanner ./ --fail=high', 'dx-scanner github.com/DXHeroes/dx-scanner'];

  async run() {
    const { args, flags } = this.parse(DXScannerCommand);
    const scanPath = args.path;

    let authorization = flags.authorization ? flags.authorization : undefined;
    const json = flags.json ? flags.json : undefined;
    const fail = flags.fail ? <PracticeImpact | 'all'>flags.fail : PracticeImpact.high;

    const notifier = updateNotifier({ pkg: this.config.pjson });
    const hrstart = process.hrtime();

    cli.action.start(`Scanning URI: ${scanPath}`);

    const container = createRootContainer({ uri: scanPath, auth: authorization, json, fail });
    const scanner = container.get(Scanner);

    let scanResult: ScanResult;
    try {
      scanResult = await scanner.scan();
    } catch (error) {
      if (error instanceof ServiceError) {
        ScanningStrategyDetectorUtils.isGitHubPath(scanPath)
          ? (authorization = await cli.prompt('Insert your GitHub personal access token.\nhttps://github.com/settings/tokens\n'))
          : (authorization = await cli.prompt(
              'Insert your Bitbucket app password.\nhttps://confluence.atlassian.com/bitbucket/app-passwords-828781300.html\n',
            ));

        const container = createRootContainer({ uri: scanPath, auth: authorization, json: json });
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
}

export = DXScannerCommand;
