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
import { JsGitignoreIsPresentPractice } from './JavaScript/JsGitignoreIsPresentPractice';
import { JsGitignoreCorrectlySetPractice } from './JavaScript/JsGitignoreCorrectlySetPractice';
import { DependenciesVersionPractice } from './JavaScript/DependenciesVersionPractice';
import { ESLintWithoutErrorsPractice } from './JavaScript/ESLintWithoutErrorsPractice';

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
  DependenciesVersionPractice,
  JsGitignoreIsPresentPractice,
  JsGitignoreCorrectlySetPractice,
];
