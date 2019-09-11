import { PracticeImpact } from '../model';

export interface IConfigProvider {
  init(): Promise<void>;
  getOverridenPractice(practiceId: string): PracticeImpact;
}

export interface Config {
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
  'JavaScript.TypeScriptUsedPractice' = 'JavaScript.TypeScriptUsedPractice',
  'JavaScript.PrettierUsedPractice' = 'JavaScript.PrettierUsedPractice',
  'JavaScript.ESLintUsedPractice' = 'JavaScript.ESLintUsedPractice',
  'LanguageIndependent.LockfileIsPresentPractice' = 'LanguageIndependent.LockfileIsPresentPractice',
  'JavaScript.JsFrontendTestingFrameworkUsedPractice' = 'JavaScript.JsFrontendTestingFrameworkUsedPractice',
  'JavaScript.JsBackendTestingFrameworkUsedPractice' = 'JavaScript.JsBackendTestingFrameworkUsedPractice',
  'JavaScript.JsLoggerUsedPractice' = 'JavaScript.JsLoggerUsedPractice',
  'LanguageIndependent.LicenseIsPresentPractice' = 'LanguageIndependent.LicenseIsPresentPractice',
  'LanguageIndependent.ReadmeIsPresentPractice' = 'LanguageIndependent.ReadmeIsPresentPractice',
  'LanguageIndependent.CIUsedPractice' = 'LanguageIndependent.CIUsedPractice',
  'JavaScript.JsFEBuildtoolUsedPractice' = 'JavaScript.JsFEBuildtoolUsedPractice',
  'JavaScript.JsPackageJsonConfigurationSetCorrectlyPractice' = 'JavaScript.JsPackageJsonConfigurationSetCorrectlyPractice',
  'JavaScript.JsPackageManagementUsedPractice' = 'JavaScript.JsPackageManagementUsedPractice',
  'JavaScript.DeprecatedTSLintPractice' = 'JavaScript.DeprecatedTSLintPractice',
  'LanguageIndependent.DockerizationUsedPractice' = 'LanguageIndependent.DockerizationUsedPractice',
  'LanguageIndependent.EditorConfigIsPresentPractice' = 'LanguageIndependent.EditorConfigIsPresentPractice',
  'LanguageIndependent.DependenciesVersionPractice' = 'LanguageIndependent.DependenciesVersionPractice',
  'JavaScript.JsGitignoreIsPresentPractice' = 'JavaScript.JsGitignoreIsPresentPractice',
  'JavaScript.JsGitignoreCorrectlySetPractice' = 'JavaScript.JsGitignoreCorrectlySetPractice',
  UnitTestPractice = 'UnitTestPractice',
  PullRequestPractice = 'PullRequestPractice',
}
