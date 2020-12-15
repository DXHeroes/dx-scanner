import { JavaComponentDetector } from './JavaComponentDetector';
import { ProgrammingLanguage, ProjectComponentPlatform } from '../../model';
import { JavaPackageInspector } from '../../inspectors/package/JavaPackageInspector';
import { FileSystemService } from '../../services';
import { FileInspector } from '../../inspectors';
import { DirectoryJSON } from 'memfs';
jest.mock('../../inspectors/package/JavaPackageInspector');

describe('JavaComponentDetector', () => {
  let detector: JavaComponentDetector;
  const MockedJavaPackageInspector = <jest.Mock<JavaPackageInspector>>(<unknown>JavaPackageInspector);
  let mockJavaPackageInspector: JavaPackageInspector;
  let virtualFileSystemService: FileSystemService;

  beforeAll(async () => {
    mockJavaPackageInspector = new MockedJavaPackageInspector();
    virtualFileSystemService = new FileSystemService({ isVirtual: true });
  });

  let fileInspector: FileInspector;

  beforeEach(() => {
    fileInspector = new FileInspector(virtualFileSystemService, '/');
  });

  afterEach(() => {
    virtualFileSystemService.clearFileSystem();
  });

  describe('Backend', () => {
    it('Detects Java BE', async () => {
      detector = new JavaComponentDetector(mockJavaPackageInspector, fileInspector);

      const components = await detector.detectComponent({ language: ProgrammingLanguage.Java, path: './src' });

      expect(components[0].language).toEqual(ProgrammingLanguage.Java);
      expect(components[0].path).toEqual('./src');
      expect(components[0].platform).toEqual(ProjectComponentPlatform.BackEnd);
    });

    it('Detects Kotlin BE', async () => {
      detector = new JavaComponentDetector(mockJavaPackageInspector, fileInspector);

      const components = await detector.detectComponent({ language: ProgrammingLanguage.Kotlin, path: './src' });

      expect(components[0].language).toEqual(ProgrammingLanguage.Kotlin);
      expect(components[0].path).toEqual('./src');
      expect(components[0].platform).toEqual(ProjectComponentPlatform.BackEnd);
    });
  });

  describe('Android', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('Detects Java Android', async () => {
      detector = new JavaComponentDetector(mockJavaPackageInspector, fileInspector);

      const structure: DirectoryJSON = {
        '/AndroidManifest.xml': '...',
      };

      virtualFileSystemService.setFileSystem(structure);

      const components = await detector.detectComponent({ language: ProgrammingLanguage.Java, path: './src' });

      expect(components[0].language).toEqual(ProgrammingLanguage.Java);
      expect(components[0].path).toEqual('./src');
      expect(components[0].platform).toEqual(ProjectComponentPlatform.Android);
    });

    it('Detects Kotlin Android', async () => {
      detector = new JavaComponentDetector(mockJavaPackageInspector, fileInspector);

      const structure: DirectoryJSON = {
        '/AndroidManifest.xml': '...',
      };

      virtualFileSystemService.setFileSystem(structure);

      const components = await detector.detectComponent({ language: ProgrammingLanguage.Kotlin, path: './src' });

      expect(components[0].language).toEqual(ProgrammingLanguage.Kotlin);
      expect(components[0].path).toEqual('./src');
      expect(components[0].platform).toEqual(ProjectComponentPlatform.Android);
    });
  });
});
