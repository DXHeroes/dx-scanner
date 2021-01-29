import { DXScoreResult } from '.';
import { ScanningStrategy } from '../detectors';
import { ProjectComponent } from '../model';
import { ArgumentsProvider } from '../scanner';
import { IReporter, PracticeWithContextForReporter } from './IReporter';
import { ServiceType } from '../detectors/IScanningStrategy';
import { DataCollector, CollectorsData } from '../collectors/DataCollector';
export declare class DashboardReporter implements IReporter {
    private readonly argumentsProvider;
    private readonly scanningStrategy;
    private readonly dataCollector;
    constructor(argumentsProvider: ArgumentsProvider, scanningStrategy: ScanningStrategy, dataCollector: DataCollector);
    report(practicesAndComponents: PracticeWithContextForReporter[]): Promise<void>;
    buildReport(practicesAndComponents: PracticeWithContextForReporter[]): Promise<DataReportDto>;
}
export declare type DataReportDto = {
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
export declare type DxScoreDto = Pick<DXScoreResult, 'value' | 'points'>;
export declare type SecurityIssueDto = {
    library: string;
    type: string;
    severity: SecurityIssueSeverity;
    vulnerableVersions: string;
    patchedIn: string;
    dependencyOf: string;
    path: string;
};
export declare type SecurityIssueSummaryDto = {
    info: number;
    low: number;
    moderate: number;
    high: number;
    critical: number;
    code: number;
};
export declare enum SecurityIssueSeverity {
    Info = "info",
    Low = "low",
    Moderate = "moderate",
    High = "high",
    Critical = "critical"
}
export declare type UpdatedDependencyDto = {
    library: string;
    currentVersion: string;
    newestVersion: string;
    severity: UpdatedDependencySeverity;
};
export declare enum UpdatedDependencySeverity {
    Low = "low",
    Moderate = "moderate",
    High = "high"
}
export declare type LinterIssueDto = {
    filePath: string;
    url: string;
    type: string;
    severity: LinterIssueSeverity;
};
export declare enum LinterIssueSeverity {
    Warning = "warning",
    Error = "error"
}
export declare type PullRequestDto = {
    id: number;
    url: string;
    name: string;
    createdAt: string;
    updatedAt: string | null;
    closedAt: string | null;
    mergedAt: string | null;
    authorName: string | null;
    authorUrl: string | null;
};
//# sourceMappingURL=DashboardReporter.d.ts.map