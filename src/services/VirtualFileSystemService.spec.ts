import path from 'path';
import { VirtualFileSystemService } from './VirtualFileSystemService';
import { createTestContainer } from '../inversify.config';

describe('VirtualFileSystemService', () => {
  let virtualFileSystemService: VirtualFileSystemService;

  beforeAll(async () => {
    const container = createTestContainer({ uri: '.' });
    virtualFileSystemService = container.virtualFileSystemService;

    virtualFileSystemService.setFileSystem({
      '/mockFolder/mockSubFolder/mockSubFolderFile.txt': '',
      '/mockFolder/mockFileSLbroken.ln': '',
      '/mockFolder/mockFileToRewrite.ts': '',
      '/mockFolder/mockFile.ts': '',
      '/.keep': '',
      '/index.ts': '',
    });
  });

  describe('#exists', () => {
    it('returns true if the file exists', async () => {
      const mockFilePath = path.resolve('/mockFolder/mockFile.ts');
      const result = await virtualFileSystemService.exists(mockFilePath);
      expect(result).toEqual(true);
    });

    it('returns true if the directory exists', async () => {
      const mockFolderPath = path.resolve('/mockFolder');
      const result = await virtualFileSystemService.exists(mockFolderPath);
      expect(result).toEqual(true);
    });

    it("returns false if the file doesn't exists", async () => {
      const mockFolderPath = path.resolve('/notExistingMockFolder');
      const result = await virtualFileSystemService.exists(mockFolderPath);
      expect(result).toEqual(false);
    });
  });

  describe('#readDirectory', () => {
    it('returns array of files after calling readDirectory()', async () => {
      const mockFolderPath = path.resolve('/mockFolder');

      const result = await virtualFileSystemService.readDirectory(mockFolderPath);
      expect(result).toContain('mockFile.ts');
      expect(result).toContain('mockFileSLbroken.ln');
      expect(result).toContain('mockFileToRewrite.ts');
      expect(result).toContain('mockSubFolder');
    });

    it("throws an error if the target doesn't exist", async () => {
      const mockFolderPath = path.resolve('/notExistingMockFolder');

      await expect(virtualFileSystemService.readDirectory(mockFolderPath)).rejects.toThrow(/ENOENT: no such file or directory/);
    });

    it('throws an error if the target is a file', async () => {
      const mockFilePath = path.resolve('/mockFolder/mockFile.ts');

      await expect(virtualFileSystemService.readDirectory(mockFilePath)).rejects.toThrow(/ENOTDIR: not a directory/);
    });
  });

  describe('#readFile', () => {
    it('should return text (string) after calling readFile()', async () => {
      const mockFilePath = path.resolve('/mockFolder/mockFile.ts');

      const result = await virtualFileSystemService.readFile(mockFilePath);
      expect(typeof result).toBe('string');
    });

    it("throws an error if the target doesn't exist", async () => {
      const mockFilePath = path.resolve('/notExistingMockFolder');

      await expect(virtualFileSystemService.readFile(mockFilePath)).rejects.toThrow(
        "ENOENT: no such file or directory, open '" + mockFilePath + "'",
      );
    });

    it("throws an error if the target isn't a file", async () => {
      const mockFolderPath = path.resolve('/mockFolder');

      await expect(virtualFileSystemService.readFile(mockFolderPath)).rejects.toThrow(/EISDIR: illegal operation on a directory, /);
    });
  });

  describe('#writeFile', () => {
    it('correctly writes to the file', async () => {
      const mockFilePath = path.resolve('/notExistingMockFile.ts');

      const stringToWrite = "const toWrite = 'written';";

      await virtualFileSystemService.writeFile(mockFilePath, stringToWrite);

      const finalContent = await virtualFileSystemService.readFile(mockFilePath);
      expect(finalContent).toEqual(stringToWrite);

      await virtualFileSystemService.deleteFile(mockFilePath);
    });

    it('correctly rewrites a file', async () => {
      const mockFileToRewrite = path.resolve('/mockFolder/mockFileToRewrite.ts');

      const stringToWrite = "const toRewrite = 'rewritten';";
      const previousContent = await virtualFileSystemService.readFile(mockFileToRewrite);

      await virtualFileSystemService.writeFile(mockFileToRewrite, stringToWrite);

      const finalContent = await virtualFileSystemService.readFile(mockFileToRewrite);
      expect(finalContent).toEqual(stringToWrite);

      await virtualFileSystemService.writeFile(mockFileToRewrite, previousContent);
    });

    it("throws an error if the parent directory doesn't exist", async () => {
      const mockFilePath = path.resolve('/notExistingMockFolder/file.ts');

      await expect(virtualFileSystemService.writeFile(mockFilePath, '...')).rejects.toThrow(
       /ENOENT: no such file or directory/
      );
    });

    it("throws an error if the target isn't a file", async () => {
      const mockFilePath = path.resolve('/mockFolder');

      await expect(virtualFileSystemService.writeFile(mockFilePath, '...')).rejects.toThrow(
        /EISDIR: illegal operation on a directory/
      );
    });
  });

  describe('#createFile', () => {
    it('creates a file if it does not exist yet', async () => {
      const mockFilePath = path.resolve('/notExistingMockFile.ts');

      const stringToWrite = "const toWrite = 'written';";

      await virtualFileSystemService.createFile(mockFilePath, stringToWrite);

      const finalContent = await virtualFileSystemService.readFile(mockFilePath);
      expect(finalContent).toEqual(stringToWrite);

      await virtualFileSystemService.deleteFile(mockFilePath);
    });

    it('appends data to a file if it exists already', async () => {
      const mockFile = path.resolve('/mockFolder/mockFile.ts');

      const stringToWrite = "const toAppend = 'appended';";
      const previousContent = await virtualFileSystemService.readFile(mockFile);

      await virtualFileSystemService.createFile(mockFile, stringToWrite);

      const finalContent = await virtualFileSystemService.readFile(mockFile);
      expect(finalContent).toEqual(previousContent + stringToWrite);

      await virtualFileSystemService.writeFile(mockFile, previousContent);
    });

    it("throws an error if the parent directory doesn't exist", async () => {
      const mockFilePath = path.resolve('/notExistingMockFolder/file.ts');

      await expect(virtualFileSystemService.createFile(mockFilePath, '...')).rejects.toThrow(/ENOENT: no such file or directory/);
    });

    it('throws an error if the parent directory is not a directory', async () => {
      const mockFilePath = path.resolve('/mockFolder/mockFile.ts/file.ts');

      await expect(virtualFileSystemService.createFile(mockFilePath, '...')).rejects.toThrow('No such directory');
    });

    it("throws an error if the target isn't a file", async () => {
      const mockFilePath = path.resolve('/mockFolder');

      await expect(virtualFileSystemService.createFile(mockFilePath, '...')).rejects.toThrow(/EISDIR: illegal operation on a directory/);
    });
  });

  describe('#deleteFile', () => {
    it('returns false after calling exists() when the file is deleted', async () => {
      const filePath = path.resolve('/testMockFile.ignore');

      await virtualFileSystemService.createFile(filePath, '');
      await virtualFileSystemService.deleteFile(filePath);

      const existsFile = await virtualFileSystemService.exists(filePath);
      expect(existsFile).toEqual(false);
    });

    it("throws an error if the target doesn't exist", async () => {
      const mockFilePath = path.resolve('/notExistingMockFolder');

      await expect(virtualFileSystemService.deleteFile(mockFilePath)).rejects.toThrow(
        "ENOENT: no such file or directory, unlink '" + mockFilePath + "'",
      );
    });

    it("throws an error if the target isn't a file", async () => {
      const mockFolderPath = path.resolve('/mockFolder');

      await expect(virtualFileSystemService.deleteFile(mockFolderPath)).rejects.toThrow();
    });
  });

  describe('#createDirectory', () => {
    it('exists() returns true after creating directory', async () => {
      const mockFolderToDelete = path.resolve('/createDirTest');

      try {
        await virtualFileSystemService.createDirectory(mockFolderToDelete);

        const existsDir = await virtualFileSystemService.exists(mockFolderToDelete);
        expect(existsDir).toEqual(true);
      } finally {
        await virtualFileSystemService.deleteDirectory(mockFolderToDelete);
      }
    });

    it("throws an error if the parent directory doesn't exist", async () => {
      const mockFilePath = path.resolve('/notExistingMockFolder/file.ts');

      await expect(virtualFileSystemService.createDirectory(mockFilePath)).rejects.toThrow(/ENOENT: no such file or directory/);
    });

    it('throws an error if the parent directory is not a directory', async () => {
      const mockFilePath = path.resolve('/mockFolder/mockFile.ts/file.ts');

      await expect(virtualFileSystemService.createDirectory(mockFilePath)).rejects.toThrow('No such directory');
    });

    it('throws an error if the target is a directory', async () => {
      const mockFilePath = path.resolve('/mockFolder');

      await expect(virtualFileSystemService.createDirectory(mockFilePath)).rejects.toThrow(
        "EEXIST: file already exists, mkdir '" + mockFilePath + "'",
      );
    });

    it("throws an error if the target isn't a directory", async () => {
      const mockFilePath = path.resolve('/mockFolder/mockFile.ts');

      await expect(virtualFileSystemService.createDirectory(mockFilePath)).rejects.toThrow(
        "EEXIST: file already exists, mkdir '" + mockFilePath + "'",
      );
    });

    it('throws an error if the target is a broken symbolc link', async () => {
      const mockFilePath = path.resolve('/mockFolder/mockFileSLbroken.ln');

      await expect(virtualFileSystemService.createDirectory(mockFilePath)).rejects.toThrow(
        "EEXIST: file already exists, mkdir '" + mockFilePath + "'",
      );
    });
  });

  describe('#deleteDirectory', () => {
    it('exists() returns false after deleting', async () => {
      const mockFolderToDelete = path.resolve('/deleteDirTest');
      let existsDir: boolean;

      try {
        await virtualFileSystemService.createDirectory(mockFolderToDelete);

        existsDir = await virtualFileSystemService.exists(mockFolderToDelete);
        expect(existsDir).toEqual(true);
      } finally {
        await virtualFileSystemService.deleteDirectory(mockFolderToDelete);
      }

      existsDir = await virtualFileSystemService.exists(mockFolderToDelete);
      expect(existsDir).toEqual(false);
    });

    it("throws an error if the target doesn't exist", async () => {
      const mockFolderPath = path.resolve('/notExistingMockFolder');

      await expect(virtualFileSystemService.deleteDirectory(mockFolderPath)).rejects.toThrow('No such directory');
    });

    it("throws an error if the target isn't a directory", async () => {
      const mockFilePath = path.resolve('/mockFolder/mockFile.ts');

      await expect(virtualFileSystemService.deleteDirectory(mockFilePath)).rejects.toThrow('No such directory');
    });

    describe('#getMetadata', () => {
      it('it returns metadata for Folder', async () => {
        const mockFolderPath = path.resolve('/mockFolder');
        const result = await virtualFileSystemService.getMetadata(mockFolderPath);

        expect(result.baseName).toEqual('mockFolder');
        expect(result.extension).toEqual(undefined);
        expect(result.name).toMatch('mockFolder');
        expect(result.path).toMatch(path.resolve('/mockFolder'));
        expect(typeof result.size).toBe('number');
        expect(result.type).toEqual('dir');
      });

      it('it returns metadata for File', async () => {
        const mockFilePath = path.resolve('/mockFolder/mockFile.ts');
        const result = await virtualFileSystemService.getMetadata(mockFilePath);

        expect(result.baseName).toEqual('mockFile');
        expect(result.extension).toEqual('.ts');
        expect(result.name).toEqual('mockFile.ts');
        expect(result.path).toMatch(path.resolve('/mockFolder/mockFile.ts'));
        expect(typeof result.size).toBe('number');
        expect(result.type).toEqual('file');
      });

      it('it returns metadata for dotfile', async () => {
        const mockFilePath = path.resolve('/.keep');
        const result = await virtualFileSystemService.getMetadata(mockFilePath);

        expect(result.baseName).toEqual('.keep');
        expect(result.name).toEqual('.keep');
        expect(result.extension).toEqual(undefined);
        expect(result.path).toMatch(path.resolve('/.keep'));
        expect(typeof result.size).toBe('number');
        expect(result.type).toEqual('file');
      });

      it('it returns metadata for broken Symlink but only as a File', async () => {
        const mockFilePathSL = path.resolve('/mockFolder/mockFileSLbroken.ln');
        const result = await virtualFileSystemService.getMetadata(mockFilePathSL);

        expect(result.baseName).toEqual('mockFileSLbroken');
        expect(result.extension).toEqual('.ln');
        expect(result.name).toEqual('mockFileSLbroken.ln');
        expect(result.path).toMatch(path.resolve('/mockFolder/mockFileSLbroken.ln'));
        expect(typeof result.size).toBe('number');
        expect(result.type).toEqual('file');
      });

      it("throws an error if the target doesn't exist", async () => {
        const mockFolderPath = path.resolve('/notExistingMockFolder');

        await expect(virtualFileSystemService.getMetadata(mockFolderPath)).rejects.toThrow(`File doesn't exist (${mockFolderPath})`);
      });
    });

    describe('#isFile', () => {
      it('should return file', async () => {
        const mockFilePath = path.resolve('/mockFolder/mockFile.ts');
        const result = await virtualFileSystemService.getMetadata(mockFilePath);

        expect(result.type).toEqual('file');
      });

      it("should throw an error if the target doesn't exist", async () => {
        const mockFilePath = path.resolve('/notExistingMockFolder');

        await expect(virtualFileSystemService.isFile(mockFilePath)).rejects.toThrow(
          "ENOENT: no such file or directory, lstat '" + mockFilePath + "'",
        );
      });
    });

    describe('#isDirectory', () => {
      it('should return directory', async () => {
        const mockFolderPath = path.resolve('/mockFolder');
        const result = await virtualFileSystemService.getMetadata(mockFolderPath);

        expect(result.type).toEqual('dir');
      });

      it("should throw an error if the target doesn't exist", async () => {
        const mockFolderPath = path.resolve('/notExistingMockFolder');

        await expect(virtualFileSystemService.isDirectory(mockFolderPath)).rejects.toThrow(
          "ENOENT: no such file or directory, lstat '" + mockFolderPath + "'",
        );
      });
    });

    describe('#flatTraverse', () => {
      it('returns keys of metadata of all results', async () => {
        const mockFolderPath = path.resolve('/mockFolder');

        let files: string[] = [];

        await virtualFileSystemService.flatTraverse(mockFolderPath, (meta) => {
          files.push(meta.name);
        });

        expect(files.length).toEqual(5);
        expect(files).toContain('mockFile.ts');
        expect(files).toContain('mockFileToRewrite.ts');
        expect(files).toContain('mockSubFolder');
        expect(files).toContain('mockSubFolderFile.txt');
      });

      it('stops on false', async () => {
        const mockFolderPath = path.resolve('/mockFolder');

        let files: string[] = [];

        await virtualFileSystemService.flatTraverse(mockFolderPath, (meta) => {
          files.push(meta.name);
          return false;
        });

        expect(files.length).toEqual(1);
      });

      it("throws an error if the root doesn't exist", async () => {
        const mockFolderPath = path.resolve('/notExistingMockFolder');

        await expect(virtualFileSystemService.flatTraverse(mockFolderPath, () => true)).rejects.toThrow(
          /ENOENT: no such file or directory/,
        );
      });

      it("throws an error if the root isn't a directory", async () => {
        const mockFolderPath = path.resolve('/mockFolder/mockFile.ts');

        await expect(virtualFileSystemService.flatTraverse(mockFolderPath, () => true)).rejects.toThrow(/ENOTDIR: not a directory/);
      });
    });
  });
});
