import { Command, flags } from '@oclif/command';
import { createRootContainer } from '../inversify.config';
import { Scanner } from '../scanner';

export default class Init extends Command {
  static description = 'Initialize DX Scanner configuration.';

  static examples = [`$ dx-scanner init`];

  static flags = {
    help: flags.help({ char: 'h' }),
  };

  async run() {
    const scanPath = process.cwd();

    const container = createRootContainer({
      uri: scanPath,
      json: false,
      auth: undefined,
      ci: false,
      recursive: false,
      fail: 'all',
    });
    const scanner = container.get(Scanner);

    await scanner.init(scanPath);
    process.exit(0);
  }
}
