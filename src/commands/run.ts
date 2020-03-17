/* eslint-disable no-process-env */
import 'reflect-metadata';
import cli from 'cli-ux';
import debug from 'debug';
import { createRootContainer } from '../inversify.config';
import { Scanner, ScannerUtils } from '../scanner';
import { CLIArgs } from '../model';
import { ErrorFactory } from '../lib/errors/ErrorFactory';

export default class Run {
  static async run(path = process.cwd(), cmd: CLIArgs) {
    debug('cli')(cmd);
    const scanPath = path;

    const { json, details, fail } = cmd;
    let { authorization } = cmd;

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

    if (scanResult.needsAuth) {
      if (scanResult.isOnline && !cmd.ci) {
        authorization = await ScannerUtils.promptAuthorization(scanPath, scanResult);
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

    const hrend = process.hrtime(hrstart);

    console.info('Scan duration %ds.', hrend[0]);

    if (scanResult.shouldExitOnEnd) {
      process.exit(1);
    }
  }
}
