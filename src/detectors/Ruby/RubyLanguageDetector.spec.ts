import { FileInspector } from '../../inspectors/FileInspector';
import { ProgrammingLanguage } from '../../model';
import { FileSystemService } from '../../services/FileSystemService';
import * as nodePath from 'path';
import { DirectoryJSON } from 'memfs/lib/volume';
import { RubyLanguageDetector } from './RubyLanguageDetector';

describe('RubyLanguageDetector', () => {
  let detector: RubyLanguageDetector;
  let virtualFileSystemService: FileSystemService;

  beforeEach(() => {
    virtualFileSystemService = new FileSystemService({ isVirtual: true });

    const fileInspector = new FileInspector(virtualFileSystemService, '/');
    detector = new RubyLanguageDetector(fileInspector);
  });

  afterEach(async () => {
    virtualFileSystemService.clearFileSystem();
  });

  it('detects ruby correctly via gemspec file', async () => {
    const structure: DirectoryJSON = {
      '/scan.gemspec': '...',
    };

    virtualFileSystemService.setFileSystem(structure);

    const langAtPath = await detector.detectLanguage();
    expect(langAtPath.length).toEqual(1);
    expect(langAtPath[0].language).toEqual(ProgrammingLanguage.Ruby);
    expect(langAtPath[0].path).toEqual(nodePath.sep);
  });

  it("detects it's not a ruby file", async () => {
    const structure: DirectoryJSON = {
      '/src/index.none': '...',
    };

    virtualFileSystemService.setFileSystem(structure);

    const langAtPath = await detector.detectLanguage();
    expect(langAtPath.length).toEqual(0);
    expect(langAtPath).toEqual([]);
  });

  it('detects ruby correctly via rb file', async () => {
    const structure: DirectoryJSON = {
      '/index.rb': '...',
    };

    virtualFileSystemService.setFileSystem(structure);

    const langAtPath = await detector.detectLanguage();
    expect(langAtPath.length).toEqual(1);
    expect(langAtPath[0].language).toEqual(ProgrammingLanguage.Ruby);
    expect(langAtPath[0].path).toEqual(nodePath.sep);
  });
});
