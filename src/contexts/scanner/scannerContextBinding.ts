import { Container } from 'inversify';
import { JavaScriptLanguageDetector } from '../../detectors/JavaScript/JavaScriptLanguageDetector';
import { ScanningStrategy, ServiceType } from '../../detectors/ScanningStrategyDetector';
import { FileInspector } from '../../inspectors/FileInspector';
import { GitInspector } from '../../inspectors/GitInspector';
import { FileSystemService } from '../../services/FileSystemService';
import { GitHubService } from '../../services/git/GitHubService';
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
  container
    .bind(Types.IFileInspector)
    .to(FileInspector)
    .inSingletonScope();
};

const bindLanguageDetectors = (container: Container) => {
  container.bind(Types.ILanguageDetector).to(JavaScriptLanguageDetector);
};
