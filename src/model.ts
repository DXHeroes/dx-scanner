// New model starts here

export interface LanguageAtPath {
  /**
   * Base path in repository to the located language
   */
  path: string;
  /**
   * Language detected
   */
  language: ProgrammingLanguage;
}

export interface ProjectComponent {
  /**
   * The path to the url repository. If remote url is known, it is preferred over local path
   */
  repositoryPath?: string;

  /**
   * Base path in repository of the component
   */
  path: string;
  /**
   * Language used for this component
   */
  language: ProgrammingLanguage;
  /**
   * Type of the component (Application, Library, Docs...)
   */
  type: ProjectComponentType;
  /**
   * Platform of the component (Backend, Frontend, iOS)
   */
  platform: ProjectComponentPlatform;
  /**
   * Framework used to write the component
   * TODO: This could be splitted per language.
   */
  framework: ProjectComponentFramework;
}

export enum ProgrammingLanguage {
  CPlusPlus = 'C++',
  CSharp = 'C#',
  Java = 'Java',
  Kotlin = 'Kotlin',
  Swift = 'Swift',
  Ruby = 'Ruby',
  Groovy = 'Groovy',
  JavaScript = 'JavaScript',
  TypeScript = 'TypeScript',
  Go = 'Go',
  Clojure = 'Clojure',
  Haskell = 'Haskell',
  Elixir = 'Elixir',
  UNKNOWN = 'UNKNOWN',
}

// Old model starts here

export interface ScannerConfig {
  repositories: Repository[];
}

export interface Repository {
  url: string;
  authString?: string;
}

export interface Project {
  components: DeprecatedProjectComponent[];
}

/**
 * @deprecated
 */
export interface DeprecatedProjectComponent {
  githubUrl?: string;
  path: string;
  git?: GitInfo;
  language: ProgrammingLanguage;
  type: ProjectComponentType;
  platform: ProjectComponentPlatform;
  framework: ProjectComponentFramework;
  packageManagement?: PackageManagement;
  testing: TestingInfo;
}

export interface PracticeMetadata {
  id: string;
  name: string;
  suggestion: string;
  impact: PracticeImpact;
  url: string;
  reportOnlyOnce?: boolean;
  dependsOn?: { [key in PracticeEvaluationResult]?: string[] };
}

export enum PracticeImpact {
  medium = 'medium',
  small = 'small',
  hint = 'hint',
  high = 'high',
}

export enum PracticeEvaluationResult {
  practicing = 'practicing',
  notPracticing = 'notPracticing',
  unknown = 'unknown',
}

export interface GitInfo {
  activeContributorsCount: number;
  pullRequests: boolean;
  codeReview: boolean;
  flowType: GitFLow;
}

export interface TestingInfo {
  unitTestFramework?: UnitTestFramework;
  integrationTestFramework?: IntegrationTestFramework;
  e2eTestFramework?: E2ETestFramework;
  hasCodeCoverage: boolean;
  codeCoveragePercentage?: number;
}

export enum E2ETestFramework {
  Nightwatch = 'Nightwatch.js',
  Selenium = 'Selenium',
  UNKNOWN = 'UNKNOWN',
}

export enum UnitTestFramework {
  Jest = 'Jest',
  spec = 'spec',
  JUnit = 'JUnit',
  UNKNOWN = 'UNKNOWN',
}

export enum IntegrationTestFramework {
  newman = 'newman',
  pact = 'pact',
  UNKNOWN = 'UNKNOWN',
}

export interface PackageManagement {
  framework: PackageManagementFramework;
  hasLockfile: boolean;
  packages: { [packageName: string]: PackageDependency };
}

export interface PackageDependency {
  name: string;
  versionString?: string | undefined;
}

export enum PackageManagementFramework {
  Bundler = 'Bundler',
  NPM = 'NPM',
  Yarn = 'Yarn',
  Cocoapods = 'Cocoapods',
  Carthage = 'Carthage',
  Maveb = 'Maven',
  UNKNOWN = 'UNKNOWN',
}

export enum ProjectComponentFramework {
  RubyOnRails = 'RubyOnRails',
  React = 'React',
  Angular = 'Angular',
  ReactNative = 'ReactNative',
  Xamarin = 'Xamarin',
  Express = 'Express',
  UNKNOWN = 'UNKNOWN',
}

export enum ProjectComponentPlatform {
  BackEnd = 'BackEnd',
  FrontEnd = 'FrontEnd',
  iOS = 'iOS',
  Android = 'Android',
  MobileMultiplatform = 'MobileMultiplatform',
  UNKNOWN = 'UNKNOWN',
}

export enum ProjectComponentType {
  Application = 'Application',
  Library = 'Library',
  Documentation = 'Documentation',
  UNKNOWN = 'UNKNOWN',
}

export enum GitFLow {
  UNKNOWN = 'UNKNOWN',
  Github = 'Github',
  Git = 'Git',
}

export interface PracticeAndComponent {
  practice: PracticeMetadata;
  component: ProjectComponent;
}
