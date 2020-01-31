import { createRootContainer, createTestContainer, TestContainerContext } from '../inversify.config';
import { Scanner } from './Scanner';
import { FileSystemService } from '../services/FileSystemService';
import { argumentsProviderFactory } from '../test/factories/ArgumentsProviderFactory';
import { ESLintWithoutErrorsPractice } from '../practices/JavaScript/ESLintWithoutErrorsPractice';
import { PracticeEvaluationResult } from '../model';

describe('Scanner', () => {
  let containerCtx: TestContainerContext;

  beforeEach(() => {
    containerCtx = createTestContainer({ uri: '.' });
  });

  afterEach(async () => {
    containerCtx.virtualFileSystemService.clearFileSystem();
    containerCtx.practiceContext.fileInspector!.purgeCache();
  });

  it('Can be instantiated from container', () => {
    const rootContainer = createRootContainer(argumentsProviderFactory({ uri: '.' }));
    const scanner = rootContainer.get(Scanner);
    expect(scanner).toBeDefined();
  });

  /*
    Other tests are missing. They have to be either heavily mocked or
    we have to wait for other components to be finished to write the integration tests.
    (Scanner class is a integration point)
  */

  describe('#init', () => {
    it('configuration can be initialized', async () => {
      containerCtx.container.rebind(FileSystemService).toConstantValue(containerCtx.virtualFileSystemService);
      const scanner = containerCtx.container.get(Scanner);

      let exists = await containerCtx.virtualFileSystemService.exists('/.dxscannerrc.yaml');
      expect(exists).toEqual(false);

      await scanner.init('/');

      exists = await containerCtx.virtualFileSystemService.exists('/.dxscannerrc.yaml');
      expect(exists).toEqual(true);
    });

    it('configuration file is not created if a similar file exists', async () => {
      containerCtx.container.rebind(FileSystemService).toConstantValue(containerCtx.virtualFileSystemService);
      const scanner = containerCtx.container.get(Scanner);

      containerCtx.virtualFileSystemService.setFileSystem({
        '/.dxscannerrc.json': '',
      });

      let exists = await containerCtx.virtualFileSystemService.exists('/.dxscannerrc.json');
      expect(exists).toEqual(true);

      exists = await containerCtx.virtualFileSystemService.exists('/.dxscannerrc.yaml');
      expect(exists).toEqual(false);

      await scanner.init('/');

      exists = await containerCtx.virtualFileSystemService.exists('/.dxscannerrc.yaml');
      expect(exists).toEqual(false);
    });
  });

  it('runs fix when fix flag set to true', async () => {
    jest.setTimeout(20000);
    const fixMock = jest.fn();
    containerCtx = createTestContainer({ fix: true });
    ESLintWithoutErrorsPractice.prototype.fix = fixMock;
    ESLintWithoutErrorsPractice.prototype.evaluate = () => Promise.resolve(PracticeEvaluationResult.notPracticing);
    containerCtx.container.bind('ESLintWithoutErrorsPractice').to(ESLintWithoutErrorsPractice);
    const scanner = containerCtx.container.get(Scanner);

    await scanner.scan({ determineRemote: false });

    expect(fixMock).toBeCalled();
  });
  it('fix settings from config works', async () => {
    jest.setTimeout(15000);
    const fixMock = jest.fn();
    // containerCtx.container.bind(FileSystemService).toConstantValue(containerCtx.virtualFileSystemService);
    containerCtx = createTestContainer({ fix: true });
    containerCtx.virtualFileSystemService.setFileSystem({
      '.dxscannerrc.yaml': `practices:
      JavaScript.ESLintWithoutErrorsPractice:
        fix: false`,
    });
    ESLintWithoutErrorsPractice.prototype.fix = fixMock;
    ESLintWithoutErrorsPractice.prototype.evaluate = () => Promise.resolve(PracticeEvaluationResult.notPracticing);
    containerCtx.container.bind('ESLintWithoutErrorsPractice').to(ESLintWithoutErrorsPractice);
    const scanner = containerCtx.container.get(Scanner);

    await scanner.scan({ determineRemote: false });

    expect(fixMock).not.toBeCalled();
  });
  it.todo('fixPattern flag has higher precedence than config');
  it.todo('fixPattern flag works');
});
