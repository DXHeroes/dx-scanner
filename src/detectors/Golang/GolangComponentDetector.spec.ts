import { GolangComponentDetector } from './GolangComponentDetector';
import { ProgrammingLanguage, ProjectComponentPlatform } from '../../model';
import { GolangPackageInspector } from '../../inspectors/package/GolangPackageInspector';
jest.mock('../../inspectors/package/GolangPackageInspector');

describe('GolangComponentDetector', () => {
  let detector: GolangComponentDetector;
  const MockedGolangPackageInspector = <jest.Mock<GolangPackageInspector>>(<unknown>GolangPackageInspector);
  let mockGolangPackageInspector: GolangPackageInspector;

  beforeAll(async () => {
    mockGolangPackageInspector = new MockedGolangPackageInspector();
  });

  describe('Backend', () => {
    it('Detects Golang BE', async () => {
      detector = new GolangComponentDetector(mockGolangPackageInspector);

      const components = await detector.detectComponent({ language: ProgrammingLanguage.Go, path: '.' });

      expect(components[0].language).toEqual(ProgrammingLanguage.Go);
      expect(components[0].path).toEqual('.');
      expect(components[0].platform).toEqual(ProjectComponentPlatform.BackEnd);
    });
    it('Detects Golang BE application', async () => {
      detector = new GolangComponentDetector(mockGolangPackageInspector);

      const components = await detector.detectComponent({ language: ProgrammingLanguage.Go, path: './cmd' });

      expect(components[0].language).toEqual(ProgrammingLanguage.Go);
      expect(components[0].path).toEqual('./cmd');
      expect(components[0].platform).toEqual(ProjectComponentPlatform.BackEnd);
    });
    it('Detects Golang BE package', async () => {
      detector = new GolangComponentDetector(mockGolangPackageInspector);

      const components = await detector.detectComponent({ language: ProgrammingLanguage.Go, path: './pkg' });

      expect(components[0].language).toEqual(ProgrammingLanguage.Go);
      expect(components[0].path).toEqual('./pkg');
      expect(components[0].platform).toEqual(ProjectComponentPlatform.BackEnd);
    });
  });
});
