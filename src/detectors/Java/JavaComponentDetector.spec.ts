import { JavaComponentDetector } from './JavaComponentDetector';
import { ProgrammingLanguage, ProjectComponentPlatform } from '../../model';
import { JavaPackageInspector } from '../../inspectors/package/JavaPackageInspector';
jest.mock('../../inspectors/package/JavaPackageInspector');

describe('JavaComponentDetector', () => {
  let detector: JavaComponentDetector;
  const MockedJavaPackageInspector = <jest.Mock<JavaPackageInspector>>(<unknown>JavaPackageInspector);
  let mockJavaPackageInspector: JavaPackageInspector;

  beforeAll(async () => {
    mockJavaPackageInspector = new MockedJavaPackageInspector();
  });

  describe('Backend', () => {
    it('Detects BE', async () => {
      detector = new JavaComponentDetector(mockJavaPackageInspector);

      const components = await detector.detectComponent({ language: ProgrammingLanguage.Java, path: './src' });

      expect(components[0].language).toEqual(ProgrammingLanguage.Java);
      expect(components[0].path).toEqual('./src');
      expect(components[0].platform).toEqual(ProjectComponentPlatform.BackEnd);
    });
  });
});
