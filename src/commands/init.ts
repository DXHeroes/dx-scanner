import { createRootContainer } from '../inversify.config';
import { Scanner } from '../scanner';
import { PracticeImpact, CLIArgs } from '../model';
import debug from '../lib/debugWrapper';
import path from 'path';

export default class Init {
  static async run(cmd: CLIArgs): Promise<void> {
    debug('cli')(cmd);
    const scanPath = process.cwd();

    const container = createRootContainer({
      uri: scanPath,
      json: false,
      details: false,
      auth: undefined,
      ci: false,
      recursive: false,
      fail: PracticeImpact.off,
      fix: false,
      fixPattern: undefined,
      html: false,
      apiToken: undefined,
    });
    const scanner = container.get(Scanner);

    await scanner.init(path.normalize(scanPath + path.sep));
  }
}
