import { PHPComponentDetector } from './PHPComponentDetector';
import { ProgrammingLanguage, ProjectComponentPlatform } from '../../model';
import { PHPPackageInspector } from '../../inspectors/package/PHPPackageInspector';
jest.mock('../../inspectors/package/PHPPackageInspector');

describe('PHPComponentDetector', () => {
  let detector: PHPComponentDetector;
  const MockedPHPPackageInspector = <jest.Mock<PHPPackageInspector>>(<unknown>PHPPackageInspector);
  let mockPHPPackageInspector: PHPPackageInspector;

  beforeAll(async () => {
    mockPHPPackageInspector = new MockedPHPPackageInspector();
  });

  describe('Backend', () => {
    it('Detects PHP BE', async () => {
      detector = new PHPComponentDetector(mockPHPPackageInspector);

      const components = await detector.detectComponent({ language: ProgrammingLanguage.PHP, path: '.' });

      expect(components[0].language).toEqual(ProgrammingLanguage.PHP);
      expect(components[0].path).toEqual('.');
      expect(components[0].platform).toEqual(ProjectComponentPlatform.BackEnd);
    });
  });
});
