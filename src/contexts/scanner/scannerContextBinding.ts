import { Types, ScannerContextFactory } from '../../types';
import { ScanningStrategy, ServiceType } from '../../detectors/ScanningStrategyDetector';
import { ScannerContext } from './ScannerContext';
import { Container } from 'inversify';
import { bindLanguageContext } from '../language/languageContextBinding';
import { JavaScriptLanguageDetector } from '../../detectors/JavaScript/JavaScriptLanguageDetector';
import { FileInspector } from '../../inspectors/FileInspector';
import { FileSystemService } from '../../services/FileSystemService';
import { GitInspector } from '../../inspectors/GitInspector';
import { GitHubService } from '../../services/git/GitHubService';
import { ConfigProvider } from '../ConfigProvider';

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

const createScanningContainer = (scanningStrategy: ScanningStrategy, rootContainer: Container): Container => {
  const container = rootContainer.createChild();
  container.bind(Types.ScanningStrategy).toConstantValue(scanningStrategy);
  bindLanguageDetectors(container);
  bindLanguageContext(container);
  bindFileAccess(scanningStrategy, container);
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
  // TODO: bind services for GitHub strategy
  container
    .bind(Types.IFileInspector)
    .to(FileInspector)
    .inSingletonScope();
};

const bindLanguageDetectors = (container: Container) => {
  container.bind(Types.ILanguageDetector).to(JavaScriptLanguageDetector);
};
