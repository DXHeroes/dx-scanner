"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Types = void 0;
exports.Types = {
    //NEW TYPES
    ILanguageDetector: Symbol('ILanguageDetector'),
    IProjectComponentDetector: Symbol('IProjectComponentDetector'),
    ProjectComponentDetectorFactory: Symbol('Factory<ProjectComponentDetector>'),
    ScannerContextFactory: Symbol('Factory<ScannerContext>'),
    LanguageContextFactory: Symbol('Factory<LanguageContext>'),
    ProjectComponentContextFactory: Symbol('Factory<ProjectComponentContext>'),
    ScanningStrategyDetector: Symbol('ScanningStrategyDetector'),
    PracticeContextFactory: Symbol('Factory<PracticeContext>'),
    DiscoveryContextFactory: Symbol('Factory<DiscoveryContext>'),
    //Useful constants
    //Discovery context level
    RepositoryConfig: Symbol('RepositoryConfig'),
    //Scanner context level
    ScanningStrategy: Symbol('ScanningStrategy'),
    FileInspectorBasePath: Symbol('FileInspectorBasePath'),
    IGitInspector: Symbol('IGitInspector'),
    ICollaborationInspector: Symbol('ICollaborationInspector'),
    IIssueTrackingInspector: Symbol('IIssueTrackingInspector'),
    IContentRepositoryBrowser: Symbol('IContentRepositoryBrowser'),
    IFileInspector: Symbol('IFileInspector'),
    IRootFileInspector: Symbol('IRootFileInspector'),
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
    ConfigProvider: Symbol('ConfigProvider'),
    JSONReporter: Symbol('JSONReporter'),
};
//# sourceMappingURL=types.js.map