import { DirectoryJSON } from 'memfs';
import { FileInspector } from '../../inspectors';
import { ProgrammingLanguage } from '../../model';
import { FileSystemService } from '../../services';
import { RustLanguageDetector } from './RustLanguageDetector';
import * as nodePath from 'path';

describe('RustLanguageDetector', () => {
  let vfss: FileSystemService;
  let detector: RustLanguageDetector;

  beforeEach(() => {
    vfss = new FileSystemService({ isVirtual: true });

    const fileInspector = new FileInspector(vfss, '/');
    detector = new RustLanguageDetector(fileInspector);
  });

  afterEach(() => {
    vfss.clearFileSystem();
  });

  it('detects Rust correctly by Cargo.toml', async () => {
    const structure: DirectoryJSON = {
      '/project/Cargo.toml': '...',
    };
    vfss.setFileSystem(structure);

    const langAtPath = await detector.detectLanguage();
    expect(langAtPath.length).toEqual(1);
    expect(langAtPath[0].language).toEqual(ProgrammingLanguage.Rust);
    expect(langAtPath[0].path).toEqual(nodePath.normalize('/project'));
  });

  it('detects Rust correctly by .rs files', async () => {
    const structure: DirectoryJSON = {
      '/project/foo/main.rs': '...',
      '/project/foo/module.rs': '...',
      '/project/foo/module/submodule.rs': '...',
    };
    vfss.setFileSystem(structure);

    const langAtPath = await detector.detectLanguage();
    expect(langAtPath.length).toEqual(1);
    expect(langAtPath[0].language).toEqual(ProgrammingLanguage.Rust);
    expect(langAtPath[0].path).toEqual(nodePath.normalize('/project/foo'));
  });

  it('detects Rust correctly by .rs files and strips src from path', async () => {
    const structure: DirectoryJSON = {
      '/project/src/main.rs': '...',
      '/project/src/module.rs': '...',
      '/project/src/module/submodule.rs': '...',
    };
    vfss.setFileSystem(structure);

    const langAtPath = await detector.detectLanguage();
    expect(langAtPath.length).toEqual(1);
    expect(langAtPath[0].language).toEqual(ProgrammingLanguage.Rust);
    expect(langAtPath[0].path).toEqual(nodePath.normalize('/project'));
  });

  it('detects Rust correctly when both Cargo.toml and .rs files are present', async () => {
    const structure: DirectoryJSON = {
      '/project/Cargo.toml': '...',
      '/project/src/module/submodule.rs': '...',
      '/project/src/module/another.rs': '...',
    };
    vfss.setFileSystem(structure);

    const langAtPath = await detector.detectLanguage();
    expect(langAtPath.length).toEqual(1);
    expect(langAtPath[0].language).toEqual(ProgrammingLanguage.Rust);
    expect(langAtPath[0].path).toEqual(nodePath.normalize('/project'));
  });

  it('detects it is not Rust', async () => {
    const structure: DirectoryJSON = {
      '/project/Cargo.notoml': '...',
      '/project/src/module/submodule.notrs': '...',
      '/project/src/module/another.notrs': '...',
    };
    vfss.setFileSystem(structure);

    const langAtPath = await detector.detectLanguage();
    expect(langAtPath).toEqual([]);
  });
});
