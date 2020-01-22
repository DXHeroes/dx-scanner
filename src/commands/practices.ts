import { Command, flags } from '@oclif/command';
import { createRootContainer } from '../inversify.config';
import { Scanner } from '../scanner';
import { PracticeImpact } from '../model';

export default class Practices extends Command {
  static description = 'List all practices id with name and impact.';

  static examples = [`$ dx-scanner practices`];

  static flags = {
    help: flags.help({ char: 'h' }),
    json: flags.boolean({ char: 'j', description: 'Print practices in JSON' }),
  };

  async run() {
    const { flags } = this.parse(Practices);

    const scanPath = process.cwd();
    const json = flags.json;

    const container = createRootContainer({
      uri: scanPath,
      json,
      auth: undefined,
      ci: false,
      recursive: false,
      fail: 'all',
    });
    const scanner = container.get(Scanner);

    const practices = await scanner.getPractices();
    const practicesToReport: PracticeToReport[] = [];
    practices.forEach((practice) => {
      const practiceId: string = practice.getMetadata().id;
      practicesToReport.push({
        [practiceId]: { name: practice.getMetadata().name, impact: practice.getMetadata().impact },
      });
    });
    if (flags.json) {
      // print practices in JSON format
      console.log(JSON.stringify(practicesToReport, null, 2));
    } else {
      console.log(practicesToReport);
    }
    process.exit(0);
  }
}

interface PracticeToReport {
  [id: string]: {
    name: string;
    impact: PracticeImpact;
  };
}
