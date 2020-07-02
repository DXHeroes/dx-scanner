import { inject, injectable } from 'inversify';
import { ReporterUtils, DXScoreResult } from '.';
import { ArgumentsProvider } from '../scanner';
import { Types } from '../types';
import { PracticeWithContextForReporter, IReporter } from './IReporter';
import { ProjectComponent } from '../model';
import axios from 'axios';
import * as uuid from 'uuid';
import { ScanningStrategy } from '../detectors';
import { inspect } from 'util';
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
const pjson = require('../../package.json');

@injectable()
export class DashboardReporter implements IReporter {
  private readonly argumentsProvider: ArgumentsProvider;
  private readonly scanningStrategy: ScanningStrategy;

  constructor(
    @inject(Types.ArgumentsProvider) argumentsProvider: ArgumentsProvider,
    @inject(Types.ScanningStrategy) scanningStrategy: ScanningStrategy,
  ) {
    this.argumentsProvider = argumentsProvider;
    this.scanningStrategy = scanningStrategy;
  }

  async report(practicesAndComponents: PracticeWithContextForReporter[]): Promise<void> {
    // console.log(inspect(practicesAndComponents, true, 5));

    const reportData = this.buildReport(practicesAndComponents);
    try {
      // send data
      // await axios.post('https://provider.dxscanner.io/api/v1/data-report', reportData, {
      //   headers: this.argumentsProvider.apiToken && { Authorization: this.argumentsProvider.apiToken },
      // });
      // TODO: enable logs later, when account is available
      // console.log('You can see DX data in your DX account now.\n');
    } catch (error) {
      // console.log('Your DX data has not been sent to your account.\n');
    }
  }

  buildReport(practicesAndComponents: PracticeWithContextForReporter[]): DataReportDto {
    const componentsWithPractices = ReporterUtils.getComponentsWithPractices(practicesAndComponents, this.scanningStrategy);

    const dxScore = ReporterUtils.computeDXScore(practicesAndComponents, this.scanningStrategy);

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
        updatedDependencies: [],
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
  updatedDependencies: UpdatedDependencyDto[];
}

export type DxScoreDto = Pick<DXScoreResult, 'value' | 'points'>;

//security issues
export type SecurityIssueDto = {
  library: string;
  currentVersion: string;
  type: string;
  newestVersion: string;
  severity: SecurityIssueSeverity;
};

export enum SecurityIssueSeverity {
  Info = 'info',
  Low = 'low',
  Moderate = 'moderate',
  High = 'high',
  Critical = 'critical',
}

//updated dependencies
export type UpdatedDependencyDto = {
  library: string;
  currentVersion: string;
  newestVersion: string;
  severity: UpdatedDependencySeverity;
};

export enum UpdatedDependencySeverity {
  Low = 'low',
  Moderate = 'moderate',
  High = 'high',
}
