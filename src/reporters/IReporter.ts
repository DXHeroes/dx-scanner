import {
  PracticeImpact,
  ProjectComponentPlatform,
  ProgrammingLanguage,
  ProjectComponent,
  PracticeMetadata,
  PracticeEvaluationResult,
} from '../model';
import { PracticeWithContext } from '../scanner/Scanner';

export interface IReporter {
  report(practicesAndComponents: PracticeWithContextForReporter[]): string | JSONReport;
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
  practice: PracticeMetadata;
  impact: PracticeImpact;
  evaluation: PracticeEvaluationResult;
  isOn: boolean;
}

export interface PracticeInfo {
  name: string;
  url: string;
  impact: PracticeImpact;
  suggestion: string;
}
