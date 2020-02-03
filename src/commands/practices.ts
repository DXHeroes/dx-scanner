import { createRootContainer } from '../inversify.config';
import { Scanner } from '../scanner';
import { PracticeImpact, CLIArgs } from '../model';
import { ReporterData } from '../reporters/ReporterData';

export default class Practices {
  static async run(cmd: CLIArgs) {
    const scanPath = process.cwd();

    const container = createRootContainer({
      uri: scanPath,
      json: cmd.json,
      details: false,
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

    if (cmd.json) {
      // print practices in JSON format
      console.log(JSON.stringify(practicesToReport, null, 2));
    } else {
      console.log(ReporterData.table(['Practice ID', 'Practice Name', 'Practice Impact'], practicesToReport));
    }
  }
}
