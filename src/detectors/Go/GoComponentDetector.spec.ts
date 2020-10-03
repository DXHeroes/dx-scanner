import { GoComponentDetector } from './GoComponentDetector';
import { ProgrammingLanguage, ProjectComponentPlatform } from '../../model';
import { GoPackageInspector } from '../../inspectors/package/GoPackageInspector';
jest.mock('../../inspectors/package/GoPackageInspector');

describe('GoComponentDetector', () => {
  let detector: GoComponentDetector;
  const MockedGoPackageInspector = <jest.Mock<GoPackageInspector>>(<unknown>GoPackageInspector);
  let mockGoPackageInspector: GoPackageInspector;

  beforeAll(async () => {
    mockGoPackageInspector = new MockedGoPackageInspector();
  });

  describe('Backend', () => {
    it('Detects Go BE', async () => {
      detector = new GoComponentDetector(mockGoPackageInspector);

      const components = await detector.detectComponent({ language: ProgrammingLanguage.Go, path: '.' });

      expect(components[0].language).toEqual(ProgrammingLanguage.Go);
      expect(components[0].path).toEqual('.');
      expect(components[0].platform).toEqual(ProjectComponentPlatform.BackEnd);
    });
    it('Detects Go BE application', async () => {
      detector = new GoComponentDetector(mockGoPackageInspector);

      const components = await detector.detectComponent({ language: ProgrammingLanguage.Go, path: './cmd' });

      expect(components[0].language).toEqual(ProgrammingLanguage.Go);
      expect(components[0].path).toEqual('./cmd');
      expect(components[0].platform).toEqual(ProjectComponentPlatform.BackEnd);
    });
    it('Detects Go BE package', async () => {
      detector = new GoComponentDetector(mockGoPackageInspector);

      const components = await detector.detectComponent({ language: ProgrammingLanguage.Go, path: './pkg' });

      expect(components[0].language).toEqual(ProgrammingLanguage.Go);
      expect(components[0].path).toEqual('./pkg');
      expect(components[0].platform).toEqual(ProjectComponentPlatform.BackEnd);
    });
  });
});
