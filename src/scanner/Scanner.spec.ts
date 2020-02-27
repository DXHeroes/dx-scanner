import { createRootContainer, createTestContainer, TestContainerContext } from '../inversify.config';
import { Scanner, PracticeWithContext } from './Scanner';
import { FileSystemService } from '../services/FileSystemService';
import { argumentsProviderFactory } from '../test/factories/ArgumentsProviderFactory';
import { PracticeEvaluationResult, PracticeImpact } from '../model';
import { mockDeep } from 'jest-mock-extended';

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
    const mockFixablePractice = ({ fixFromConfig }: { fixFromConfig?: boolean } = {}) => {
      const fixMock = jest.fn();
      const fakePractice = mockDeep<PracticeWithContext>();
      fakePractice.evaluation = PracticeEvaluationResult.notPracticing;
      fakePractice.practice.fix = fixMock;
      fakePractice.practice.getMetadata.mockReturnValue({
        id: 'JavaScript.ESLintWithoutErrorsPractice',
        name: 'ESLint Without Errors',
        impact: PracticeImpact.medium,
        suggestion: 'Use the ESLint correctly. You have some errors.',
        reportOnlyOnce: true,
        url: 'https://dxkb.io/p/linting',
        dependsOn: { practicing: ['JavaScript.ESLintUsed'] },
      });
      fakePractice.componentContext.configProvider.getOverriddenPractice.mockReturnValue({
        impact: PracticeImpact.high,
        fix: fixFromConfig,
      });
      return fakePractice;
    };
    it('runs fix when fix flag set to true', async () => {
      containerCtx = createTestContainer({ uri: 'github.com/DXHeroes/dx-scanner', fix: true });
      const scanner = containerCtx.container.get(Scanner);
      const fixablePractice = mockFixablePractice();

      await scanner.fix([fixablePractice]);

      expect(fixablePractice.practice.fix).toBeCalled();
    });
    it('fix settings from config works', async () => {
      containerCtx = createTestContainer({ uri: '.', fix: true });
      const scanner = containerCtx.container.get(Scanner);
      const fixablePractice = mockFixablePractice({ fixFromConfig: false });

      await scanner.fix([fixablePractice]);

      expect(fixablePractice.practice.fix).not.toBeCalled();
    });
    it('fix settings from config works only when fix flag is set', async () => {
      const scanner = containerCtx.container.get(Scanner);
      const fixablePractice = mockFixablePractice({ fixFromConfig: true });

      await scanner.fix([fixablePractice]);

      expect(fixablePractice.practice.fix).not.toBeCalled();
    });
    it.todo('fixPattern flag works');
    it.todo('fixPattern works only when fix flag is set');
    it('fixPattern flag has higher priority than config', async () => {
      containerCtx = createTestContainer({ fix: true, fixPattern: 'lint' });
      const scanner = containerCtx.container.get(Scanner);
      const fixablePractice = mockFixablePractice({ fixFromConfig: false });

      await scanner.fix([fixablePractice]);

      expect(fixablePractice.practice.fix).toBeCalled();
    });
  });
});
