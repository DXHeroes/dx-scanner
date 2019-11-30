import { createRootContainer, createTestContainer, TestContainerContext } from '../inversify.config';
import { Scanner } from './Scanner';
import { FileSystemService } from '../services/FileSystemService';

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
    const rootContainer = createRootContainer({ uri: '.' });
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

      await scanner.init();

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

      await scanner.init();

      exists = await containerCtx.virtualFileSystemService.exists('/.dxscannerrc.yaml');
      expect(exists).toEqual(false);
    });
  });
});
