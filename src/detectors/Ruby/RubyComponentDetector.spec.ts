import { RubyComponentDetector } from './RubyComponentDetector';
import { ProgrammingLanguage, ProjectComponentPlatform } from '../../model';
import { RubyPackageInspector } from '../../inspectors/package/RubyPackageInspector';
import { mockPackage } from '../../test/helpers/mockPackage';
jest.mock('../../inspectors/package/RubyPackageInspector');

describe('RubyComponentDetector', () => {
  let detector: RubyComponentDetector;
  const MockedRubyPackageInspector = <jest.Mock<RubyPackageInspector>>(<unknown>RubyPackageInspector);
  let mockRubyPackageInspector: RubyPackageInspector;

  beforeAll(async () => {
    mockRubyPackageInspector = new MockedRubyPackageInspector();
  });

  describe('Rails', () => {
    it('Detects Ruby on Rails framework when particular packages are present', async () => {
      mockRubyPackageInspector.packages = [mockPackage('rails')];

      mockRubyPackageInspector.hasOneOfPackages = (packages: string[]) => {
        const files = packages.filter((file) => file === 'rails');
        if (files.length > 0) {
          return true;
        }
        return false;
      };

      detector = new RubyComponentDetector(mockRubyPackageInspector);

      const components = await detector.detectComponent({ language: ProgrammingLanguage.Ruby, path: './src' });

      expect(components.length).toEqual(1);
      expect(components[0].language).toEqual(ProgrammingLanguage.Ruby);
      expect(components[0].path).toEqual('./');
      expect(components[0].platform).toEqual(ProjectComponentPlatform.Rails);
    });
  });

  describe('Frontend', () => {
    it('Detects Webpacker in Rails when particular packages are present', async () => {
      mockRubyPackageInspector.packages = [mockPackage('webpacker')];

      mockRubyPackageInspector.hasOneOfPackages = (packages: string[]) => {
        const files = packages.filter((file) => file === 'webpacker');
        if (files.length > 0) {
          return true;
        }
        return false;
      };

      detector = new RubyComponentDetector(mockRubyPackageInspector);

      const components = await detector.detectComponent({ language: ProgrammingLanguage.Ruby, path: './' });

      expect(components.length).toEqual(1);
      expect(components[0].language).toEqual(ProgrammingLanguage.Ruby);
      expect(components[0].path).toEqual('./');
      expect(components[0].platform).toEqual(ProjectComponentPlatform.FrontEnd);
    });
  });

  describe('PostgreSQL', () => {
    it('Detects PostgreSQL in Rails when particular packages are present', async () => {
      mockRubyPackageInspector.packages = [mockPackage('pg')];

      mockRubyPackageInspector.hasOneOfPackages = (packages: string[]) => {
        const files = packages.filter((file) => file === 'pg');
        if (files.length > 0) {
          return true;
        }
        return false;
      };

      detector = new RubyComponentDetector(mockRubyPackageInspector);

      const components = await detector.detectComponent({ language: ProgrammingLanguage.Ruby, path: './' });

      expect(components.length).toEqual(1);
      expect(components[0].language).toEqual(ProgrammingLanguage.Ruby);
      expect(components[0].path).toEqual('./');
      expect(components[0].platform).toEqual(ProjectComponentPlatform.PostgreSQL);
    });
  });

  it('Detects NO frameworks or gems when no packages are present', async () => {
    mockRubyPackageInspector.hasOneOfPackages = () => false;
    detector = new RubyComponentDetector(mockRubyPackageInspector);

    const components = await detector.detectComponent({ language: ProgrammingLanguage.Ruby, path: './' });
    expect(components[0].platform).toEqual(ProjectComponentPlatform.UNKNOWN);
  });
});
