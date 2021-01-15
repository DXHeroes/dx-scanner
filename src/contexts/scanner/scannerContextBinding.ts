import { Container } from 'inversify';
import { BranchesCollector } from '../../collectors/BranchesCollector';
import { ContributorsCollector } from '../../collectors/ContributorsCollector';
import { DataCollector } from '../../collectors/DataCollector';
import { GoLanguageDetector } from '../../detectors/Go/GoLanguageDetector';
import { AccessType, ServiceType } from '../../detectors/IScanningStrategy';
import { JavaLanguageDetector } from '../../detectors/Java/JavaLanguageDetector';
import { JavaScriptLanguageDetector } from '../../detectors/JavaScript/JavaScriptLanguageDetector';
import { PHPLanguageDetector } from '../../detectors/PHP/PHPLanguageDetector';
import { PythonLanguageDetector } from '../../detectors/Python/PythonLanguageDetector';
import { RustLanguageDetector } from '../../detectors/Rust/RustLanguageDetector';
import { ScanningStrategy } from '../../detectors/ScanningStrategyDetector';
import { FileInspector } from '../../inspectors/FileInspector';
import { GitInspector } from '../../inspectors/GitInspector';
import { CIReporter, CLIReporter, DashboardReporter, FixReporter, HTMLReporter, IReporter, JSONReporter } from '../../reporters';
import { ArgumentsProvider } from '../../scanner';
import { GitHubService, BitbucketService } from '../../services';
import { FileSystemService } from '../../services/FileSystemService';
import { GitLabService } from '../../services/gitlab/GitLabService';
import { ScannerContextFactory, Types } from '../../types';
import { bindLanguageContext } from '../language/languageContextBinding';
import { ScannerContext } from './ScannerContext';

export const bindScanningContext = (container: Container) => {
  container.bind(Types.ScannerContextFactory).toFactory(
    (): ScannerContextFactory => {
      return (scanningStrategy: ScanningStrategy) => {
        const scanningContextContainer = createScanningContainer(scanningStrategy, container);
        return scanningContextContainer.get(ScannerContext);
      };
    },
  );
};

const createScanningContainer = (scanningStrategy: ScanningStrategy, discoveryContainer: Container): Container => {
  const container = discoveryContainer.createChild();
  container.bind(Types.ScanningStrategy).toConstantValue(scanningStrategy);
  const args = container.get<ArgumentsProvider>(Types.ArgumentsProvider);
  bindLanguageDetectors(container);
  bindLanguageContext(container);
  bindFileAccess(scanningStrategy, container);

  bindReporters(container, args, scanningStrategy);
  bindCollectors(container, args, scanningStrategy.accessType);
  container.bind(ScannerContext).toSelf();
  return container;
};

const bindFileAccess = (scanningStrategy: ScanningStrategy, container: Container) => {
  if (scanningStrategy.localPath) {
    container.bind(Types.FileInspectorBasePath).toConstantValue(scanningStrategy.localPath);
    container.bind(Types.IProjectFilesBrowser).to(FileSystemService);
    container.bind(Types.RepositoryPath).toConstantValue(scanningStrategy.localPath);
    container.bind(Types.IGitInspector).to(GitInspector);
  }
  if (scanningStrategy.serviceType === ServiceType.github) {
    container.bind(Types.IContentRepositoryBrowser).to(GitHubService);
  }
  if (scanningStrategy.serviceType === ServiceType.bitbucket) {
    container.bind(Types.IContentRepositoryBrowser).to(BitbucketService);
  }
  if (scanningStrategy.serviceType === ServiceType.gitlab) {
    container.bind(Types.IContentRepositoryBrowser).to(GitLabService);
  }
  container.bind(Types.IFileInspector).to(FileInspector).inSingletonScope();
};

const bindCollectors = (container: Container, args: ArgumentsProvider, accessType: AccessType | undefined) => {
  if ((accessType !== AccessType.public && args.apiToken) || accessType === AccessType.public) {
    container.bind(ContributorsCollector).toSelf().inSingletonScope();
    container.bind(BranchesCollector).toSelf().inSingletonScope();
    container.bind(DataCollector).toSelf().inSingletonScope();
  }
};

const bindReporters = (
  container: Container,
  args: ArgumentsProvider,
  { accessType, localPath }: Pick<ScanningStrategy, 'accessType' | 'localPath'>,
) => {
  if (args.json) {
    container.bind<IReporter>(Types.IReporter).to(JSONReporter);
  } else if (args.html) {
    container.bind<IReporter>(Types.IReporter).to(HTMLReporter);
  } else if (args.fix && !localPath) {
    // fix only local runs
    container.bind<IReporter>(Types.IReporter).to(FixReporter);
  } else {
    container.bind<IReporter>(Types.IReporter).to(CLIReporter);
  }

  if (args.ci) {
    container.bind<IReporter>(Types.IReporter).to(CIReporter);
  }

  if ((accessType !== AccessType.public && args.apiToken) || accessType === AccessType.public) {
    container.bind<IReporter>(Types.IReporter).to(DashboardReporter);
  }
};

const bindLanguageDetectors = (container: Container) => {
  container.bind(Types.ILanguageDetector).to(JavaScriptLanguageDetector);
  container.bind(Types.ILanguageDetector).to(JavaLanguageDetector);
  container.bind(Types.ILanguageDetector).to(PythonLanguageDetector);
  container.bind(Types.ILanguageDetector).to(GoLanguageDetector);
  container.bind(Types.ILanguageDetector).to(PHPLanguageDetector);
  container.bind(Types.ILanguageDetector).to(RustLanguageDetector);
};
