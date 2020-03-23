import { Container } from 'inversify';
import { DirectoryJSON } from 'memfs/lib/volume';
import { bindDiscoveryContext } from './contexts/discovery/discoveryContextBinding';
import { PracticeContext } from './contexts/practice/PracticeContext';
import { ScanningStrategyDetector } from './detectors';
import { packageJSONContents } from './detectors/__MOCKS__/JavaScript/packageJSONContents.mock';
import {
  CollaborationInspector,
  FileInspector,
  IFileInspector,
  IPackageInspector,
  IssueTrackingInspector,
  JavaScriptPackageInspector,
} from './inspectors';
import { ICollaborationInspector } from './inspectors/ICollaborationInspector';
import { IIssueTrackingInspector } from './inspectors/IIssueTrackingInspector';
import { ProgrammingLanguage, ProjectComponent, ProjectComponentFramework, ProjectComponentPlatform, ProjectComponentType } from './model';
import { practices } from './practices';
import { IPracticeWithMetadata } from './practices/DxPracticeDecorator';
import { ArgumentsProvider, Scanner, ScannerUtils } from './scanner';
import { ScanningStrategyExplorer } from './scanner/ScanningStrategyExplorer';
import { FileSystemService, GitHubService, BitbucketService } from './services';
import { argumentsProviderFactory } from './test/factories/ArgumentsProviderFactory';
import { Types } from './types';
import { RepositoryConfig } from './scanner/RepositoryConfig';
import { GitLabService } from './services/gitlab/GitLabService';

export const createRootContainer = (args: ArgumentsProvider): Container => {
  const container = new Container();
  container.bind(Types.ArgumentsProvider).toConstantValue(args);
  container.bind(ScanningStrategyExplorer).toSelf();
  bindDiscoveryContext(container);

  container.bind(Scanner).toSelf();
  container.bind(FileSystemService).toSelf();

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

  const repositoryConfig: RepositoryConfig = {
    baseUrl: undefined,
    host: undefined,
    protocol: undefined,
    remoteUrl: undefined,
  };

  // FileSystemService as default ProjectBrowser
  container.bind(Types.RepositoryConfig).toConstantValue(repositoryConfig);
  container.bind(Types.IProjectFilesBrowser).toConstantValue(vfss);
  container.bind(Types.IContentRepositoryBrowser).to(GitHubService);
  container.bind(Types.IFileInspector).to(FileInspector);
  container.bind(Types.IPackageInspector).to(JavaScriptPackageInspector);
  container.bind(Types.ICollaborationInspector).to(CollaborationInspector);
  container.bind(Types.IIssueTrackingInspector).to(IssueTrackingInspector);
  container.bind(ScanningStrategyDetector).toSelf();

  container.bind(GitHubService).toSelf();
  container.bind(BitbucketService).toSelf();
  container.bind(GitLabService).toSelf();

  const scanningStrategyExplorer = container.get<ScanningStrategyExplorer>(ScanningStrategyExplorer);
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
    scanningStrategyExplorer,
    fileSystemService,
    virtualFileSystemService,
    scanningStrategyDetector,
  };
};

export interface TestContainerContext {
  container: Container;
  practiceContext: PracticeContext;
  scanningStrategyExplorer: ScanningStrategyExplorer;
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
