import { PracticeAndComponent, PracticeImpact, ProjectComponentPlatform, ProgrammingLanguage } from '../model';
import { ServiceType } from '../detectors/ScanningStrategyDetector';

export interface IReporter {
  report(practicesAndComponents: PracticeAndComponent[]): string;
}

export type JSONReport = { components: ComponentReport[] };

export interface ComponentReport {
  path: string;
  platform: ProjectComponentPlatform;
  serviceType: ServiceType;
  uri: string;
  language: ProgrammingLanguage;
  practices: PracticeInfo[];
}

export interface PracticeInfo {
  name: string;
  suggestion: string;
  impact: PracticeImpact;
  url: string;
}
