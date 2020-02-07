import { createRootContainer, createTestContainer, TestContainerContext } from '../inversify.config';
import { Scanner } from './Scanner';
import { FileSystemService } from '../services/FileSystemService';
import { argumentsProviderFactory } from '../test/factories/ArgumentsProviderFactory';
import { ESLintWithoutErrorsPractice } from '../practices/JavaScript/ESLintWithoutErrorsPractice';
import { PracticeEvaluationResult, PracticeImpact } from '../model';
import { ConfigProvider } from './ConfigProvider';
import { PracticeContext } from '../contexts/practice/PracticeContext';

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

  describe('fixer', () => {
    it('runs fix when fix flag set to true', async () => {
      jest.setTimeout(20000);
      const fixMock = jest.fn();
      containerCtx = createTestContainer({ fix: true });
      ConfigProvider.prototype.getOverriddenPractice = () => ({
        impact: PracticeImpact.high,
      });

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
      containerCtx = createTestContainer({ fix: true });
      ConfigProvider.prototype.getOverriddenPractice = () => ({
        impact: PracticeImpact.high,
        fix: false,
      });
      ESLintWithoutErrorsPractice.prototype.fix = fixMock;
      ESLintWithoutErrorsPractice.prototype.evaluate = () => Promise.resolve(PracticeEvaluationResult.notPracticing);
      containerCtx.container.bind('ESLintWithoutErrorsPractice').to(ESLintWithoutErrorsPractice);
      const scanner = containerCtx.container.get(Scanner);

      await scanner.scan({ determineRemote: false });

      expect(fixMock).not.toBeCalled();
    });
    it('fix settings from config works only when fix flag is set', async () => {
      jest.setTimeout(15000);
      const fixMock = jest.fn();
      ConfigProvider.prototype.getOverriddenPractice = () => ({
        impact: PracticeImpact.high,
        fix: true,
      });
      ESLintWithoutErrorsPractice.prototype.fix = fixMock;
      ESLintWithoutErrorsPractice.prototype.evaluate = () => Promise.resolve(PracticeEvaluationResult.notPracticing);
      containerCtx.container.bind('ESLintWithoutErrorsPractice').to(ESLintWithoutErrorsPractice);
      const scanner = containerCtx.container.get(Scanner);

      await scanner.scan({ determineRemote: false });

      expect(fixMock).not.toBeCalled();
    });
    it.todo('fixPattern flag works');
    it.todo('fixPattern works only when fix flag is set');
    it('fixPattern flag has higher priority than config', async () => {
      jest.setTimeout(15000);
      const fixMock = jest.fn();
      containerCtx = createTestContainer({ fix: true, fixPattern: 'lint' });
      ConfigProvider.prototype.getOverriddenPractice = () => ({
        impact: PracticeImpact.high,
        fix: false,
      });
      ESLintWithoutErrorsPractice.prototype.fix = fixMock;
      ESLintWithoutErrorsPractice.prototype.evaluate = () => Promise.resolve(PracticeEvaluationResult.notPracticing);
      containerCtx.container.bind('ESLintWithoutErrorsPractice').to(ESLintWithoutErrorsPractice);
      const scanner = containerCtx.container.get(Scanner);

      await scanner.scan({ determineRemote: false });

      expect(fixMock).toBeCalled();
    });
  });
});
