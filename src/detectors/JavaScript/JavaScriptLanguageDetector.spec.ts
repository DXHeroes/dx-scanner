import { JavaScriptLanguageDetector } from './JavaScriptLanguageDetector';
import { FileInspector } from '../../inspectors/FileInspector';
import { ProgrammingLanguage } from '../../model';
import { VirtualFileSystemService } from '../../services/VirtualFileSystemService';
import { VirtualDirectory } from '../../services/IVirtualFileSystemService';

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
    const structure: VirtualDirectory = {
      '/package.json': '...',
    };

    virtualFileSystemService.setFileSystem(structure);

    const langAtPath = await detector.detectLanguage();
    expect(langAtPath.length).toEqual(1);
    expect(langAtPath[0].language).toEqual(ProgrammingLanguage.JavaScript);
    expect(langAtPath[0].path).toEqual('/');
  });

  it("detects it's not a javascript", async () => {
    const structure: VirtualDirectory = {
      '/src/index.none': '...',
    };

    virtualFileSystemService.setFileSystem(structure);

    const langAtPath = await detector.detectLanguage();
    expect(langAtPath.length).toEqual(0);
    expect(langAtPath).toEqual([]);
  });

  it('detects typescript correctly via ts file', async () => {
    const structure: VirtualDirectory = {
      '/index.ts': '...',
    };

    virtualFileSystemService.setFileSystem(structure);

    const langAtPath = await detector.detectLanguage();
    expect(langAtPath.length).toEqual(1);
    expect(langAtPath[0].language).toEqual(ProgrammingLanguage.TypeScript);
    expect(langAtPath[0].path).toEqual('/');
  });

  it('detects javascript correctly via js file', async () => {
    const structure: VirtualDirectory = {
      '/index.js': '...',
    };

    virtualFileSystemService.setFileSystem(structure);

    const langAtPath = await detector.detectLanguage();
    expect(langAtPath.length).toEqual(1);
    expect(langAtPath[0].language).toEqual(ProgrammingLanguage.JavaScript);
    expect(langAtPath[0].path).toEqual('/');
  });
});
