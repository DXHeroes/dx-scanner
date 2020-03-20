import { Container } from 'inversify';
import { DirectoryJSON } from 'memfs/lib/volume';
import { ProgrammingLanguage, ProjectComponent, ProjectComponentFramework, ProjectComponentPlatform, ProjectComponentType } from './model';
import { practices } from './practices';
import { IPracticeWithMetadata } from './practices/DxPracticeDecorator';
import { Types } from './types';
import { IReporter, JSONReporter, CLIReporter, CIReporter, FixReporter } from './reporters';
import { ScanningStrategyDetector } from './detectors';
import {
  FileInspector,
  IssueTrackingInspector,
  CollaborationInspector,
  JavaScriptPackageInspector,
  IFileInspector,
  IPackageInspector,
} from './inspectors';
import { bindScanningContext } from './contexts/scanner/scannerContextBinding';
import { Scanner, ScannerUtils } from './scanner';
import { FileSystemService, GitHubService } from './services';
import { BitbucketService } from './services/bitbucket/BitbucketService';
import { ICollaborationInspector } from './inspectors/ICollaborationInspector';
import { IIssueTrackingInspector } from './inspectors/IIssueTrackingInspector';
import { PracticeContext } from './contexts/practice/PracticeContext';
import { packageJSONContents } from './detectors/__MOCKS__/JavaScript/packageJSONContents.mock';
import { argumentsProviderFactory } from './test/factories/ArgumentsProviderFactory';
import { ArgumentsProvider } from './scanner';
import { bindDiscoveryContext } from './contexts/discovery/discoveryContextBinding';
import { ScanningStrategyExplorer } from './scanner/ScanningStrategyExplorer';

export const createRootContainer = (args: ArgumentsProvider): Container => {
  const container = new Container();
  container.bind(Types.ArgumentsProvider).toConstantValue(args);
  container.bind(ScanningStrategyExplorer).toSelf();
  bindDiscoveryContext(container);

  container.bind(Scanner).toSelf();
  container.bind(FileSystemService).toSelf();

  // container.bind(GitHubService).toSelf();
  // container.bind(BitbucketService).toSelf();
  // container.bind(GitLabService).toSelf();

  // register practices
  practices.forEach((practice) => {
    container.bind<IPracticeWithMetadata>(Types.Practice).toConstantValue(ScannerUtils.initPracticeWithMetadata(practice));
  });
  return container;
};

export const createTestContainer = (
  args?: Partial<ArgumentsProvider>,
  structure?: DirectoryJSON,
  projectComponent?: ProjectComponent,
): TestContainerContext => {
  const container = createRootContainer(argumentsProviderFactory(args));

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
  container.bind(Types.IPackageInspector).to(JavaScriptPackageInspector);
  container.bind(Types.ICollaborationInspector).to(CollaborationInspector);
  container.bind(Types.IIssueTrackingInspector).to(IssueTrackingInspector);

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
    root: { fileInspector },
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
  issueTrackingInspector: IIssueTrackingInspector;
  collaborationInspector: ICollaborationInspector;
}
