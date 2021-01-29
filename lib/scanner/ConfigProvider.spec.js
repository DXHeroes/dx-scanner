"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ConfigProvider_1 = require("./ConfigProvider");
const inversify_config_1 = require("../inversify.config");
const services_1 = require("../services");
const inspectors_1 = require("../inspectors");
describe('ConfigProvider', () => {
    let configProvider;
    let containerCtx;
    let virtualFileSystemService;
    beforeEach(() => {
        containerCtx = inversify_config_1.createTestContainer({ uri: '.' });
        virtualFileSystemService = new services_1.FileSystemService({ isVirtual: true });
        const fileInspector = new inspectors_1.FileInspector(virtualFileSystemService, '/');
        configProvider = new ConfigProvider_1.ConfigProvider(fileInspector);
    });
    afterEach(async () => {
        containerCtx.virtualFileSystemService.clearFileSystem();
        containerCtx.practiceContext.fileInspector.purgeCache();
    });
    it('Init ConfigProvider properly via dxscannerrc.json', async () => {
        const structure = {
            '/dxscannerrc.json': `{
        "practices": {
          "JavaScript.GitignoreCorrectlySet": "medium"
        }
      }`,
        };
        virtualFileSystemService.setFileSystem(structure);
        await configProvider.init();
        expect(configProvider.config).toBeDefined();
    });
    it('Init ConfigProvider properly via dxscannerrc.yml', async () => {
        const structure = {
            '/dxscannerrc.yml': `practices:
      JavaScript.DependenciesVersionMinorPatchLevel: medium`,
        };
        virtualFileSystemService.setFileSystem(structure);
        await configProvider.init();
        expect(configProvider.config).toBeDefined();
    });
    it('Does not init Config Provider if there is no config file', async () => {
        const structure = {
            '/no.config': '...',
        };
        virtualFileSystemService.setFileSystem(structure);
        await configProvider.init();
        expect(configProvider.config).not.toBeDefined();
    });
    it('Get configuration of practice if it is just a string', async () => {
        const structure = {
            '/dxscannerrc.json': `{
        "practices": {
          "JavaScript.GitignoreCorrectlySet": "medium"
        }
      }`,
        };
        virtualFileSystemService.setFileSystem(structure);
        await configProvider.init();
        const practiceConfig = configProvider.getOverriddenPractice('JavaScript.GitignoreCorrectlySet');
        expect(practiceConfig).toEqual({ impact: 'medium' });
    });
    it('Get configuration of practice if it is an object', async () => {
        const structure = {
            '/dxscannerrc.json': `{
        "practices": {
          "JavaScript.GitignoreCorrectlySet": {
              "impact": "medium"
          }
        }
      }`,
        };
        virtualFileSystemService.setFileSystem(structure);
        await configProvider.init();
        const practiceConfig = configProvider.getOverriddenPractice('JavaScript.GitignoreCorrectlySet');
        expect(practiceConfig).toEqual({ impact: 'medium' });
    });
    it('Get correct configuration of a practice requiring maximum threshold limits', async () => {
        const structure = {
            '/dxscannerrc.yml': `
      practices:
        JavaScript.DependenciesVersionMinorPatchLevel: medium
        LanguageIndependent.ThinPullRequestsPractice:
          impact: high
          override:
            measurePullRequestCount: 1`,
        };
        virtualFileSystemService.setFileSystem(structure);
        await configProvider.init();
        const practiceConfig = configProvider.getOverriddenPractice('LanguageIndependent.ThinPullRequestsPractice');
        expect(practiceConfig).toEqual({ impact: 'high', override: { measurePullRequestCount: 1 } });
    });
    it('Maximum threshold is undefined if it is not provided', async () => {
        const structure = {
            '/dxscannerrc.yaml': `
      practices:
        JavaScript.DependenciesVersionMinorPatchLevel: medium
        LanguageIndependent.ThinPullRequestsPractice:
          impact: small`,
        };
        virtualFileSystemService.setFileSystem(structure);
        await configProvider.init();
        const practiceConfig = configProvider.getOverriddenPractice('LanguageIndependent.ThinPullRequestsPractice');
        expect(practiceConfig).toEqual({ impact: 'small', override: undefined });
    });
    it('Returns undefined if there is no config file', async () => {
        const practiceConfig = configProvider.getOverriddenPractice('JavaScript.GitignoreCorrectlySet');
        expect(practiceConfig).toEqual(undefined);
    });
});
//# sourceMappingURL=ConfigProvider.spec.js.map