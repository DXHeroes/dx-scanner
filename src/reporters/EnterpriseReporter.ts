import { inject, injectable } from 'inversify';
import { ReporterUtils, DXScoreResult } from '.';
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
      await axios.post('https://provider.dxscanner.io/api/v1/data-report', reportData, {
        headers: { Authorization: this.argumentsProvider.apiToken },
      });
      // TODO: enable logs later, when account is available
      // console.log('You can see DX data in your DX account now.\n');
    } catch (error) {
      // console.log('Your DX data has not been sent to your account.\n');
    }
  }

  buildReport(practicesAndComponents: PracticeWithContextForReporter[]): DataReportDto {
    const componentsWithPractices = ReporterUtils.getComponentsWithPractices(practicesAndComponents);

    const dxScore = ReporterUtils.computeDXScore(practicesAndComponents);

    const report: DataReportDto = {
      componentsWithDxScore: [],
      version: pjson.version,
      id: uuid.v4(),
      dxScore: { value: dxScore.value, points: dxScore.points },
    };

    for (const cwp of componentsWithPractices) {
      const dxScoreForComponent = dxScore.components.find((c) => c.path === cwp.component.path)!.value;
      const dxScorePoints = dxScore.components.find((c) => c.path === cwp.component.path)!.points;

      const componentWithScore: ComponentDto = {
        component: cwp.component,
        dxScore: { value: dxScoreForComponent, points: dxScorePoints },
        securityIssues: [],
      };

      report.componentsWithDxScore.push(componentWithScore);
    }

    return report;
  }
}

export type DataReportDto = {
  componentsWithDxScore: ComponentDto[];
  version: string;
  id: string;
  dxScore: DxScoreDto;
};

export interface ComponentDto {
  component: ProjectComponent;
  dxScore: DxScoreDto;
  securityIssues: SecurityIssueDto[];
}

export type SecurityIssueDto = {
  library: string;
  currentVersion: string;
  type: string;
  newestVersion: string;
  severity: SecurityIssueSeverity;
};

export type DxScoreDto = Pick<DXScoreResult, 'value' | 'points'>;

export enum SecurityIssueSeverity {
  Info = 'info',
  Low = 'low',
  Moderate = 'moderate',
  High = 'high',
  Critical = 'critical',
}
