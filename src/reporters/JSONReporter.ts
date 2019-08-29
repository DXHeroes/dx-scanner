import { PracticeAndComponent } from '../model';
import { IReporter, JSONReport } from './IReporter';
import { injectable, inject } from 'inversify';
import { Types } from '../types';
import { ArgumentsProvider } from '../inversify.config';
import _ from 'lodash';
import { FileSystemService } from '../services/FileSystemService';

@injectable()
export class JSONReporter implements IReporter {
  private readonly argumentsProvider: ArgumentsProvider;
  private readonly fileSystemService: FileSystemService;

  constructor(
    @inject(Types.ArgumentsProvider) argumentsProvider: ArgumentsProvider,
    @inject(FileSystemService) fileSystemService: FileSystemService,
  ) {
    this.argumentsProvider = argumentsProvider;
    this.fileSystemService = fileSystemService;
  }

  async report(practicesAndComponents: PracticeAndComponent[]): Promise<JSONReport> {
    const report: JSONReport = {
      uri: this.argumentsProvider.uri,
      components: [],
    };

    for (const pac of practicesAndComponents) {
      let component = _.find(report.components, { path: pac.component.path });
      if (!component) {
        const currentComponentReport = { ...pac.component, practices: [pac.practice] };
        report.components.push(currentComponentReport);
        component = currentComponentReport;
        continue;
      }
      component.practices.push(pac.practice);
    }
    await this.reportInFile(report);

    return report;
  }

  async reportInFile(report: JSONReport) {
    await this.fileSystemService.writeFile(`${process.cwd()}/dxScannerOutput.json`, JSON.stringify(report, null, 4));
  }
}
