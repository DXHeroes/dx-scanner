import path from 'path';
import { debugLog } from '../detectors/utils';
import { createRootContainer } from '../inversify.config';
import { CLIArgs, PracticeImpact } from '../model';
import { Scanner } from '../scanner';

export default class Init {
  static async run(cmd: CLIArgs): Promise<void> {
    debugLog('cli')(cmd);
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
