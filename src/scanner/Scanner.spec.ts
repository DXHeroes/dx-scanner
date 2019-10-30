import { createRootContainer, createTestContainer, TestContainerContext } from '../inversify.config';
import { Container } from 'inversify';
import { Scanner } from './Scanner';
import { practiceWithContextFactory } from '../../test/factories/PracticeWithContextFactory';
import { PracticeEvaluationResult } from '../model';

describe('Scanner', () => {
  let rootContainer: Container;
  let containerCtx: TestContainerContext;

  beforeEach(() => {
    rootContainer = createRootContainer({ uri: '.' });
  });

  beforeAll(async () => {
    containerCtx = createTestContainer();
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
