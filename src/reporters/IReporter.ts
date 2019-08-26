import { PracticeAndComponent, PracticeImpact, ProjectComponentPlatform } from '../model';
import { ServiceType } from '../detectors/ScanningStrategyDetector';

export interface IReporter {
  report(practicesAndComponents: PracticeAndComponent[]): string;
}

export interface JSONReport {
  repository: RepoInfo[];
  practice: PracticeInfo[];
}

interface PracticeInfo {
  name: string;
  suggestion: string;
  impact: PracticeImpact;
  url: string;
}

interface RepoInfo {
  owner: string;
  repoName: string;
  platform: ProjectComponentPlatform;
  serviceType: ServiceType;
  uri: string;
}
