import {
  PracticeImpact,
  ProjectComponentPlatform,
  ProgrammingLanguage,
  ProjectComponent,
  PracticeMetadata,
  PracticeEvaluationResult,
} from '../model';
import { PracticeData } from '../practices/IPractice';
import { DataReportDto } from './DashboardReporter';

export interface IReporter {
  report(
    practicesAndComponents: PracticeWithContextForReporter[],
    practicesAndComponentsAfterFix?: PracticeWithContextForReporter[],
  ): // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Promise<any>;
  buildReport(
    practicesAndComponents: PracticeWithContextForReporter[],
    practicesAndComponentsAfterFix?: PracticeWithContextForReporter[],
  ): string | JSONReport | Promise<DataReportDto>;
}

export type JSONReport = { uri: string; components: ComponentReport[] };

export interface ComponentReport extends ProjectComponent {
  path: string;
  language: ProgrammingLanguage;
  platform: ProjectComponentPlatform;
  practices: Omit<PracticeMetadata, 'dependsOn' | 'reportOnlyOnce'>[];
}

export interface PracticeWithContextForReporter {
  component: ProjectComponent;
  practice: PracticeMetadata & { data?: PracticeData; fix: boolean };
  overridenImpact: PracticeImpact;
  evaluation: PracticeEvaluationResult;
  evaluationError?: string;
  isOn: boolean;
}

export interface PracticeInfo {
  name: string;
  url: string;
  impact: PracticeImpact;
  suggestion: string;
}
