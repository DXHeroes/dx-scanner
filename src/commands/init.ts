import { createRootContainer } from '../inversify.config';
import { Scanner } from '../scanner';
import { PracticeImpact } from '../model';
import path from 'path';

export default class Init {
  static async run(): Promise<void> {
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
