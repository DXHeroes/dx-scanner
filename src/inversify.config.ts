import { Container } from 'inversify';
import { DirectoryJSON } from 'memfs/lib/volume';
import {
  ProgrammingLanguage,
  ProjectComponent,
  ProjectComponentFramework,
  ProjectComponentPlatform,
  ProjectComponentType,
  PracticeImpact,
} from './model';
import { practices } from './practices';
import { IPracticeWithMetadata } from './practices/DxPracticeDecorator';
import { Types } from './types';
import { IReporter, JSONReporter, CLIReporter } from './reporters';
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

export const createRootContainer = (args: ArgumentsProvider): Container => {
  const container = new Container();
  bindScanningStrategyDetectors(container);
  bindScanningContext(container);

  if (args.json) {
    container.bind<IReporter>(Types.IReporter).to(JSONReporter);
  } else {
    container.bind<IReporter>(Types.IReporter).to(CLIReporter);
  }

  if (args.ci) {
    container.bind<IReporter>(Types.IReporter).to(JSONReporter);
  }

  container.bind(Types.ArgumentsProvider).toConstantValue(args);
  container.bind(Scanner).toSelf();
  container.bind(FileSystemService).toSelf();
  container.bind(GitHubService).toSelf();
  container.bind(BitbucketService).toSelf();
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
  const container = createRootContainer({
    ...{ uri: './', auth: undefined, json: false, fail: PracticeImpact.high, recursive: true, ci: false },
    ...args,
  });

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

export interface ArgumentsProvider {
  uri: string;
  auth: string | undefined;
  json: boolean | undefined;
  fail: PracticeImpact | 'all';
  recursive: boolean;
  ci: boolean;
}
