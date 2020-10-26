import debug from '../lib/debugWrapper';
import { createRootContainer } from '../inversify.config';
import { Scanner } from '../scanner';
import { PracticeImpact, CLIArgs } from '../model';
import { ReporterData } from '../reporters/ReporterData';
import logfile from '../lib/logfile';

export default class Practices {
  static async run(cmd: CLIArgs): Promise<void> {
    debug('cli')(cmd);
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
      html: cmd.html,
      apiToken: undefined,
    });

    const scanner = container.get(Scanner);

    const practices = scanner.listPractices();
    const practicesToReport = practices.map((p) => {
      return {
        id: p.getMetadata().id,
        name: p.getMetadata().name,
        impact: p.getMetadata().impact,
        url: p.getMetadata().url,
      };
    });

    const msg = cmd.json
      ? // print practices in JSON format
        JSON.stringify(practicesToReport, null, 2)
      : ReporterData.table(['Practice ID', 'Practice Name', 'Practice Impact', 'URL'], practicesToReport);

    logfile.log(msg);
    console.log(msg);
  }
}
