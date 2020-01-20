import { FileInspector } from '.';
import { createTestContainer, TestContainerContext } from '../inversify.config';

describe('GitignoreIsPresentPractice', () => {
  let fileInspector: FileInspector;
  let containerCtx: TestContainerContext;

  beforeAll(() => {
    containerCtx = createTestContainer();
    containerCtx.container.bind('FileInspector').to(FileInspector);
    fileInspector = containerCtx.container.get('FileInspector');
  });

  afterEach(async () => {
    containerCtx.virtualFileSystemService.clearFileSystem();
    containerCtx.practiceContext.fileInspector!.purgeCache();
  });

  it('Throws an error if the file does not exist', async () => {
    const path = './';

    try {
      await fileInspector.scanFor('not.exist', path);
      fail();
    } catch (error) {
      expect(error.message).toEqual(`ENOENT: no such file or directory, readdir '${path}'`);
    }
  });
});
