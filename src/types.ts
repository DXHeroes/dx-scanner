import { Repository, ProgrammingLanguage, LanguageAtPath, ProjectComponent } from './model';
import { Git } from './services/git/Git';
import { ScanningStrategy } from './detectors/ScanningStrategyDetector';
import { ScannerContext } from './contexts/scanner/ScannerContext';
import { LanguageContext } from './contexts/language/LanguageContext';
import { IProjectComponentDetector } from './detectors/IProjectComponentDetector';
import { PracticeContext } from './contexts/practice/PracticeContext';
import { ProjectComponentContext } from './contexts/projectComponent/ProjectComponentContext';

export const Types = {
  //NEW TYPES
  ILanguageDetector: Symbol('ILanguageDetector'),
  IProjectComponentDetector: Symbol('IProjectComponentDetector'),
  ProjectComponentDetectorFactory: Symbol('Factory<ProjectComponentDetector>'),
  ScannerContextFactory: Symbol('Factory<ScannerContext>'),
  LanguageContextFactory: Symbol('Factory<LanguageContext>'),
  ProjectComponentContextFactory: Symbol('Factory<ProjectComponentContext>'),
  ScanningStrategyDetector: Symbol('ScanningStrategyDetector'),
  PracticeContextFactory: Symbol('Factory<PracticeContext>'),
  //Useful constants
  //Scanner context level
  ScanningStrategy: Symbol('ScanningStrategy'),
  FileInspectorBasePath: Symbol('FileInspectorBasePath'),
  IGitInspector: Symbol('IGitInspector'),
  ICollaborationInspector: Symbol('ICollaborationInspector'),
  IIssueTrackingInspector: Symbol('IIssueTrackingInspector'),
  IContentRepositoryBrowser: Symbol('IContentRepositoryBrowser'),
  IFileInspector: Symbol('IFileInspector'),
  IProjectFilesBrowser: Symbol('IProjectFilesBrowser'),
  RepositoryPath: Symbol('RepositoryPath'),
  //Language context level
  LanguageAtPath: Symbol('LanguageAtPath'),
  InitiableInspector: Symbol('InitiableInspector'),
  IPackageInspector: Symbol('IPackageInspector'),
  //ProjectComponent level
  ProjectComponent: Symbol('ProjectComponent'),
  //OLD TYPES
  GitFactory: Symbol('Factory<Git>'),
  PracticeCheckerFactory: Symbol('Factory<IPracticeChecker>'),
  GitCache: Symbol('GitCache'),
  IOutput: Symbol('IOutput'),

  ArgumentsProvider: Symbol('ArgumentsProvider'),
  Practice: Symbol('Practice'),
  IReporter: Symbol('IReporter'),
};

export type GitFactory = (repository: Repository) => Git;
export type ScannerContextFactory = (scanningStrategy: ScanningStrategy) => ScannerContext;
export type LanguageContextFactory = (languageAtPath: LanguageAtPath) => LanguageContext;
export type ProjectComponentContextFactory = (component: ProjectComponent) => ProjectComponentContext;
export type ProjectComponentDetectorFactory = (language: ProgrammingLanguage) => IProjectComponentDetector[];
export type PracticeContextFactory = (projectComponent: ProjectComponent) => PracticeContext;
