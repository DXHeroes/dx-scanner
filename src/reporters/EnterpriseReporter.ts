import { inject, injectable } from 'inversify';
import { ReporterUtils } from '.';
import { ArgumentsProvider } from '../scanner';
import { Types } from '../types';
import { PracticeWithContextForReporter, IReporter } from './IReporter';
import { ProjectComponent } from '../model';
import axios from 'axios';
import * as uuid from 'uuid';
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
const pjson = require('../../package.json');

@injectable()
export class EnterpriseReporter implements IReporter {
  private readonly argumentsProvider: ArgumentsProvider;

  constructor(@inject(Types.ArgumentsProvider) argumentsProvider: ArgumentsProvider) {
    this.argumentsProvider = argumentsProvider;
  }

  async report(practicesAndComponents: PracticeWithContextForReporter[]): Promise<void> {
    const reportData = this.buildReport(practicesAndComponents);

    try {
      // send data
      await axios.post('https://provider.dxscanner.io/api/v1/data-report', reportData);
      // TODO: enable logs later, when account is available
      // console.log('You can see DX data in your DX account now.\n');
    } catch (error) {
      // console.log('Your DX data has not been sent to your account.\n');
    }
  }

  buildReport(practicesAndComponents: PracticeWithContextForReporter[]): JSONReportDxScore {
    const componentsWithPractices = ReporterUtils.getComponentsWithPractices(practicesAndComponents);

    const dxScore = ReporterUtils.computeDXScore(practicesAndComponents);
    const report: JSONReportDxScore = { componentsWithDxScore: [] };

    for (const cwp of componentsWithPractices) {
      const dxScoreForComponent = dxScore.components.find((c) => c.path === cwp.component.path)!.value;
      const componentWithScore: ComponentWithDxScore = {
        component: cwp.component,
        dxScore: dxScoreForComponent,
        version: pjson.version,
        id: uuid.v4(),
      };

      report.componentsWithDxScore.push(componentWithScore);
    }

    return report;
  }
}

export type JSONReportDxScore = {
  componentsWithDxScore: ComponentWithDxScore[];
};

export interface ComponentWithDxScore {
  component: ProjectComponent;
  dxScore: string;
  version: string;
  id: string;
}
