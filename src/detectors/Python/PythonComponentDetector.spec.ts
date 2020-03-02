import { PythonComponentDetector } from './PythonComponentDetector';
import { ProgrammingLanguage, ProjectComponentPlatform } from '../../model';
import { PythonPackageInspector } from '../../inspectors/package/PythonPackageInspector';
jest.mock('../../inspectors/package/PythonPackageInspector');

describe('PythonComponentDetector', () => {
  let detector: PythonComponentDetector;
  const MockedPythonPackageInspector = <jest.Mock<PythonPackageInspector>>(<unknown>PythonPackageInspector);
  let mockPythonPackageInspector: PythonPackageInspector;

  beforeAll(async () => {
    mockPythonPackageInspector = new MockedPythonPackageInspector();
  });

  describe('Backend', () => {
    it('Detects BE', async () => {
      detector = new PythonComponentDetector(mockPythonPackageInspector);

      const components = await detector.detectComponent({ language: ProgrammingLanguage.Python, path: './src' });

      expect(components[0].language).toEqual(ProgrammingLanguage.Python);
      expect(components[0].path).toEqual('./src');
      expect(components[0].platform).toEqual(ProjectComponentPlatform.BackEnd);
    });
  });
});
