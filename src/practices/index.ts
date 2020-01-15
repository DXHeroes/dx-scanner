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
import { JavaDependenciesVersionMajorLevel } from './Java/JavaDependenciesVersionMajorLevel';
import { JavaDependenciesVersionMinorPatchLevel } from './Java/JavaDependenciesVersionMinorPatchLevel';
import { TimeToSolvePullRequestsPractice } from './LanguageIndependent/TimeToSolvePullRequestsPractice';
import { TimeToSolveIssuesPractice } from './LanguageIndependent/TimeToSolveIssuesPractice';
import { ThinPullRequestsPractice } from './LanguageIndependent/ThinPullRequestsPractice';
import { SecurityVulnerabilitiesPractice } from './JavaScript/SecurityVulnerabilitiesPractice';
import { FirstTestPractice, SecondTestPractice, InvalidTestPractice } from '../scanner';

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
  JavaDependenciesVersionMajorLevel,
  JavaDependenciesVersionMinorPatchLevel,
  GitignoreIsPresentPractice,
  JsGitignoreCorrectlySetPractice,
  JavaGitignoreCorrectlySetPractice,
  TsGitignoreCorrectlySetPractice,
  DoesPullRequestsPractice,
  CorrectCommitMessagesPractice,
  TimeToSolvePullRequestsPractice,
  TimeToSolveIssuesPractice,
  ThinPullRequestsPractice,
  SecurityVulnerabilitiesPractice,
  // Practices for testing purpose only
  FirstTestPractice,
  SecondTestPractice,
];
