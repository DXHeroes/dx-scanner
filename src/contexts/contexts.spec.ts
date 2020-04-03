import { createTestContainer, TestContainerContext } from '../inversify.config';
import { Types, DiscoveryContextFactory } from '../types';
import { ProgrammingLanguage, ProjectComponentFramework, ProjectComponentPlatform, ProjectComponentType } from '../model';
import { ServiceType } from '../detectors/IScanningStrategy';

describe('Contexts (And bindings)', () => {
  let ctx: TestContainerContext;

  beforeEach(() => {
    ctx = createTestContainer({ uri: '.' });
  });

  const createDiscoveryCtx = () => {
    const discoveryCtxFactory: DiscoveryContextFactory = ctx.container.get(Types.DiscoveryContextFactory);
    const discoveryCtx = discoveryCtxFactory({
      baseUrl: 'https://github.com',
      host: 'github.com',
      remoteUrl: 'https://github.com/DXHeroes/dx-scanner',
      protocol: 'https',
    });
    return discoveryCtx;
  };

  const scanStrategy = {
    serviceType: ServiceType.git,
    accessType: undefined,
    localPath: undefined,
    remoteUrl: undefined,
    isOnline: false,
  };
  const languageAtPathMock = { language: ProgrammingLanguage.JavaScript, path: './var/foo' };
  const componentMock = {
    framework: ProjectComponentFramework.UNKNOWN,
    language: ProgrammingLanguage.JavaScript,
    path: './var/foo',
    platform: ProjectComponentPlatform.BackEnd,
    type: ProjectComponentType.Application,
  };

  const createScannerCtx = () => {
    return createDiscoveryCtx().getScanningContext(scanStrategy);
  };

  const createLangCtx = () => {
    return createScannerCtx().getLanguageContext(languageAtPathMock);
  };

  const createComponentCtx = () => {
    return createLangCtx().getProjectComponentContext(componentMock);
  };

  describe('ScannerContext', () => {
    it('Can be created via ScannerContextFactory', () => {
      expect(createScannerCtx()).toBeDefined();
    });
    it('Has language detectors', () => {
      expect(createScannerCtx().languageDetectors.length).toBeGreaterThan(0);
    });
    it('Can create language context', () => {
      const langCtx = createScannerCtx().getLanguageContext(languageAtPathMock);
      expect(langCtx).toBeDefined();
    });
    it('Throw error', async () => {
      try {
        await createScannerCtx().init();
        fail();
      } catch (error) {
        expect(error.message).toEqual('Not implemented');
      }
    });
  });

  describe('LanguageContext', () => {
    it('Has correct Language and Path properties', () => {
      const langCtx = createLangCtx();
      expect(langCtx.language).toEqual(languageAtPathMock.language);
      expect(langCtx.path).toEqual(languageAtPathMock.path);
      expect(langCtx.languageAtPath).toEqual(languageAtPathMock);
    });
    it('Has project component detectors', () => {
      expect(createLangCtx().getProjectComponentDetectors().length).toBeGreaterThan(0);
    });
    it('Has ProjectComponentContext', () => {
      expect(createLangCtx().getProjectComponentContext(componentMock)).toBeDefined();
    });
  });

  describe('ProjectComponentContext', () => {
    it('Has correct properties', () => {
      const componentCtx = createComponentCtx();
      expect(componentCtx.language).toEqual(languageAtPathMock.language);
      expect(componentCtx.path).toEqual(languageAtPathMock.path);
      expect(componentCtx.projectComponent).toEqual(componentMock);
    });
    it('Has PracticeContext', () => {
      expect(createComponentCtx().getPracticeContext()).toBeDefined();
    });
  });
});
