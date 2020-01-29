/* eslint-disable no-process-env */
import 'reflect-metadata';
import cli from 'cli-ux';
import debug from 'debug';
import updateNotifier from 'update-notifier';
import { createRootContainer } from '../inversify.config';
import { Scanner } from '../scanner';
import { ScanningStrategyDetectorUtils } from '../detectors/utils/ScanningStrategyDetectorUtils';
import { ServiceType } from '../detectors';
import { CLIArgs } from '../model';

export default class Run {
  static async run(path = process.cwd(), cmd: CLIArgs) {
    debug('cli cfg')(cmd);
    const scanPath = path;

    const { json, details, fail } = cmd;
    let { authorization } = cmd;

    // const notifier = updateNotifier({ pkg: 'dx-scanner' });
    const hrstart = process.hrtime();

    cli.action.start(`Scanning URI: ${scanPath}`);

    const container = createRootContainer({
      uri: scanPath,
      auth: authorization,
      json,
      details,
      fail,
      recursive: cmd.recursive,
      ci: cmd.ci,
      fix: cmd.fix,
      fixPattern: cmd.fixPattern,
    });
    const scanner = container.get(Scanner);

    let scanResult = await scanner.scan();

    if (scanResult.needsAuth && !cmd.ci) {
      if (ScanningStrategyDetectorUtils.isGitHubPath(scanPath) || scanResult.serviceType === ServiceType.github) {
        authorization = await cli.prompt('Insert your GitHub personal access token. https://github.com/settings/tokens\n', {
          type: 'hide',
        });
      } else if (ScanningStrategyDetectorUtils.isBitbucketPath(scanPath) || scanResult.serviceType === ServiceType.bitbucket) {
        authorization = await cli.prompt(
          'Insert your Bitbucket credentials (in format "appPassword" or "username:appPasword"). https://confluence.atlassian.com/bitbucket/app-passwords-828781300.html\n',
          { type: 'hide' },
        );
      }

      const container = createRootContainer({
        uri: scanPath,
        auth: authorization,
        json,
        details,
        fail,
        recursive: cmd.recursive,
        ci: cmd.ci,
        fix: cmd.fix,
        fixPattern: cmd.fixPattern,
      });
      const scanner = container.get(Scanner);

      scanResult = await scanner.scan({ determineRemote: false });
    }
    cli.action.stop();
    // notifier.notify({ isGlobal: true });

    const hrend = process.hrtime(hrstart);

    console.info('Scan duration %ds.', hrend[0]);

    if (scanResult.shouldExitOnEnd) {
      process.exit(1);
    }
  }

  // /**
  //  * Loads API token from environment variables
  //  */
  // private static loadAuthTokenFromEnvs = (): string | undefined => {
  //   // eslint-disable-next-line no-process-env
  //   const ev = process.env;
  //   return ev.DX_GIT_SERVICE_TOKEN || ev.GITHUB_TOKEN;
  // };
}
