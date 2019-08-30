import { PracticeAndComponent } from '../model';
import { IReporter, JSONReport } from './IReporter';
import { injectable, inject } from 'inversify';
import { Types } from '../types';
import { ArgumentsProvider } from '../inversify.config';
import _ from 'lodash';

@injectable()
export class JSONReporter implements IReporter {
  private readonly argumentsProvider: ArgumentsProvider;

  constructor(@inject(Types.ArgumentsProvider) argumentsProvider: ArgumentsProvider) {
    this.argumentsProvider = argumentsProvider;
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

    return report;
  }
}
