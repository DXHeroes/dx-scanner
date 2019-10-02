import { CSharpLanguageDetector } from './CSharpLanguageDetector';
import { FileInspector } from '../../inspectors/FileInspector';
import { ProgrammingLanguage } from '../../model';
import { FileSystemService } from '../../services/FileSystemService';
import * as nodePath from 'path';
import { DirectoryJSON } from 'memfs/lib/volume';

describe('CSharpLanguageDetector', () => {
  let detector: CSharpLanguageDetector;
  let virtualFileSystemService: FileSystemService;

  beforeEach(() => {
    virtualFileSystemService = new FileSystemService({ isVirtual: true });

    const fileInspector = new FileInspector(virtualFileSystemService, '/');
    detector = new CSharpLanguageDetector(fileInspector);
  });

  afterEach(async () => {
    virtualFileSystemService.clearFileSystem();
  });

  it('detects C# correctly via a .csproj file', async () => {
    const structure: DirectoryJSON = {
      '/project.csproj': '...',
    };

    virtualFileSystemService.setFileSystem(structure);

    const langAtPath = await detector.detectLanguage();
    expect(langAtPath.length).toEqual(1);
    expect(langAtPath[0].language).toEqual(ProgrammingLanguage.CSharp);
    expect(langAtPath[0].path).toEqual(nodePath.sep);
  });

  it("detects it's not a C#", async () => {
    const structure: DirectoryJSON = {
      '/src/index.none': '...',
    };

    virtualFileSystemService.setFileSystem(structure);

    const langAtPath = await detector.detectLanguage();
    expect(langAtPath.length).toEqual(0);
    expect(langAtPath).toEqual([]);
  });

  it('detects C# correctly via cs file', async () => {
    const structure: DirectoryJSON = {
      '/calculator.cs': '...',
    };

    virtualFileSystemService.setFileSystem(structure);

    const langAtPath = await detector.detectLanguage();
    expect(langAtPath.length).toEqual(1);
    expect(langAtPath[0].language).toEqual(ProgrammingLanguage.CSharp);
    expect(langAtPath[0].path).toEqual(nodePath.sep);
  });
});
