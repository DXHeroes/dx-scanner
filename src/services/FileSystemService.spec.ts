import path from 'path';
import { FileSystemService } from './FileSystemService';
import { createTestContainer } from '../inversify.config';

describe('FileSystemService - REAL', () => {
  let fileSystemService: FileSystemService;

  beforeAll(async () => {
    const container = createTestContainer({ uri: '.' });
    fileSystemService = container.fileSystemService;
  });

  describe('#exists', () => {
    it('returns true if the file exists', async () => {
      const mockFilePath = path.resolve(__dirname, '__MOCKS__/mockFolder/mockFile.ts');
      const result = await fileSystemService.exists(mockFilePath);
      expect(result).toEqual(true);
    });

    it('returns true if the directory exists', async () => {
      const mockFolderPath = path.resolve(__dirname, '__MOCKS__/mockFolder');
      const result = await fileSystemService.exists(mockFolderPath);
      expect(result).toEqual(true);
    });

    it("returns false if the file doesn't exists", async () => {
      const mockFolderPath = path.resolve(__dirname, '__MOCKS__/notExistingMockFolder');
      const result = await fileSystemService.exists(mockFolderPath);
      expect(result).toEqual(false);
    });
  });

  describe('#readDirectory', () => {
    it('returns array of files after calling readDirectory()', async () => {
      const mockFolderPath = path.resolve(__dirname, '__MOCKS__/mockFolder');

      const result = await fileSystemService.readDirectory(mockFolderPath);
      expect(result).toEqual(['mockFile.ts', 'mockFileSLbroken.ln', 'mockFileToRewrite.ts', 'mockSubFolder']);
    });

    it("throws an error if the target doesn't exist", async () => {
      const mockFolderPath = path.resolve(__dirname, '__MOCKS__/notExistingMockFolder');

      await expect(fileSystemService.readDirectory(mockFolderPath)).rejects.toThrow('ENOENT');
    });

    it('throws an error if the target is a file', async () => {
      const mockFilePath = path.resolve(__dirname, '__MOCKS__/mockFolder/mockFile.ts');

      await expect(fileSystemService.readDirectory(mockFilePath)).rejects.toThrow('ENOTDIR');
    });
  });

  describe('#readFile', () => {
    it('should return text (string) after calling readFile()', async () => {
      const mockFilePath = path.resolve(__dirname, '__MOCKS__/mockFolder/mockFile.ts');

      const result = await fileSystemService.readFile(mockFilePath);
      expect(typeof result).toBe('string');
    });

    it("throws an error if the target doesn't exist", async () => {
      const mockFilePath = path.resolve(__dirname, '__MOCKS__/notExistingMockFolder');

      await expect(fileSystemService.readFile(mockFilePath)).rejects.toThrow('ENOENT');
    });

    it("throws an error if the target isn't a file", async () => {
      const mockFolderPath = path.resolve(__dirname, '__MOCKS__/mockFolder');

      await expect(fileSystemService.readFile(mockFolderPath)).rejects.toThrow('EISDIR');
    });
  });

  describe('#writeFile', () => {
    it('correctly writes to the file', async () => {
      const mockFilePath = path.resolve(__dirname, '__MOCKS__/notExistingMockFile.ts');

      const stringToWrite = "const toWrite = 'written';";

      await fileSystemService.writeFile(mockFilePath, stringToWrite);

      const finalContent = await fileSystemService.readFile(mockFilePath);
      expect(finalContent).toEqual(stringToWrite);

      await fileSystemService.deleteFile(mockFilePath);
    });

    it('correctly rewrites a file', async () => {
      const mockFileToRewrite = path.resolve(__dirname, '__MOCKS__/mockFolder/mockFileToRewrite.ts');

      const stringToWrite = "const toRewrite = 'rewritten';";
      const previousContent = await fileSystemService.readFile(mockFileToRewrite);

      await fileSystemService.writeFile(mockFileToRewrite, stringToWrite);

      const finalContent = await fileSystemService.readFile(mockFileToRewrite);
      expect(finalContent).toEqual(stringToWrite);

      await fileSystemService.writeFile(mockFileToRewrite, previousContent);
    });

    it("throws an error if the parent directory doesn't exist", async () => {
      const mockFilePath = path.resolve(__dirname, '__MOCKS__/notExistingMockFolder/file.ts');

      await expect(fileSystemService.writeFile(mockFilePath, '...')).rejects.toThrow('ENOENT');
    });

    it('throws an error if the parent directory is not a directory', async () => {
      const mockFilePath = path.resolve(__dirname, '__MOCKS__/mockFolder/mockFile.ts/file.ts');

      await expect(fileSystemService.writeFile(mockFilePath, '...')).rejects.toThrow('ENOTDIR');
    });

    it("throws an error if the target isn't a file", async () => {
      const mockFilePath = path.resolve(__dirname, '__MOCKS__/mockFolder');

      await expect(fileSystemService.writeFile(mockFilePath, '...')).rejects.toThrow('EISDIR');
    });
  });

  describe('#createFile', () => {
    it('creates a file if it does not exist yet', async () => {
      const mockFilePath = path.resolve(__dirname, '__MOCKS__/notExistingMockFile.ts');

      const stringToWrite = "const toWrite = 'written';";

      await fileSystemService.createFile(mockFilePath, stringToWrite);

      const finalContent = await fileSystemService.readFile(mockFilePath);
      expect(finalContent).toEqual(stringToWrite);

      await fileSystemService.deleteFile(mockFilePath);
    });

    it('appends data to a file if it exists already', async () => {
      const mockFile = path.resolve(__dirname, '__MOCKS__/mockFolder/mockFile.ts');

      const stringToWrite = "const toAppend = 'appended';";
      const previousContent = await fileSystemService.readFile(mockFile);

      await fileSystemService.createFile(mockFile, stringToWrite);

      const finalContent = await fileSystemService.readFile(mockFile);
      expect(finalContent).toEqual(previousContent + stringToWrite);

      await fileSystemService.writeFile(mockFile, previousContent);
    });

    it("throws an error if the parent directory doesn't exist", async () => {
      const mockFilePath = path.resolve(__dirname, '__MOCKS__/notExistingMockFolder/file.ts');

      await expect(fileSystemService.createFile(mockFilePath, '...')).rejects.toThrow('ENOENT');
    });

    it('throws an error if the parent directory is not a directory', async () => {
      const mockFilePath = path.resolve(__dirname, '__MOCKS__/mockFolder/mockFile.ts/file.ts');

      await expect(fileSystemService.createFile(mockFilePath, '...')).rejects.toThrow('ENOTDIR');
    });

    it("throws an error if the target isn't a file", async () => {
      const mockFilePath = path.resolve(__dirname, '__MOCKS__/mockFolder');

      await expect(fileSystemService.createFile(mockFilePath, '...')).rejects.toThrow('EISDIR');
    });
  });

  describe('#deleteFile', () => {
    it('returns false after calling exists() when the file is deleted', async () => {
      const filePath = path.resolve(__dirname, '__MOCKS__/testMockFile.ignore');

      await fileSystemService.createFile(filePath, '');
      await fileSystemService.deleteFile(filePath);

      const existsFile = await fileSystemService.exists(filePath);
      expect(existsFile).toEqual(false);
    });

    it("throws an error if the target doesn't exist", async () => {
      const mockFilePath = path.resolve(__dirname, '__MOCKS__/notExistingMockFolder');

      await expect(fileSystemService.deleteFile(mockFilePath)).rejects.toThrow('ENOENT');
    });

    it("throws an error if the target isn't a file", async () => {
      const mockFolderPath = path.resolve(__dirname, '__MOCKS__/mockFolder');

      await expect(fileSystemService.deleteFile(mockFolderPath)).rejects.toThrow();
    });
  });

  describe('#createDirectory', () => {
    it('exists() returns true after creating directory', async () => {
      const mockFolderToDelete = path.resolve(__dirname, '__MOCKS__/createDirTest');

      try {
        await fileSystemService.createDirectory(mockFolderToDelete);

        const existsDir = await fileSystemService.exists(mockFolderToDelete);
        expect(existsDir).toEqual(true);
      } finally {
        await fileSystemService.deleteDirectory(mockFolderToDelete);
      }
    });

    it("throws an error if the parent directory doesn't exist", async () => {
      const mockFilePath = path.resolve(__dirname, '__MOCKS__/notExistingMockFolder/file.ts');

      await expect(fileSystemService.createDirectory(mockFilePath)).rejects.toThrow('ENOENT');
    });

    it('throws an error if the parent directory is not a directory', async () => {
      const mockFilePath = path.resolve(__dirname, '__MOCKS__/mockFolder/mockFile.ts/file.ts');

      await expect(fileSystemService.createDirectory(mockFilePath)).rejects.toThrow('ENOTDIR');
    });

    it('throws an error if the target is a directory', async () => {
      const mockFilePath = path.resolve(__dirname, '__MOCKS__/mockFolder');

      await expect(fileSystemService.createDirectory(mockFilePath)).rejects.toThrow('EEXIST');
    });

    it("throws an error if the target isn't a directory", async () => {
      const mockFilePath = path.resolve(__dirname, '__MOCKS__/mockFolder/mockFile.ts');

      await expect(fileSystemService.createDirectory(mockFilePath)).rejects.toThrow('EEXIST');
    });

    it('throws an error if the target is a broken symbolc link', async () => {
      const mockFilePath = path.resolve(__dirname, '__MOCKS__/mockFolder/mockFileSLbroken.ln');

      await expect(fileSystemService.createDirectory(mockFilePath)).rejects.toThrow('EEXIST');
    });
  });

  describe('#deleteDirectory', () => {
    it('exists() returns false after deleting', async () => {
      const mockFolderToDelete = path.resolve(__dirname, '__MOCKS__/deleteDirTest');

      await fileSystemService.createDirectory(mockFolderToDelete);
      await fileSystemService.deleteDirectory(mockFolderToDelete);

      const existsDir = await fileSystemService.exists(mockFolderToDelete);
      expect(existsDir).toEqual(false);
    });

    it("throws an error if the target doesn't exist", async () => {
      const mockFolderPath = path.resolve(__dirname, '__MOCKS__/notExistingMockFolder');

      await expect(fileSystemService.deleteDirectory(mockFolderPath)).rejects.toThrow('ENOENT');
    });

    it("throws an error if the target isn't a directory", async () => {
      const mockFilePath = path.resolve(__dirname, '__MOCKS__/mockFolder/mockFile.ts');

      await expect(fileSystemService.deleteDirectory(mockFilePath)).rejects.toThrow('ENOTDIR');
    });

    describe('#getMetadata', () => {
      it('it returns metadata for Folder', async () => {
        const mockFolderPath = path.resolve(__dirname, '__MOCKS__/mockFolder');
        const result = await fileSystemService.getMetadata(mockFolderPath);

        expect(result.baseName).toEqual('mockFolder');
        expect(result.extension).toEqual(undefined);
        expect(result.name).toMatch('mockFolder');
        expect(result.path).toMatch(mockFolderPath);
        expect(typeof result.size).toBe('number');
        expect(result.type).toEqual('dir');
      });

      it('it returns metadata for File', async () => {
        const mockFilePath = path.resolve(__dirname, '__MOCKS__/mockFolder/mockFile.ts');
        const result = await fileSystemService.getMetadata(mockFilePath);

        expect(result.baseName).toEqual('mockFile');
        expect(result.extension).toEqual('.ts');
        expect(result.name).toEqual('mockFile.ts');
        expect(result.path).toMatch(mockFilePath);
        expect(typeof result.size).toBe('number');
        expect(result.type).toEqual('file');
      });

      it('it returns metadata for dotfile', async () => {
        const mockFilePath = path.resolve(__dirname, '__MOCKS__/.keep');
        const result = await fileSystemService.getMetadata(mockFilePath);

        expect(result.baseName).toEqual('.keep');
        expect(result.name).toEqual('.keep');
        expect(result.extension).toEqual(undefined);
        expect(result.path).toMatch(mockFilePath);
        expect(typeof result.size).toBe('number');
        expect(result.type).toEqual('file');
      });

      it('it returns metadata for broken Symlink but only as a File', async () => {
        const mockFilePathSL = path.resolve(__dirname, '__MOCKS__/mockFolder/mockFileSLbroken.ln');
        const result = await fileSystemService.getMetadata(mockFilePathSL);

        expect(result.baseName).toEqual('mockFileSLbroken');
        expect(result.extension).toEqual('.ln');
        expect(result.name).toEqual('mockFileSLbroken.ln');
        expect(result.path).toMatch(mockFilePathSL);
        expect(typeof result.size).toBe('number');
        expect(result.type).toEqual('file');
      });

      it("throws an error if the target doesn't exist", async () => {
        const mockFolderPath = path.resolve(__dirname, '__MOCKS__/notExistingMockFolder');

        await expect(fileSystemService.getMetadata(mockFolderPath)).rejects.toThrow('ENOENT');
      });
    });

    describe('#isFile', () => {
      it('should return file', async () => {
        const mockFilePath = path.resolve(__dirname, '__MOCKS__/mockFolder/mockFile.ts');
        const result = await fileSystemService.getMetadata(mockFilePath);

        expect(result.type).toEqual('file');
      });

      it("should throw an error if the target doesn't exist", async () => {
        const mockFilePath = path.resolve(__dirname, '__MOCKS__/notExistingMockFolder');

        await expect(fileSystemService.isFile(mockFilePath)).rejects.toThrow('ENOENT');
      });
    });

    describe('#isDirectory', () => {
      it('should return directory', async () => {
        const mockFolderPath = path.resolve(__dirname, '__MOCKS__/mockFolder');
        const result = await fileSystemService.getMetadata(mockFolderPath);

        expect(result.type).toEqual('dir');
      });

      it("should throw an error if the target doesn't exist", async () => {
        const mockFolderPath = path.resolve(__dirname, '__MOCKS__/notExistingMockFolder');

        await expect(fileSystemService.isDirectory(mockFolderPath)).rejects.toThrow('ENOENT');
      });
    });

    describe('#flatTraverse', () => {
      it('returns keys of metadata of all results', async () => {
        const mockFolderPath = path.resolve(__dirname, '__MOCKS__/mockFolder');

        let files: string[] = [];

        await fileSystemService.flatTraverse(mockFolderPath, (meta) => {
          files.push(meta.name);
        });

        expect(files.length).toEqual(5);
        expect(files).toContain('mockFile.ts');
        expect(files).toContain('mockFileToRewrite.ts');
        expect(files).toContain('mockSubFolder');
        expect(files).toContain('mockSubFolderFile.txt');
      });

      it('stops on false', async () => {
        const mockFolderPath = path.resolve(__dirname, '__MOCKS__/mockFolder');

        let files: string[] = [];

        await fileSystemService.flatTraverse(mockFolderPath, (meta) => {
          files.push(meta.name);
          return false;
        });

        expect(files.length).toEqual(1);
      });

      it("throws an error if the root doesn't exist", async () => {
        const mockFolderPath = path.resolve(__dirname, '__MOCKS__/notExistingMockFolder');

        await expect(fileSystemService.flatTraverse(mockFolderPath, () => true)).rejects.toThrow('ENOENT');
      });

      it("throws an error if the root isn't a directory", async () => {
        const mockFolderPath = path.resolve(__dirname, '__MOCKS__/mockFolder/mockFile.ts');

        await expect(fileSystemService.flatTraverse(mockFolderPath, () => true)).rejects.toThrow('ENOTDIR');
      });
    });
  });
});
