import { JavaScriptLanguageDetector } from './JavaScriptLanguageDetector';
import { FileInspector } from '../../inspectors/FileInspector';
import { ProgrammingLanguage } from '../../model';
import { VirtualFileSystemService } from '../../services/VirtualFileSystemService';
import * as nodePath from 'path';
import { DirectoryJSON } from 'memfs/lib/volume';

describe('JavaScriptLanguageDetector', () => {
  let detector: JavaScriptLanguageDetector;
  let virtualFileSystemService: VirtualFileSystemService;

  beforeEach(() => {
    virtualFileSystemService = new VirtualFileSystemService();

    const fileInspector = new FileInspector(virtualFileSystemService, '/');
    detector = new JavaScriptLanguageDetector(fileInspector);
  });

  afterEach(async () => {
    virtualFileSystemService.clearFileSystem();
  });

  it('detects javascript correctly via package.json', async () => {
    const structure: DirectoryJSON = {
      '/package.json': '...',
    };

    virtualFileSystemService.setFileSystem(structure);

    const langAtPath = await detector.detectLanguage();
    expect(langAtPath.length).toEqual(1);
    expect(langAtPath[0].language).toEqual(ProgrammingLanguage.JavaScript);
    expect(langAtPath[0].path).toEqual(nodePath.normalize('/'));
  });

  it("detects it's not a javascript", async () => {
    const structure: DirectoryJSON = {
      '/src/index.none': '...',
    };

    virtualFileSystemService.setFileSystem(structure);

    const langAtPath = await detector.detectLanguage();
    expect(langAtPath.length).toEqual(0);
    expect(langAtPath).toEqual([]);
  });

  it('detects typescript correctly via ts file', async () => {
    const structure: DirectoryJSON = {
      '/index.ts': '...',
    };

    virtualFileSystemService.setFileSystem(structure);

    const langAtPath = await detector.detectLanguage();
    expect(langAtPath.length).toEqual(1);
    expect(langAtPath[0].language).toEqual(ProgrammingLanguage.TypeScript);
    expect(langAtPath[0].path).toEqual(nodePath.normalize('/'));
  });

  it('detects javascript correctly via js file', async () => {
    const structure: DirectoryJSON = {
      '/index.js': '...',
    };

    virtualFileSystemService.setFileSystem(structure);

    const langAtPath = await detector.detectLanguage();
    expect(langAtPath.length).toEqual(1);
    expect(langAtPath[0].language).toEqual(ProgrammingLanguage.JavaScript);
    expect(langAtPath[0].path).toEqual(nodePath.normalize('/'));
  });
});
