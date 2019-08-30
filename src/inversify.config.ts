import { Container } from 'inversify';
import { Scanner } from './scanner/Scanner';
import { Types } from './types';
import { IReporter } from './reporters/IReporter';
import { CLIReporter } from './reporters/CLIReporter';
import { practices } from './practices';
import { ScanningStrategyDetector } from './detectors/ScanningStrategyDetector';
import { bindScanningContext } from './contexts/scanner/scannerContextBinding';
import { FileSystemService } from './services/FileSystemService';
import { GitHubService } from './services/git/GitHubService';
import { PracticeContext } from './contexts/practice/PracticeContext';
import { IPackageInspector } from './inspectors/IPackageInspector';
import { IFileInspector } from './inspectors/IFileInspector';
import { ProgrammingLanguage, ProjectComponentType, ProjectComponentPlatform, ProjectComponentFramework, ProjectComponent } from './model';
import { JavaScriptPackageInspector } from './inspectors/package/JavaScriptPackageInspector';
import { packageJSONContents } from './detectors/__MOCKS__';
import { IPracticeWithMetadata } from './practices/DxPracticeDecorator';
import { ScannerUtils } from './scanner/ScannerUtils';
import { FileInspector } from './inspectors/FileInspector';
import { IssueTrackingInspector } from './inspectors/IssueTrackingInspector';
import { CollaborationInspector } from './inspectors/CollaborationInspector';
import { DirectoryJSON } from 'memfs/lib/volume';
import { JSONReporter } from './reporters/JSONReporter';

export const createRootContainer = (args: ArgumentsProvider): Container => {
  const container = new Container();
  bindScanningStrategyDetectors(container);
  bindScanningContext(container);
  args.json ? container.bind<IReporter>(Types.IReporter).to(JSONReporter) : container.bind<IReporter>(Types.IReporter).to(CLIReporter);
  container.bind(Types.ArgumentsProvider).toConstantValue(args);
  container.bind(Scanner).toSelf();
  container.bind(FileSystemService).toSelf();
  container.bind(GitHubService).toSelf();
  // register practices
  practices.forEach((practice) => {
    container.bind<IPracticeWithMetadata>(Types.Practice).toConstantValue(ScannerUtils.initPracticeWithMetadata(practice));
  });
  return container;
};

const bindScanningStrategyDetectors = (container: Container) => {
  container.bind(ScanningStrategyDetector).toSelf();
};

export const createTestContainer = (
  args?: ArgumentsProvider,
  structure?: DirectoryJSON,
  projectComponent?: ProjectComponent,
): TestContainerContext => {
  const container = createRootContainer(args ? args : { uri: './' });

  if (!structure) {
    structure = {
      '/package.json': packageJSONContents,
    };
  }

  const vfss = new FileSystemService({ isVirtual: true });
  vfss.setFileSystem(structure);

  // FileSystemService as default ProjectBrowser
  container.bind(Types.IProjectFilesBrowser).toConstantValue(vfss);
  container.bind(Types.IContentRepositoryBrowser).to(GitHubService);
  container.bind(Types.IFileInspector).to(FileInspector);
  container.bind(Types.IIssueTrackingInspector).to(IssueTrackingInspector);
  container.bind(Types.ICollaborationInspector).to(CollaborationInspector);
  container.bind(Types.IPackageInspector).to(JavaScriptPackageInspector);

  const scanningStrategyDetector = container.get<ScanningStrategyDetector>(ScanningStrategyDetector);
  const fileSystemService = container.get<FileSystemService>(FileSystemService);
  const fileInspector = container.get<IFileInspector>(Types.IFileInspector);
  const issueTrackingInspector = container.get<IssueTrackingInspector>(Types.IIssueTrackingInspector);
  const collaborationInspector = container.get<CollaborationInspector>(Types.ICollaborationInspector);
  const virtualFileSystemService = container.get<FileSystemService>(Types.IProjectFilesBrowser);
  const packageInspector = container.get<IPackageInspector>(Types.IPackageInspector);

  /**
   * Practice context for testing purposes
   */
  const practiceContext: PracticeContext = {
    projectComponent: projectComponent || {
      path: './',
      language: ProgrammingLanguage.JavaScript,
      type: ProjectComponentType.Application,
      platform: ProjectComponentPlatform.UNKNOWN,
      framework: ProjectComponentFramework.UNKNOWN,
    },
    packageInspector,
    gitInspector: undefined,
    issueTrackingInspector,
    collaborationInspector,
    fileInspector,
  };

  return {
    container,
    practiceContext,
    scanningStrategyDetector,
    fileSystemService,
    virtualFileSystemService,
  };
};

export interface TestContainerContext {
  container: Container;
  practiceContext: PracticeContext;
  scanningStrategyDetector: ScanningStrategyDetector;

  /**
   * Services
   */
  fileSystemService: FileSystemService;
  virtualFileSystemService: FileSystemService;
}

export interface TestPracticeContext extends PracticeContext {
  packageInspector: IPackageInspector;
  fileInspector: IFileInspector;
  issueTrackingInspector: IssueTrackingInspector;
  collaborationInspector: CollaborationInspector;
}

export interface ArgumentsProvider {
  uri: string;
  auth?: string;
  json?: boolean;
}
