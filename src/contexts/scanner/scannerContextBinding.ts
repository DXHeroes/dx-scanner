import { Container } from 'inversify';
import { JavaScriptLanguageDetector } from '../../detectors/JavaScript/JavaScriptLanguageDetector';
import { JavaLanguageDetector } from '../../detectors/Java/JavaLanguageDetector';
import { ScanningStrategy, ServiceType } from '../../detectors/ScanningStrategyDetector';
import { FileInspector } from '../../inspectors/FileInspector';
import { GitInspector } from '../../inspectors/GitInspector';
import { FileSystemService } from '../../services/FileSystemService';
import { GitHubService } from '../../services/git/GitHubService';
import { ScannerContextFactory, Types } from '../../types';
import { bindLanguageContext } from '../language/languageContextBinding';
import { ScannerContext } from './ScannerContext';
import { BitbucketService } from '../../services/bitbucket/BitbucketService';
import { GitLabService } from '../../services/gitlab/GitLabService';
import { PythonLanguageDetector } from '../../detectors/Python/PythonLanguageDetector';
import { ArgumentsProvider } from '../../scanner';
import { IReporter, FixReporter, JSONReporter, CLIReporter, CIReporter } from '../../reporters';
import { ReporterCollectData } from '../../reporters/ReporterCollectData';

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
  bindReporters(container, args);
  container.bind(ScannerContext).toSelf();
  return container;
};

const bindFileAccess = (scanningStrategy: ScanningStrategy, container: Container) => {
  if (scanningStrategy.localPath) {
    container.bind(Types.FileInspectorBasePath).toConstantValue(scanningStrategy.localPath);
    container.bind(Types.IProjectFilesBrowser).to(FileSystemService);
  }
  if (scanningStrategy.serviceType === ServiceType.git && scanningStrategy.localPath) {
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
  container
    .bind(Types.IFileInspector)
    .to(FileInspector)
    .inSingletonScope();
};

const bindReporters = (container: Container, args: ArgumentsProvider) => {
  if (args.fix) {
    container.bind<IReporter>(Types.IReporter).to(FixReporter);
    return;
  }
  if (args.json) {
    container.bind<IReporter>(Types.IReporter).to(JSONReporter);
  } else {
    container.bind<IReporter>(Types.IReporter).to(CLIReporter);
  }

  if (args.ci) {
    container.bind<IReporter>(Types.IReporter).to(CIReporter);
  }
  container.bind<IReporter>(Types.IReporter).to(ReporterCollectData);
};

const bindLanguageDetectors = (container: Container) => {
  container.bind(Types.ILanguageDetector).to(JavaScriptLanguageDetector);
  container.bind(Types.ILanguageDetector).to(JavaLanguageDetector);
  container.bind(Types.ILanguageDetector).to(PythonLanguageDetector);
};
