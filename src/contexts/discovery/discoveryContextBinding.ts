import { Container } from 'inversify';
import { DiscoveryContextFactory, Types } from '../../types';
import { RepositoryConfig } from '../../scanner/RepositoryConfig';
import { bindScanningContext } from '../scanner/scannerContextBinding';
import { GitHubService, BitbucketService } from '../../services';
import { GitLabService } from '../../services/gitlab/GitLabService';
import { ScanningStrategyDetector } from '../../detectors';
import { DiscoveryContext } from './DiscoveryContext';

export const bindDiscoveryContext = (container: Container) => {
  container.bind(Types.DiscoveryContextFactory).toFactory(
    (): DiscoveryContextFactory => {
      return (repositoryConfig: RepositoryConfig) => {
        const discoveryContextContainer = createDiscoveryContainer(repositoryConfig, container);
        return discoveryContextContainer.get(DiscoveryContext);
      };
    },
  );
};

const createDiscoveryContainer = (repositoryConfig: RepositoryConfig, rootContainer: Container): Container => {
  const container = rootContainer.createChild();
  container.bind(Types.RepositoryConfig).toConstantValue(repositoryConfig);

  container.bind(ScanningStrategyDetector).toSelf();

  container.bind(GitHubService).toSelf();
  container.bind(BitbucketService).toSelf();
  container.bind(GitLabService).toSelf();

  container.bind(DiscoveryContext).toSelf();

  bindScanningContext(container);

  return container;
};
