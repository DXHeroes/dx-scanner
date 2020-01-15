import { FileInspector } from '.';
import { createTestContainer, TestContainerContext } from '../inversify.config';
import { FileSystemService } from '../services';
import { DirectoryJSON } from 'memfs/lib/volume';
import path from 'path';

describe('GitignoreIsPresentPractice', () => {
  let fileInspector: FileInspector;
  let containerCtx: TestContainerContext;
  let virtualFileSystemService: FileSystemService;

  beforeAll(() => {
    containerCtx = createTestContainer();
    containerCtx.container.bind('FileInspector').to(FileInspector);
    fileInspector = containerCtx.container.get('FileInspector');
  });

  // beforeEach(() => {
  //   virtualFileSystemService = new FileSystemService({ isVirtual: true });
  //   fileInspector = new FileInspector(virtualFileSystemService, '/');
  // });

  afterEach(async () => {
    containerCtx.virtualFileSystemService.clearFileSystem();
    containerCtx.practiceContext.fileInspector!.purgeCache();
  });

  it('Throws an error if the file does not exist', async () => {
    const path = './';
    // const structure: DirectoryJSON = {
    //   '/index.cpp': '...',
    // };

    // virtualFileSystemService.setFileSystem(structure);
    try {
      await fileInspector.scanFor('not.exist', path);
      fail();
    } catch (error) {
      expect(error.message).toEqual(`ENOENT: no such file or directory, readdir '${path}'`);
    }
    // expect(async () => {
    //   await fileInspector.scanFor('not.exist', path);
    // }).toThrow();
  });

  // it('Returns practicing if there is a .gitignore', async () => {
  //   const structure: DirectoryJSON = {
  //     '/index.cpp': '...',
  //   };

  //   virtualFileSystemService.setFileSystem(structure);
  //   const isFile = await fileInspector.isFile('/index.cpp');
  //   expect(isFile).toEqual(true);
  // });
});
