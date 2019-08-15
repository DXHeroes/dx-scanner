import path from 'path';
import { FileSystemService } from './FileSystemService';
import { createTestContainer } from '../inversify.config';

describe('FileSystemService', () => {
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

    it('returns true if the symbolic link exists', async () => {
      const mockFilePath = path.resolve(__dirname, '__MOCKS__/mockFolder/mockFileSL.ts');
      const result = await fileSystemService.exists(mockFilePath);
      expect(result).toEqual(true);
    });

    it('returns true if the broken symbolic link exists', async () => {
      const mockFilePath = path.resolve(__dirname, '__MOCKS__/mockFolder/mockFileSLbroken.ln');
      const result = await fileSystemService.exists(mockFilePath);
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
      expect(result).toEqual(['mockFile.ts', 'mockFileSL.ts', 'mockFileSLbroken.ln', 'mockFileToRewrite.ts', 'mockSubFolder']);
    });

    it('follows symbolic links', async () => {
      const mockFolderPath = path.resolve(__dirname, '__MOCKS__/mockFolderSL');

      const result = await fileSystemService.readDirectory(mockFolderPath);
      expect(result).toEqual(['mockFile.ts', 'mockFileSL.ts', 'mockFileSLbroken.ln', 'mockFileToRewrite.ts', 'mockSubFolder']);
    });

    it("throws an error if the target doesn't exist", async () => {
      const mockFolderPath = path.resolve(__dirname, '__MOCKS__/notExistingMockFolder');

      await expect(fileSystemService.readDirectory(mockFolderPath)).rejects.toThrow(
        "ENOENT: no such file or directory, scandir '" + mockFolderPath + "'",
      );
    });

    it('throws an error if the target is a file', async () => {
      const mockFilePath = path.resolve(__dirname, '__MOCKS__/mockFolder/mockFile.ts');

      await expect(fileSystemService.readDirectory(mockFilePath)).rejects.toThrow(
        "ENOTDIR: not a directory, scandir '" + mockFilePath + "'",
      );
    });

    it('throws an error if the target is a broken symbolic link', async () => {
      const mockFolderPath = path.resolve(__dirname, '__MOCKS__/mockFolder/mockFileSLbroken.ln');

      await expect(fileSystemService.readDirectory(mockFolderPath)).rejects.toThrow(
        "ENOENT: no such file or directory, scandir '" + mockFolderPath + "'",
      );
    });
  });

  describe('#readFile', () => {
    it('should return text (string) after calling readFile()', async () => {
      const mockFilePath = path.resolve(__dirname, '__MOCKS__/mockFolder/mockFile.ts');

      const result = await fileSystemService.readFile(mockFilePath);
      expect(typeof result).toBe('string');
    });

    it('follows symbolic links', async () => {
      const mockFilePath = path.resolve(__dirname, '__MOCKS__/mockFolder/mockFileSL.ts');

      const result = await fileSystemService.readFile(mockFilePath);
      expect(typeof result).toBe('string');
    });

    it("throws an error if the target doesn't exist", async () => {
      const mockFilePath = path.resolve(__dirname, '__MOCKS__/notExistingMockFolder');

      await expect(fileSystemService.readFile(mockFilePath)).rejects.toThrow(
        "ENOENT: no such file or directory, open '" + mockFilePath + "'",
      );
    });

    it("throws an error if the target isn't a file", async () => {
      const mockFolderPath = path.resolve(__dirname, '__MOCKS__/mockFolder');

      await expect(fileSystemService.readFile(mockFolderPath)).rejects.toThrow('EISDIR: illegal operation on a directory, read');
    });

    it('throws an error if the target is a broken symbolic link', async () => {
      const mockFolderPath = path.resolve(__dirname, '__MOCKS__/mockFolder/mockFileSLbroken.ln');

      await expect(fileSystemService.readFile(mockFolderPath)).rejects.toThrow(
        "ENOENT: no such file or directory, open '" + mockFolderPath + "'",
      );
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

    it('correctly writes to a symbolic link', async () => {
      const mockSymLink = path.resolve(__dirname, '__MOCKS__/mockFolder/mockFileSL.ts');
      const mockFileToWrite = path.resolve(__dirname, '__MOCKS__/mockFolder/mockFile.ts');

      const stringToWrite = "const toWrite = 'written';";
      const previousContent = await fileSystemService.readFile(mockFileToWrite);

      await fileSystemService.writeFile(mockSymLink, stringToWrite);

      const finalContent = await fileSystemService.readFile(mockFileToWrite);
      expect(finalContent).toEqual(stringToWrite);

      await fileSystemService.writeFile(mockFileToWrite, previousContent);
    });

    it('correctly writes to a broken symbolic link', async () => {
      const mockSymLink = path.resolve(__dirname, '__MOCKS__/mockFolder/mockFileSLbroken.ln');
      const mockFileToWrite = path.resolve(__dirname, '__MOCKS__/mockFolder/notExistingMockFile.ts');

      const stringToWrite = "const toWrite = 'written';";

      await fileSystemService.writeFile(mockSymLink, stringToWrite);

      const finalContent = await fileSystemService.readFile(mockFileToWrite);
      expect(finalContent).toEqual(stringToWrite);

      await fileSystemService.deleteFile(mockFileToWrite);
    });

    it("throws an error if the parent directory doesn't exist", async () => {
      const mockFilePath = path.resolve(__dirname, '__MOCKS__/notExistingMockFolder/file.ts');

      await expect(fileSystemService.writeFile(mockFilePath, '...')).rejects.toThrow(
        "ENOENT: no such file or directory, open '" + mockFilePath + "'",
      );
    });

    it('throws an error if the parent directory is not a directory', async () => {
      const mockFilePath = path.resolve(__dirname, '__MOCKS__/mockFolder/mockFile.ts/file.ts');

      await expect(fileSystemService.writeFile(mockFilePath, '...')).rejects.toThrow(
        "ENOTDIR: not a directory, open '" + mockFilePath + "'",
      );
    });

    it("throws an error if the target isn't a file", async () => {
      const mockFilePath = path.resolve(__dirname, '__MOCKS__/mockFolder');

      await expect(fileSystemService.writeFile(mockFilePath, '...')).rejects.toThrow(
        "EISDIR: illegal operation on a directory, open '" + mockFilePath + "'",
      );
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

    it('appends data to a symbolic link', async () => {
      const mockSymLink = path.resolve(__dirname, '__MOCKS__/mockFolder/mockFileSL.ts');
      const mockFileToWrite = path.resolve(__dirname, '__MOCKS__/mockFolder/mockFile.ts');

      const stringToWrite = "const toAppend = 'appended';";
      const previousContent = await fileSystemService.readFile(mockFileToWrite);

      await fileSystemService.createFile(mockSymLink, stringToWrite);

      const finalContent = await fileSystemService.readFile(mockFileToWrite);
      expect(finalContent).toEqual(previousContent + stringToWrite);

      await fileSystemService.writeFile(mockFileToWrite, previousContent);
    });

    it('creates a file if the symbolic link is broken', async () => {
      const mockSymLink = path.resolve(__dirname, '__MOCKS__/mockFolder/mockFileSLbroken.ln');
      const mockFileToWrite = path.resolve(__dirname, '__MOCKS__/mockFolder/notExistingMockFile.ts');

      const stringToWrite = "const toAppend = 'appended';";

      await fileSystemService.createFile(mockSymLink, stringToWrite);

      const finalContent = await fileSystemService.readFile(mockFileToWrite);
      expect(finalContent).toEqual(stringToWrite);

      await fileSystemService.deleteFile(mockFileToWrite);
    });

    it("throws an error if the parent directory doesn't exist", async () => {
      const mockFilePath = path.resolve(__dirname, '__MOCKS__/notExistingMockFolder/file.ts');

      await expect(fileSystemService.createFile(mockFilePath, '...')).rejects.toThrow(
        "ENOENT: no such file or directory, open '" + mockFilePath + "'",
      );
    });

    it('throws an error if the parent directory is not a directory', async () => {
      const mockFilePath = path.resolve(__dirname, '__MOCKS__/mockFolder/mockFile.ts/file.ts');

      await expect(fileSystemService.createFile(mockFilePath, '...')).rejects.toThrow(
        "ENOTDIR: not a directory, open '" + mockFilePath + "'",
      );
    });

    it("throws an error if the target isn't a file", async () => {
      const mockFilePath = path.resolve(__dirname, '__MOCKS__/mockFolder');

      await expect(fileSystemService.createFile(mockFilePath, '...')).rejects.toThrow(
        "EISDIR: illegal operation on a directory, open '" + mockFilePath + "'",
      );
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

      await expect(fileSystemService.deleteFile(mockFilePath)).rejects.toThrow(
        "ENOENT: no such file or directory, unlink '" + mockFilePath + "'",
      );
    });

    it("throws an error if the target isn't a file", async () => {
      const mockFolderPath = path.resolve(__dirname, '__MOCKS__/mockFolder');

      await expect(fileSystemService.deleteFile(mockFolderPath)).rejects.toThrow();
    });
  });

  describe('#createDirectory', () => {
    it('exists() returns true after creating directory', async () => {
      const mockFolderToDelete = path.resolve(__dirname, '__MOCKS__/createDirTest');

      await fileSystemService.createDirectory(mockFolderToDelete);

      const existsDir = await fileSystemService.exists(mockFolderToDelete);
      expect(existsDir).toEqual(true);

      await fileSystemService.deleteDirectory(mockFolderToDelete);
    });

    it("throws an error if the parent directory doesn't exist", async () => {
      const mockFilePath = path.resolve(__dirname, '__MOCKS__/notExistingMockFolder/file.ts');

      await expect(fileSystemService.createDirectory(mockFilePath)).rejects.toThrow(
        "ENOENT: no such file or directory, mkdir '" + mockFilePath + "'",
      );
    });

    it('throws an error if the parent directory is not a directory', async () => {
      const mockFilePath = path.resolve(__dirname, '__MOCKS__/mockFolder/mockFile.ts/file.ts');

      await expect(fileSystemService.createDirectory(mockFilePath)).rejects.toThrow(
        "ENOTDIR: not a directory, mkdir '" + mockFilePath + "'",
      );
    });

    it('throws an error if the target is a directory', async () => {
      const mockFilePath = path.resolve(__dirname, '__MOCKS__/mockFolder');

      await expect(fileSystemService.createDirectory(mockFilePath)).rejects.toThrow(
        "EEXIST: file already exists, mkdir '" + mockFilePath + "'",
      );
    });

    it("throws an error if the target isn't a directory", async () => {
      const mockFilePath = path.resolve(__dirname, '__MOCKS__/mockFolder/mockFile.ts');

      await expect(fileSystemService.createDirectory(mockFilePath)).rejects.toThrow(
        "EEXIST: file already exists, mkdir '" + mockFilePath + "'",
      );
    });

    it('throws an error if the target is a broken symbolc link', async () => {
      const mockFilePath = path.resolve(__dirname, '__MOCKS__/mockFolder/mockFileSLbroken.ln');

      await expect(fileSystemService.createDirectory(mockFilePath)).rejects.toThrow(
        "EEXIST: file already exists, mkdir '" + mockFilePath + "'",
      );
    });
  });

  describe('#deleteDirectory', () => {
    it('exists() returns false after deleting', async () => {
      const mockFolderToDelete = path.resolve(__dirname, '__MOCKS__/deleteDirTest');

      await fileSystemService.createDirectory(mockFolderToDelete);
      let existsDir = await fileSystemService.exists(mockFolderToDelete);
      expect(existsDir).toEqual(true);

      await fileSystemService.deleteDirectory(mockFolderToDelete);

      existsDir = await fileSystemService.exists(mockFolderToDelete);
      expect(existsDir).toEqual(false);
    });

    it("throws an error if the target doesn't exist", async () => {
      const mockFolderPath = path.resolve(__dirname, '__MOCKS__/notExistingMockFolder');

      await expect(fileSystemService.deleteDirectory(mockFolderPath)).rejects.toThrow(
        "ENOENT: no such file or directory, rmdir '" + mockFolderPath + "'",
      );
    });

    it("throws an error if the target isn't a directory", async () => {
      const mockFilePath = path.resolve(__dirname, '__MOCKS__/mockFolder/mockFile.ts');

      await expect(fileSystemService.deleteDirectory(mockFilePath)).rejects.toThrow(
        "ENOTDIR: not a directory, rmdir '" + mockFilePath + "'",
      );
    });

    it('throws an error if the target is a symbolic link to a directory', async () => {
      const mockFilePath = path.resolve(__dirname, '__MOCKS__/mockFolderSL');

      await expect(fileSystemService.deleteDirectory(mockFilePath)).rejects.toThrow(
        "ENOTDIR: not a directory, rmdir '" + mockFilePath + "'",
      );
    });
  });

  describe('#getMetadata', () => {
    it('it returns metadata for Folder', async () => {
      const mockFolderPath = path.resolve(__dirname, '__MOCKS__/mockFolder');
      const result = await fileSystemService.getMetadata(mockFolderPath);

      expect(result.baseName).toEqual('mockFolder');
      expect(result.extension).toEqual(undefined);
      expect(result.name).toMatch('mockFolder');
      expect(result.path).toMatch(/.*?\/src\/services\/__MOCKS__\/mockFolder/);
      expect(typeof result.size).toBe('number');
      expect(result.type).toEqual('dir');
    });

    it('it returns metadata for File', async () => {
      const mockFilePath = path.resolve(__dirname, '__MOCKS__/mockFolder/mockFile.ts');
      const result = await fileSystemService.getMetadata(mockFilePath);

      expect(result.baseName).toEqual('mockFile');
      expect(result.extension).toEqual('.ts');
      expect(result.name).toEqual('mockFile.ts');
      expect(result.path).toMatch(/.*?\/services\/__MOCKS__\/mockFolder\/mockFile.ts/);
      expect(typeof result.size).toBe('number');
      expect(result.type).toEqual('file');
    });

    it('it returns metadata for dotfile', async () => {
      const mockFilePath = path.resolve(__dirname, '__MOCKS__/.keep');
      const result = await fileSystemService.getMetadata(mockFilePath);

      expect(result.baseName).toEqual('.keep');
      expect(result.name).toEqual('.keep');
      expect(result.extension).toEqual(undefined);
      expect(result.path).toMatch(/.*?\/services\/__MOCKS__\/\.keep/);
      expect(typeof result.size).toBe('number');
      expect(result.type).toEqual('file');
    });

    it('it returns metadata for Symlink', async () => {
      const mockFilePathSL = path.resolve(__dirname, '__MOCKS__/mockFolder/mockFileSL.ts');
      const result = await fileSystemService.getMetadata(mockFilePathSL);

      expect(result.baseName).toEqual('mockFileSL');
      expect(result.extension).toEqual('.ts');
      expect(result.name).toEqual('mockFileSL.ts');
      expect(result.path).toMatch(/.*?\/services\/__MOCKS__\/mockFolder\/mockFileSL.ts/);
      expect(typeof result.size).toBe('number');
      expect(result.type).toEqual('symlink');
    });

    it('it returns metadata for broken Symlink', async () => {
      const mockFilePathSL = path.resolve(__dirname, '__MOCKS__/mockFolder/mockFileSLbroken.ln');
      const result = await fileSystemService.getMetadata(mockFilePathSL);

      expect(result.baseName).toEqual('mockFileSLbroken');
      expect(result.extension).toEqual('.ln');
      expect(result.name).toEqual('mockFileSLbroken.ln');
      expect(result.path).toMatch(/.*?\/services\/__MOCKS__\/mockFolder\/mockFileSLbroken.ln/);
      expect(typeof result.size).toBe('number');
      expect(result.type).toEqual('symlink');
    });

    it("throws an error if the target doesn't exist", async () => {
      const mockFolderPath = path.resolve(__dirname, '__MOCKS__/notExistingMockFolder');

      await expect(fileSystemService.getMetadata(mockFolderPath)).rejects.toThrow(`File doesn't exist (${mockFolderPath})`);
    });
  });

  describe('#isFile', () => {
    it('should return file', async () => {
      const mockFilePath = path.resolve(__dirname, '__MOCKS__/mockFolder/mockFile.ts');
      const result = await fileSystemService.getMetadata(mockFilePath);

      expect(result.type).toEqual('file');
    });

    it('should return false if the path is a symbolic link', async () => {
      const mockFilePath = path.resolve(__dirname, '__MOCKS__/mockFolder/mockFileSL.ts');
      const result = await fileSystemService.isFile(mockFilePath);

      expect(result).toEqual(false);
    });

    it("should throw an error if the target doesn't exist", async () => {
      const mockFilePath = path.resolve(__dirname, '__MOCKS__/notExistingMockFolder');

      await expect(fileSystemService.isFile(mockFilePath)).rejects.toThrow(
        "ENOENT: no such file or directory, lstat '" + mockFilePath + "'",
      );
    });
  });

  describe('#isDirectory', () => {
    it('should return directory', async () => {
      const mockFolderPath = path.resolve(__dirname, '__MOCKS__/mockFolder');
      const result = await fileSystemService.getMetadata(mockFolderPath);

      expect(result.type).toEqual('dir');
    });

    it('should return false if the path is a symbolic link', async () => {
      const mockFilePath = path.resolve(__dirname, '__MOCKS__/mockFolder/mockFileSL.ts');
      const result = await fileSystemService.isDirectory(mockFilePath);

      expect(result).toEqual(false);
    });

    it("should throw an error if the target doesn't exist", async () => {
      const mockFolderPath = path.resolve(__dirname, '__MOCKS__/notExistingMockFolder');

      await expect(fileSystemService.isDirectory(mockFolderPath)).rejects.toThrow(
        "ENOENT: no such file or directory, lstat '" + mockFolderPath + "'",
      );
    });
  });

  describe('#isSymlink', () => {
    it('should return symlink', async () => {
      const mockFilePathSL = path.resolve(__dirname, '__MOCKS__/mockFolder/mockFileSL.ts');
      const result = await fileSystemService.getMetadata(mockFilePathSL);

      expect(result.type).toEqual('symlink');
    });

    it('should return false if the path is not a symbolic link', async () => {
      const mockFilePath = path.resolve(__dirname, '__MOCKS__/mockFolder');
      const result = await fileSystemService.isSymbolicLink(mockFilePath);

      expect(result).toEqual(false);
    });

    it("should throw an error if the target doesn't exist", async () => {
      const mockFolderPath = path.resolve(__dirname, '__MOCKS__/notExistingMockFolder');

      await expect(fileSystemService.isSymbolicLink(mockFolderPath)).rejects.toThrow(
        "ENOENT: no such file or directory, lstat '" + mockFolderPath + "'",
      );
    });
  });

  describe('#flatTraverse', () => {
    it('returns keys of metadata of all results', async () => {
      const mockFolderPath = path.resolve(__dirname, '__MOCKS__/mockFolder');

      const files: string[] = [];

      await fileSystemService.flatTraverse(mockFolderPath, (meta) => {
        files.push(meta.name);
      });

      expect(files.length).toEqual(6);
      expect(files).toContain('mockFile.ts');
      expect(files).toContain('mockFileSL.ts');
      expect(files).toContain('mockFileToRewrite.ts');
      expect(files).toContain('mockSubFolder');
      expect(files).toContain('mockSubFolderFile.txt');
    });

    it('stops on false', async () => {
      const mockFolderPath = path.resolve(__dirname, '__MOCKS__/mockFolder');

      const files: string[] = [];

      await fileSystemService.flatTraverse(mockFolderPath, (meta) => {
        files.push(meta.name);
        return false;
      });

      expect(files.length).toEqual(1);
    });

    it('follows the root symbolic links', async () => {
      const mockFolderPath = path.resolve(__dirname, '__MOCKS__/mockFolderSL');

      const files: string[] = [];

      await fileSystemService.flatTraverse(mockFolderPath, (meta) => {
        files.push(meta.name);
      });

      expect(files.length).toEqual(6);
      expect(files).toContain('mockFile.ts');
      expect(files).toContain('mockFileSL.ts');
      expect(files).toContain('mockFileToRewrite.ts');
      expect(files).toContain('mockSubFolder');
      expect(files).toContain('mockSubFolderFile.txt');
    });

    it("throws an error if the root doesn't exist", async () => {
      const mockFolderPath = path.resolve(__dirname, '__MOCKS__/notExistingMockFolder');

      await expect(fileSystemService.flatTraverse(mockFolderPath, () => true)).rejects.toThrow(
        "ENOENT: no such file or directory, scandir '" + mockFolderPath + "'",
      );
    });

    it("throws an error if the root isn't a directory", async () => {
      const mockFolderPath = path.resolve(__dirname, '__MOCKS__/mockFolder/mockFile.ts');

      await expect(fileSystemService.flatTraverse(mockFolderPath, () => true)).rejects.toThrow(
        "ENOTDIR: not a directory, scandir '" + mockFolderPath + "'",
      );
    });

    it('throws an error if the root is a broken symbolic link', async () => {
      const mockFolderPath = path.resolve(__dirname, '__MOCKS__/mockFolder/mockFileSLbroken.ts');

      await expect(fileSystemService.flatTraverse(mockFolderPath, () => true)).rejects.toThrow(
        "ENOENT: no such file or directory, scandir '" + mockFolderPath + "'",
      );
    });
  });
});
