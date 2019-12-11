import { TypeScriptUsedPractice } from './JavaScript/TypeScriptUsedPractice';
import { PrettierUsedPractice } from './JavaScript/PrettierUsedPractice';
import { ESLintUsedPractice } from './JavaScript/ESLintUsedPractice';
import { LockfileIsPresentPractice } from './PackageManagement/LockfileIsPresentPractice';
import { JsFrontendTestingFrameworkUsedPractice } from './JavaScript/JsFrontendTestingFrameworkUsedPractice';
import { JsLoggerUsedPractice } from './JavaScript/JsLoggerUsedPractice';
import { LicenseIsPresentPractice } from './LanguageIndependent/LicenseIsPresentPractice';
import { ReadmeIsPresentPractice } from './LanguageIndependent/ReadmeIsPresentPractice';
import { CIUsedPractice } from './LanguageIndependent/CIUsedPractice';
import { JsBackendTestingFrameworkUsedPractice } from './JavaScript/JsBackendTestingFrameworkUsedPractice';
import { JsFEBuildtoolUsedPractice } from './JavaScript/JsFEBuildToolUsedPractice';
import { JsPackageJsonConfigurationSetCorrectlyPractice } from './JavaScript/JsPackageJsonConfigurationSetCorrectlyPractice';
import { JsPackageManagementUsedPractice } from './JavaScript/JsPackageManagementUsedPractice';
import { DeprecatedTSLintPractice } from './JavaScript/DeprecatedTSLintPractice';
import { DockerizationUsedPractice } from './LanguageIndependent/DockerizationUsedPractice';
import { EditorConfigIsPresentPractice } from './LanguageIndependent/EditorConfigIsPresentPractice';
import { GitignoreIsPresentPractice } from './LanguageIndependent/GitignoreIsPresentPractice';
import { JsGitignoreCorrectlySetPractice } from './JavaScript/JsGitignoreCorrectlySetPractice';
import { JavaGitignoreCorrectlySetPractice } from './Java/JavaGitignoreCorrectlySetPractice';
import { DependenciesVersionMajorLevelPractice } from './JavaScript/DependenciesVersionMajorLevel';
import { ESLintWithoutErrorsPractice } from './JavaScript/ESLintWithoutErrorsPractice';
import { TsGitignoreCorrectlySetPractice } from './TypeScript/TsGitignoreCorrectlySetPractice';
import { DoesPullRequestsPractice } from './LanguageIndependent/DoesPullRequests';
import { DependenciesVersionMinorPatchLevelPractice } from './JavaScript/DependenciesVersionMinorPatchLevel';
import { CorrectCommitMessagesPractice } from './LanguageIndependent/CorrectCommitMessagesPractice';
import { TimeToSolvePullRequestsPractice } from './LanguageIndependent/TimeToSolvePullRequestsPractice';

// register practices here
export const practices = [
  TypeScriptUsedPractice,
  PrettierUsedPractice,
  ESLintUsedPractice,
  ESLintWithoutErrorsPractice,
  LockfileIsPresentPractice,
  JsFrontendTestingFrameworkUsedPractice,
  JsBackendTestingFrameworkUsedPractice,
  JsLoggerUsedPractice,
  LicenseIsPresentPractice,
  ReadmeIsPresentPractice,
  CIUsedPractice,
  JsFEBuildtoolUsedPractice,
  JsPackageJsonConfigurationSetCorrectlyPractice,
  JsPackageManagementUsedPractice,
  DeprecatedTSLintPractice,
  DockerizationUsedPractice,
  EditorConfigIsPresentPractice,
  DependenciesVersionMajorLevelPractice,
  DependenciesVersionMinorPatchLevelPractice,
  GitignoreIsPresentPractice,
  JsGitignoreCorrectlySetPractice,
  JavaGitignoreCorrectlySetPractice,
  TsGitignoreCorrectlySetPractice,
  DoesPullRequestsPractice,
  CorrectCommitMessagesPractice,
  TimeToSolvePullRequestsPractice,
];
