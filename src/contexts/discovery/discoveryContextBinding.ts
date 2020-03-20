import { Container } from 'inversify';
import { DiscoveryContextFactory, Types } from '../../types';
import { RepositoryConfig } from '../discovery/RepositoryConfig';
import { DiscoveryContext } from './DiscoveryContext';

export const bindDiscoveryContext = (container: Container) => {
  container.bind(Types.DiscoveryContextFactory).toFactory(
    (): DiscoveryContextFactory => {
      return (uri: string) => {
        const discoveryContextContainer = createDiscoveryContainer(uri, container);
        return discoveryContextContainer.get(DiscoveryContext);
      };
    },
  );
};

const createDiscoveryContainer = (uri: string, rootContainer: Container): Container => {
  const container = rootContainer.createChild();
  container.bind(Types.RepositoryConfig).toConstantValue(uri);

  return container;
};
