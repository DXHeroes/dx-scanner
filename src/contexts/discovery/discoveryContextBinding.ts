import { Container } from 'inversify';
import { DiscoveryContextFactory, Types } from '../../types';
import { RepositoryConfig } from './RepositoryConfig';

export const bindDiscoveryContext = (container: Container) => {
  container.bind(Types.DiscoveryContextFactory).toFactory(
    (): DiscoveryContextFactory => {
      return (url: string) => {
        const discoveryContextContainer = createDiscoveryContainer(url, container);
        return discoveryContextContainer.get(RepositoryConfig);
      };
    },
  );
};

const createDiscoveryContainer = (url: string, rootContainer: Container): Container => {
  const container = rootContainer.createChild();
  container.bind(Types.RepositoryConfig).toConstantValue(url);

  return container;
};
