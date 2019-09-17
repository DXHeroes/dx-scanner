import 'reflect-metadata';
import { createRootContainer } from './inversify.config';
import { Scanner } from './scanner/Scanner';
import { Command, flags } from '@oclif/command';
import cli from 'cli-ux';

class DXScannerCommand extends Command {
  static description = 'Scan your project for possible DX recommendations.';

  static flags = {
    // add --version flag to show CLI version
    version: flags.version({ char: 'v', description: 'Current version' }),
    help: flags.help({ char: 'h', description: 'Help' }),
    // flag with a value (-n, --name=VALUE)
    authorization: flags.string({ char: 'a', description: 'Credentials to the repository.' }),
    // flag with no value (-f, --force)
    force: flags.boolean({ char: 'f' }),
    json: flags.boolean({ char: 'j', description: 'Output in JSON' }),
  };

  static args = [{ name: 'path' }];

  async run() {
    const { args, flags } = this.parse(DXScannerCommand);
    let authorization = flags.authorization ? flags.authorization : undefined;
    const json = flags.json ? flags.json : undefined;

    // const name = flags.name || 'world';
    // this.log(`hello ${name} from ./src/index.ts`);
    // if (args.file && flags.force) {
    //   this.log(`you input --force and --file: ${args.file}`);
    // }

    const scanPath = args.path || process.cwd();
    cli.action.start(`Scanning URI: ${scanPath}`);

    const container = createRootContainer({ uri: scanPath, auth: authorization, json: json });
    const scanner = container.get(Scanner);

    try {
      await scanner.scan();
    } catch (error) {
      authorization = await cli.prompt('Insert your GitHub personal access token.\nhttps://github.com/settings/tokens\n');

      const container = createRootContainer({ uri: scanPath, auth: authorization });
      const scanner = container.get(Scanner);

      await scanner.scan();
    }

    cli.action.stop();
  }
}

export = DXScannerCommand;
