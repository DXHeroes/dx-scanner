import { Container } from 'inversify';
import { createRootContainer } from '../inversify.config';
import { Scanner } from './Scanner';

describe('Scanner', () => {
  let rootContainer: Container;

  beforeEach(() => {
    rootContainer = createRootContainer({ uri: '.' });
  });

  it('Can be instantiated from container', () => {
    const scanner = rootContainer.get(Scanner);
    expect(scanner).toBeDefined();
  });

  /*
    Other tests are missing. They have to be either heavily mocked or
    we have to wait for other components to be finished to write the integration tests.
    (Scanner class is a integration point)
  */
});
