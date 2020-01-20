import { Command, flags } from '@oclif/command';

export default class Practices extends Command {
  static description = 'describe the command here';

  static examples = [
    `$ example-multi-ts hello
  hello world from ./src/hello.ts!
  `,
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({ char: 'n', description: 'name to print' }),
    // flag with no value (-f, --force)
    force: flags.boolean({ char: 'f' }),
  };

  static args = [{ name: 'path', default: process.cwd() }];

  async run() {
    const { args, flags } = this.parse(Practices);

    const name = flags.name || 'world';
    this.log(`This is name: ${name} `);
    this.log(`Log all practices`);
    // if (args.file && flags.force) {
    //   this.log(`you input --force and --file: ${args.file}`);
    // }
  }
}
