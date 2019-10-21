import { FileInspector } from '../../inspectors/FileInspector';
import { ProgrammingLanguage } from '../../model';
import { FileSystemService } from '../../services/FileSystemService';
import * as nodePath from 'path';
import { DirectoryJSON } from 'memfs/lib/volume';
import { CppLanguageDetector } from './CppLanguageDetector';

describe('CppLanguageDetector', () => {
  let detector: CppLanguageDetector;
  let virtualFileSystemService: FileSystemService;

  beforeEach(() => {
    virtualFileSystemService = new FileSystemService({ isVirtual: true });

    const fileInspector = new FileInspector(virtualFileSystemService, '/');
    detector = new CppLanguageDetector(fileInspector);
  });

  afterEach(async () => {
    virtualFileSystemService.clearFileSystem();
  });

  it("detects it's not a cpp file", async () => {
    const structure: DirectoryJSON = {
      '/src/index.none': '...',
    };

    virtualFileSystemService.setFileSystem(structure);

    const langAtPath = await detector.detectLanguage();
    expect(langAtPath.length).toEqual(0);
    expect(langAtPath).toEqual([]);
  });

  it('detects cpp correctly via cpp file', async () => {
    const structure: DirectoryJSON = {
      '/index.cpp': '...',
    };

    virtualFileSystemService.setFileSystem(structure);

    const langAtPath = await detector.detectLanguage();
    expect(langAtPath.length).toEqual(1);
    expect(langAtPath[0].language).toEqual(ProgrammingLanguage.CPlusPlus);
    expect(langAtPath[0].path).toEqual(nodePath.sep);
  });

  it('detects cpp correctly via cpp header file', async () => {
    const structure: DirectoryJSON = {
      '/index.hpp': '...',
    };

    virtualFileSystemService.setFileSystem(structure);

    const langAtPath = await detector.detectLanguage();
    expect(langAtPath.length).toEqual(1);
    expect(langAtPath[0].language).toEqual(ProgrammingLanguage.CPlusPlus);
    expect(langAtPath[0].path).toEqual(nodePath.sep);
  });
});
