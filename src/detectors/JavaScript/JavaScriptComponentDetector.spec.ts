import { JavaScriptComponentDetector } from './JavaScriptComponentDetector';
import { ProgrammingLanguage, ProjectComponentPlatform } from '../../model';
import { JavaScriptPackageInspector } from '../../inspectors/package/JavaScriptPackageInspector';
import { mockPackage } from '../../../test/helpers/mockPackage';
jest.mock('../../inspectors/package/JavaScriptPackageInspector');

describe('JavaScriptComponentDetector', () => {
  let detector: JavaScriptComponentDetector;
  const MockedJSPackageInspector = <jest.Mock<JavaScriptPackageInspector>>(<unknown>JavaScriptPackageInspector);
  let mockJsPackageInspector: JavaScriptPackageInspector;

  beforeAll(async () => {
    mockJsPackageInspector = new MockedJSPackageInspector();
  });

  describe('Backend', () => {
    it('Detects BE JS component when te particular packages are present', async () => {
      mockJsPackageInspector.packages = [mockPackage('express')];

      mockJsPackageInspector.hasOneOfPackages = (packages: string[]) => {
        const files = packages.filter((file) => file === 'express');
        if (files.length > 0) {
          return true;
        }
        return false;
      };

      detector = new JavaScriptComponentDetector(mockJsPackageInspector);

      const components = await detector.detectComponent({ language: ProgrammingLanguage.JavaScript, path: './src' });

      expect(components.length).toEqual(1);
      expect(components[0].language).toEqual(ProgrammingLanguage.JavaScript);
      expect(components[0].path).toEqual('./src');
      expect(components[0].platform).toEqual(ProjectComponentPlatform.BackEnd);
    });
  });

  describe('Frontend', () => {
    it('Detects FE JS component when te particular packages are present', async () => {
      mockJsPackageInspector.packages = [mockPackage('webpack')];

      mockJsPackageInspector.hasOneOfPackages = (packages: string[]) => {
        const files = packages.filter((file) => file === 'webpack');
        if (files.length > 0) {
          return true;
        }
        return false;
      };

      detector = new JavaScriptComponentDetector(mockJsPackageInspector);

      const components = await detector.detectComponent({ language: ProgrammingLanguage.JavaScript, path: './src' });
      components[0].platform = ProjectComponentPlatform.FrontEnd;

      expect(components[0].language).toEqual(ProgrammingLanguage.JavaScript);
      expect(components[0].path).toEqual('./src');
      expect(components[0].platform).toEqual(ProjectComponentPlatform.FrontEnd);
    });
  });

  it('Detects NO BE JS component nor FE JS when no packages are present', async () => {
    mockJsPackageInspector.hasOneOfPackages = () => false;
    detector = new JavaScriptComponentDetector(mockJsPackageInspector);

    const components = await detector.detectComponent({ language: ProgrammingLanguage.JavaScript, path: './src' });
    expect(components[0].platform).toEqual(ProjectComponentPlatform.UNKNOWN);
  });
});
