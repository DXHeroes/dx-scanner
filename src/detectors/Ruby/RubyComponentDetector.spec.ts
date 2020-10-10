import { RubyComponentDetector } from './RubyComponentDetector';
import { ProgrammingLanguage, ProjectComponentPlatform } from '../../model';
import { RubyPackageInspector } from '../../inspectors/package/RubyPackageInspector';
jest.mock('../../inspectors/package/RubyPackageInspector');

describe('RubyComponentDetector', () => {
  let detector: RubyComponentDetector;
  const MockedRubyPackageInspector = <jest.Mock<RubyPackageInspector>>(<unknown>RubyPackageInspector);
  let mockRubyPackageInspector: RubyPackageInspector;

  beforeAll(async () => {
    mockRubyPackageInspector = new MockedRubyPackageInspector();
  });

  describe('Backend', () => {
    it('Detects Ruby BackEnd', async () => {
      detector = new RubyComponentDetector(mockRubyPackageInspector);

      const components = await detector.detectComponent({ language: ProgrammingLanguage.Ruby, path: './src' });

      expect(components[0].language).toEqual(ProgrammingLanguage.Ruby);
      expect(components[0].path).toEqual('./src');
      expect(components[0].platform).toEqual(ProjectComponentPlatform.BackEnd);
    });
  });
});
