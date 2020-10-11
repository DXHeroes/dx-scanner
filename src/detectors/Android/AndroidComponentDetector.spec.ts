import { AndroidComponentDetector } from './AndroidComponentDetector';
import { ProgrammingLanguage, ProjectComponentPlatform } from '../../model';
import { JavaPackageInspector } from '../../inspectors/package/JavaPackageInspector';
jest.mock('../../inspectors/package/JavaPackageInspector');

describe('AndroidComponentDetector', () => {
  let detector: AndroidComponentDetector;
  const MockedJavaPackageInspector = <jest.Mock<JavaPackageInspector>>(<unknown>JavaPackageInspector);
  let mockJavaPackageInspector: JavaPackageInspector;

  beforeAll(async () => {
    mockJavaPackageInspector = new MockedJavaPackageInspector();
  });

  describe('Android', () => {
    it('Detects Java', async () => {
      detector = new AndroidComponentDetector(mockJavaPackageInspector);

      const components = await detector.detectComponent({ language: ProgrammingLanguage.Java, path: './app' });

      expect(components[0].language).toEqual(ProgrammingLanguage.Java);
      expect(components[0].path).toEqual('./app');
      expect(components[0].platform).toEqual(ProjectComponentPlatform.Android);
    });

    it('Detects Kotlin', async () => {
      detector = new AndroidComponentDetector(mockJavaPackageInspector);

      const components = await detector.detectComponent({ language: ProgrammingLanguage.Kotlin, path: './app' });

      expect(components[0].language).toEqual(ProgrammingLanguage.Kotlin);
      expect(components[0].path).toEqual('./app');
      expect(components[0].platform).toEqual(ProjectComponentPlatform.Android);
    });
  });
});
