import axios from 'axios';
import { inject, injectable } from 'inversify';
import * as uuid from 'uuid';
import { DXScoreResult, ReporterUtils } from '.';
import { ScanningStrategy } from '../detectors';
import { ProjectComponent } from '../model';
import { ArgumentsProvider } from '../scanner';
import { Types } from '../types';
import { IReporter, PracticeWithContextForReporter } from './IReporter';
import { PkgToUpdate } from '../practices/utils/DependenciesVersionEvaluationUtils';
import { ServiceType } from '../detectors/IScanningStrategy';
import { GitServiceUtils } from '../services';
import { DataCollector, CollectorsData } from '../collectors/DataCollector';
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
const pjson = require('../../package.json');

@injectable()
export class DashboardReporter implements IReporter {
  private readonly argumentsProvider: ArgumentsProvider;
  private readonly scanningStrategy: ScanningStrategy;
  private readonly dataCollector: DataCollector;

  constructor(
    @inject(Types.ArgumentsProvider) argumentsProvider: ArgumentsProvider,
    @inject(Types.ScanningStrategy) scanningStrategy: ScanningStrategy,
    @inject(DataCollector) dataCollector: DataCollector,
  ) {
    this.argumentsProvider = argumentsProvider;
    this.scanningStrategy = scanningStrategy;
    this.dataCollector = dataCollector;
  }

  async report(practicesAndComponents: PracticeWithContextForReporter[]): Promise<void> {
    const reportData = await this.buildReport(practicesAndComponents);
    try {
      // send data
      await axios.post('https://provider.dxscanner.io/api/v1/data-report', reportData, {
        headers: this.argumentsProvider.apiToken && { Authorization: this.argumentsProvider.apiToken },
      });
      // TODO: enable logs later, when account is available
      // console.log('You can see DX data in your DX account now.\n');
    } catch (error) {
      // console.log('Your DX data has not been sent to your account.\n');
    }
  }

  async buildReport(practicesAndComponents: PracticeWithContextForReporter[]): Promise<DataReportDto> {
    const componentsWithPractices = ReporterUtils.getComponentsWithPractices(practicesAndComponents, this.scanningStrategy);

    const dxScore = ReporterUtils.computeDXScore(practicesAndComponents, this.scanningStrategy);

    const report: DataReportDto = {
      componentsWithDxScore: [],
      collectorsData: await this.dataCollector.collectData(this.scanningStrategy),
      version: pjson.version,
      id: uuid.v4(),
      dxScore: { value: dxScore.value, points: dxScore.points },
    };

    for (const cwp of componentsWithPractices) {
      let updatedDependencies: PkgToUpdate[] = [];
      let securityIssues: SecurityIssueDto[] = [];
      let linterIssues: LinterIssueDto[] = [];
      let pullRequests: PullRequestDto[] = [];

      const dxScoreForComponent = dxScore.components.find((c) => c.path === cwp.component.path)!.value;
      const dxScorePoints = dxScore.components.find((c) => c.path === cwp.component.path)!.points;

      for (const p of cwp.practicesAndComponents) {
        updatedDependencies = [...updatedDependencies, ...(p.practice.data?.statistics?.updatedDependencies || [])];
        securityIssues = [...securityIssues, ...(p.practice.data?.statistics?.securityIssues?.issues || [])];
        pullRequests = [...pullRequests, ...(p.practice.data?.statistics?.pullRequests || [])];
        linterIssues = [
          ...linterIssues,
          ...(p.practice.data?.statistics?.linterIssues?.map((issue) => {
            return {
              ...issue,
              filePath: issue.filePath.replace(this.scanningStrategy.rootPath || '', ''),
              url: GitServiceUtils.getUrlToRepo(p.component.repositoryPath!, this.scanningStrategy, issue.url),
            };
          }) || []),
        ];
      }

      const componentWithScore: ComponentDto = {
        component: cwp.component,
        dxScore: { value: dxScoreForComponent, points: dxScorePoints },
        serviceType: <ServiceType>this.scanningStrategy.serviceType,
        securityIssues,
        updatedDependencies,
        linterIssues,
        pullRequests,
      };

      report.componentsWithDxScore.push(componentWithScore);
    }

    return report;
  }
}

export type DataReportDto = {
  componentsWithDxScore: ComponentDto[];
  collectorsData: CollectorsData;
  version: string;
  id: string;
  dxScore: DxScoreDto;
};

export interface ComponentDto {
  component: ProjectComponent;
  dxScore: DxScoreDto;
  serviceType: ServiceType;
  securityIssues: SecurityIssueDto[];
  updatedDependencies: UpdatedDependencyDto[];
  linterIssues: LinterIssueDto[];
  pullRequests: PullRequestDto[];
}

export type DxScoreDto = Pick<DXScoreResult, 'value' | 'points'>;

//security issues
export type SecurityIssueDto = {
  library: string;
  type: string;
  severity: SecurityIssueSeverity;
  vulnerableVersions: string;
  patchedIn: string;
  dependencyOf: string;
  path: string;
};

export type SecurityIssueSummaryDto = {
  info: number;
  low: number;
  moderate: number;
  high: number;
  critical: number;
  code: number;
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

//linter issues
export type LinterIssueDto = {
  filePath: string;
  url: string;
  type: string;
  severity: LinterIssueSeverity;
};

export enum LinterIssueSeverity {
  Warning = 'warning',
  Error = 'error',
}

//pull requests
export type PullRequestDto = {
  id: number;
  url: string;
  name: string;
  createdAt: string;
  updatedAt: string | null;
  closedAt: string | null;
  mergedAt: string | null;
  authorName: string;
  authorUrl: string;
};
