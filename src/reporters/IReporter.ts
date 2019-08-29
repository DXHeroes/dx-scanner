import {
  PracticeAndComponent,
  PracticeImpact,
  ProjectComponentPlatform,
  ProgrammingLanguage,
  ProjectComponent,
  PracticeMetadata,
} from '../model';

export interface IReporter {
  report(practicesAndComponents: PracticeAndComponent[]): string | Promise<JSONReport>;
}

export type JSONReport = { uri: string; components: ComponentReport[] };

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
