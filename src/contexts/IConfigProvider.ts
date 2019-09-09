import { PracticeImpact } from '../model';

export interface IConfigProvider {
  init(): Promise<void>;
  getOverridenPractice(practiceId: string): PracticeImpact;
}

export interface IConfig {
  practices?: {
    [key in Practices]?: PracticeImpact;
  };
  tokens?: {
    [key in Service]: string;
  };
}

enum Service {
  Slack = 'Slack',
}

enum Practices {
  PullRequestPractice = 'PullRequestPractice',
  TypeScriptUsedPractice = 'TypeScriptUsedPractice',
  PrettierUsedPractice = 'PrettierUsedPractice',
  ESLintUsedPractice = 'ESLintUsedPractice',
  LockfileIsPresentPractice = 'LockfileIsPresentPractice',
  UnitTestPractice = 'UnitTestPractice',
  JsFrontendTestingFrameworkUsedPractice = 'JsFrontendTestingFrameworkUsedPractice',
  JsBackendTestingFrameworkUsedPractice = 'JsBackendTestingFrameworkUsedPractice',
  JsLoggerUsedPractice = 'JsLoggerUsedPractice',
  LicenseIsPresentPractice = 'LicenseIsPresentPractice',
  ReadmeIsPresentPractice = 'ReadmeIsPresentPractice',
  CIUsedPractice = 'CIUsedPractice',
  JsFEBuildtoolUsedPractice = 'JsFEBuildtoolUsedPractice',
  JsPackageJsonConfigurationSetCorrectlyPractice = 'JsPackageJsonConfigurationSetCorrectlyPractice',
  JsPackageManagementUsedPractice = 'JsPackageManagementUsedPractice',
  DeprecatedTSLintPractice = 'DeprecatedTSLintPractice',
  DockerizationUsedPractice = 'DockerizationUsedPractice',
  EditorConfigIsPresentPractice = 'EditorConfigIsPresentPractice',
  DependenciesVersionPractice = 'DependenciesVersionPractice',
  JsGitignoreIsPresentPractice = 'JsGitignoreIsPresentPractice',
  JsGitignoreCorrectlySetPractice = 'JsGitignoreCorrectlySetPractice',
}
