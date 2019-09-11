import {
  PracticeAndComponent,
  PracticeImpact,
  ProjectComponentPlatform,
  ProgrammingLanguage,
  ProjectComponent,
  PracticeMetadata,
} from '../model';

export interface IReporter {
  report(practicesAndComponents: PracticeAndComponent[], practicesOff?: string[]): string | JSONReport;
}

export type JSONReport = { uri: string; components: ComponentReport[]; practicesOff?: string[] };

export interface ComponentReport extends ProjectComponent {
  path: string;
  language: ProgrammingLanguage;
  platform: ProjectComponentPlatform;
  practices: Omit<PracticeMetadata, 'dependsOn' | 'reportOnlyOnce'>[];
}

export interface PracticeInfo {
  name: string;
  url: string;
  impact: PracticeImpact;
  suggestion: string;
}
