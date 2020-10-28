import { DirectoryJSON } from 'memfs';
import { RustPackageInspector, FileInspector } from '../../inspectors';
import { ProgrammingLanguage, ProjectComponentFramework, ProjectComponentPlatform, ProjectComponentType } from '../../model';
import { FileSystemService } from '../../services';
import { RustComponentDetector } from './RustComponentDetector';
jest.mock('../../inspectors/package/RustPackageInspector');

describe('RustComponentDetector', () => {
  const MockedRustPackageInspector = <jest.Mock<RustPackageInspector>>(<unknown>RustPackageInspector);
  let mockRustPackageInspector: RustPackageInspector;
  let vfs: FileSystemService;

  let detector: RustComponentDetector;

  beforeAll(() => {
    mockRustPackageInspector = new MockedRustPackageInspector();
    vfs = new FileSystemService({ isVirtual: true });
  });

  beforeEach(() => {
    detector = new RustComponentDetector(mockRustPackageInspector, new FileInspector(vfs, '/project'));
  });

  afterEach(() => {
    vfs.clearFileSystem();
  });

  describe('backend', () => {
    it('detects Rust library', async () => {
      const structure: DirectoryJSON = {
        '/project/src/lib.rs': '...',
      };
      vfs.setFileSystem(structure);

      const components = await detector.detectComponent({
        language: ProgrammingLanguage.Rust,
        path: '/project',
      });

      expect(components.length).toEqual(1);
      expect(components[0]).toEqual({
        language: ProgrammingLanguage.Rust,
        path: '/project',
        type: ProjectComponentType.Library,
        platform: ProjectComponentPlatform.BackEnd,
        framework: ProjectComponentFramework.UNKNOWN,
      });
    });

    it('detects Rust application with `src/main.rs`', async () => {
      const structure: DirectoryJSON = {
        '/project/src/main.rs': '...',
      };
      vfs.setFileSystem(structure);

      const components = await detector.detectComponent({
        language: ProgrammingLanguage.Rust,
        path: '/project',
      });

      expect(components.length).toEqual(1);
      expect(components[0]).toEqual({
        language: ProgrammingLanguage.Rust,
        path: '/project',
        type: ProjectComponentType.Application,
        platform: ProjectComponentPlatform.BackEnd,
        framework: ProjectComponentFramework.UNKNOWN,
      });
    });

    it('detects Rust application with `src/bin/nested.rs`', async () => {
      const structure: DirectoryJSON = {
        '/project/src/bin/nested.rs': '...',
      };
      vfs.setFileSystem(structure);

      const components = await detector.detectComponent({
        language: ProgrammingLanguage.Rust,
        path: '/project',
      });

      expect(components.length).toEqual(1);
      expect(components[0]).toEqual({
        language: ProgrammingLanguage.Rust,
        path: '/project',
        type: ProjectComponentType.Application,
        platform: ProjectComponentPlatform.BackEnd,
        framework: ProjectComponentFramework.UNKNOWN,
      });
    });

    it('detects Rust application with `src/bin/nested/main.rs`', async () => {
      const structure: DirectoryJSON = {
        '/project/src/bin/nested/main.rs': '...',
      };
      vfs.setFileSystem(structure);

      const components = await detector.detectComponent({
        language: ProgrammingLanguage.Rust,
        path: '/project',
      });

      expect(components.length).toEqual(1);
      expect(components[0]).toEqual({
        language: ProgrammingLanguage.Rust,
        path: '/project',
        type: ProjectComponentType.Application,
        platform: ProjectComponentPlatform.BackEnd,
        framework: ProjectComponentFramework.UNKNOWN,
      });
    });

    it('detects Rust application with bin entry in cargo manifest', async () => {
      mockRustPackageInspector.cargoManifest = {
        package: {
          name: '',
          version: ''
        },
        bin: [
          {
            name: 'bar',
            path: '/project/foo/bar.rs',
          },
        ],
        target: {},
        dependencies: [],
        'dev-dependencies': [],
        'build-dependencies': []
      };

      const components = await detector.detectComponent({
        language: ProgrammingLanguage.Rust,
        path: '/project',
      });

      expect(components.length).toEqual(1);
      expect(components[0]).toEqual({
        language: ProgrammingLanguage.Rust,
        path: '/project',
        type: ProjectComponentType.Application,
        platform: ProjectComponentPlatform.BackEnd,
        framework: ProjectComponentFramework.UNKNOWN,
      });
    });

    it('detects Rust rust application and library in all possible forms', async () => {
      const structure: DirectoryJSON = {
        '/project/src/lib.rs': '...',
        '/project/src/main.rs': '...',
        '/project/src/bin/nested.rs': '...',
        '/project/src/bin/nested/main.rs': '...',
      };
      vfs.setFileSystem(structure);

      const components = await detector.detectComponent({
        language: ProgrammingLanguage.Rust,
        path: '/project',
      });

      expect(components.length).toEqual(2);
      expect(components[0]).toEqual({
        language: ProgrammingLanguage.Rust,
        path: '/project',
        type: ProjectComponentType.Library,
        platform: ProjectComponentPlatform.BackEnd,
        framework: ProjectComponentFramework.UNKNOWN,
      });
      expect(components[1]).toEqual({
        language: ProgrammingLanguage.Rust,
        path: '/project',
        type: ProjectComponentType.Application,
        platform: ProjectComponentPlatform.BackEnd,
        framework: ProjectComponentFramework.UNKNOWN,
      });
    });
  });
});
