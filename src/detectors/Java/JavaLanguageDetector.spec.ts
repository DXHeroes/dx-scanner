import { JavaLanguageDetector } from './JavaLanguageDetector';
import { FileInspector } from '../../inspectors/FileInspector';
import { ProgrammingLanguage } from '../../model';
import { FileSystemService } from '../../services/FileSystemService';
import * as nodePath from 'path';
import { DirectoryJSON } from 'memfs/lib/volume';

describe('JavaLanguageDetector', () => {
  let detector: JavaLanguageDetector;
  let virtualFileSystemService: FileSystemService;

  beforeEach(() => {
    virtualFileSystemService = new FileSystemService({ isVirtual: true });

    const fileInspector = new FileInspector(virtualFileSystemService, '/');
    detector = new JavaLanguageDetector(fileInspector);
  });

  afterEach(async () => {
    virtualFileSystemService.clearFileSystem();
  });

  it('detects java correctly via pom.xml', async () => {
    const structure: DirectoryJSON = {
      '/pom.xml': '...',
    };

    virtualFileSystemService.setFileSystem(structure);

    const langAtPath = await detector.detectLanguage();
    expect(langAtPath.length).toEqual(1);
    expect(langAtPath[0].language).toEqual(ProgrammingLanguage.Java);
    expect(langAtPath[0].path).toEqual(nodePath.sep);
  });

  it('detects java correctly via build.gradle', async () => {
    const structure: DirectoryJSON = {
      '/build.gradle': '...',
    };

    virtualFileSystemService.setFileSystem(structure);

    const langAtPath = await detector.detectLanguage();
    expect(langAtPath.length).toEqual(1);
    expect(langAtPath[0].language).toEqual(ProgrammingLanguage.Java);
    expect(langAtPath[0].path).toEqual(nodePath.sep);
  });

  it('detects java correctly via java extension', async () => {
    const structure: DirectoryJSON = {
      '/*.java': '...',
    };

    virtualFileSystemService.setFileSystem(structure);

    const langAtPath = await detector.detectLanguage();
    expect(langAtPath.length).toEqual(1);
    expect(langAtPath[0].language).toEqual(ProgrammingLanguage.Java);
    expect(langAtPath[0].path).toEqual(nodePath.sep);
  });

  it('detects kotlin correctly via kt extension', async () => {
    const structure: DirectoryJSON = {
      '/*.kt': '...',
    };

    virtualFileSystemService.setFileSystem(structure);

    const langAtPath = await detector.detectLanguage();
    expect(langAtPath.length).toEqual(1);
    expect(langAtPath[0].language).toEqual(ProgrammingLanguage.Kotlin);
    expect(langAtPath[0].path).toEqual(nodePath.sep);
  });

  it('detects kotlin correctly via kts extension', async () => {
    const structure: DirectoryJSON = {
      '/*.kts': '...',
    };

    virtualFileSystemService.setFileSystem(structure);

    const langAtPath = await detector.detectLanguage();
    expect(langAtPath.length).toEqual(1);
    expect(langAtPath[0].language).toEqual(ProgrammingLanguage.Kotlin);
    expect(langAtPath[0].path).toEqual(nodePath.sep);
  });

  it("detects it's not java or kotlin", async () => {
    const structure: DirectoryJSON = {
      '/src/index.none': '...',
    };

    virtualFileSystemService.setFileSystem(structure);

    const langAtPath = await detector.detectLanguage();
    expect(langAtPath.length).toEqual(0);
    expect(langAtPath).toEqual([]);
  });
});
