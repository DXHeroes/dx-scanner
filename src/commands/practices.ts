import 'reflect-metadata';
import { Command, flags } from '@oclif/command';
import { createRootContainer } from '../inversify.config';
import { Scanner } from '../scanner';
import { PracticeImpact } from '../model';
import { ReporterData } from '../reporters/ReporterData';

export default class PracticesCommand extends Command {
  static description = 'List all practices id with name and impact.';

  static flags = {
    help: flags.help({ char: 'h' }),
    json: flags.boolean({ char: 'j', description: 'Print practices in JSON' }),
  };

  async run() {
    const { flags } = this.parse(PracticesCommand);
    const scanPath = process.cwd();

    const container = createRootContainer({
      uri: scanPath,
      json: flags.json,
      auth: undefined,
      ci: false,
      recursive: false,
      fail: PracticeImpact.off,
      fix: false,
      fixPattern: undefined,
    });

    const scanner = container.get(Scanner);

    const practices = scanner.listPractices();
    const practicesToReport = practices.map((p) => {
      return {
        id: p.getMetadata().id,
        name: p.getMetadata().name,
        impact: p.getMetadata().impact,
      };
    });

    if (flags.json) {
      // print practices in JSON format
      console.log(JSON.stringify(practicesToReport, null, 2));
    } else {
      console.log(ReporterData.table(['PRACTICE ID', 'PRACTICE NAME', 'PRACTICE IMPACT'], practicesToReport));
    }
  }
}
