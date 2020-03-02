import { ConfigProvider } from './ConfigProvider';
import { TestContainerContext, createTestContainer } from '../inversify.config';
import { FileSystemService } from '../services';
import { FileInspector } from '../inspectors';
import { DirectoryJSON } from 'memfs/lib/volume';

describe('ConfigProvider', () => {
  let configProvider: ConfigProvider;
  let containerCtx: TestContainerContext;
  let virtualFileSystemService: FileSystemService;

  beforeEach(() => {
    containerCtx = createTestContainer({ uri: '.' });
    virtualFileSystemService = new FileSystemService({ isVirtual: true });
    const fileInspector = new FileInspector(virtualFileSystemService, '/');
    configProvider = new ConfigProvider(fileInspector);
  });

  afterEach(async () => {
    containerCtx.virtualFileSystemService.clearFileSystem();
    containerCtx.practiceContext.fileInspector!.purgeCache();
  });

  it('Init ConfigProvider properly via dxscannerrc.json', async () => {
    const structure: DirectoryJSON = {
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
    const structure: DirectoryJSON = {
      '/dxscannerrc.yml': `practices:
      JavaScript.DependenciesVersionMinorPatchLevel: medium`,
    };
    virtualFileSystemService.setFileSystem(structure);

    await configProvider.init();
    expect(configProvider.config).toBeDefined();
  });

  it('Does not init Config Provider if there is no config file', async () => {
    const structure: DirectoryJSON = {
      '/no.config': '...',
    };
    virtualFileSystemService.setFileSystem(structure);

    await configProvider.init();
    expect(configProvider.config).not.toBeDefined();
  });

  it('Get configuration of practice if it is just a string', async () => {
    const structure: DirectoryJSON = {
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
    const structure: DirectoryJSON = {
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
    const structure: DirectoryJSON = {
      '/dxscannerrc.yml': `
      practices:
        JavaScript.DependenciesVersionMinorPatchLevel: medium
        LanguageIndependent.ThinPullRequestsPractice:
          impact: high
          maxThreshold:
            measurePullRequestCount: 1`,
    };
    virtualFileSystemService.setFileSystem(structure);

    await configProvider.init();
    const practiceConfig = configProvider.getOverriddenPractice('LanguageIndependent.ThinPullRequestsPractice');
    expect(practiceConfig).toEqual({ impact: 'high', maxThreshold: { measurePullRequestCount: 1 } });
  });

  it('Maximum threshold is undefined if it is not provided', async () => {
    const structure: DirectoryJSON = {
      '/dxscannerrc.yaml': `
      practices:
        JavaScript.DependenciesVersionMinorPatchLevel: medium
        LanguageIndependent.ThinPullRequestsPractice:
          impact: small`,
    };
    virtualFileSystemService.setFileSystem(structure);

    await configProvider.init();
    const practiceConfig = configProvider.getOverriddenPractice('LanguageIndependent.ThinPullRequestsPractice');
    expect(practiceConfig).toEqual({ impact: 'small', maxThreshold: undefined });
  });

  it('Returns undefined if there is no config file', async () => {
    const practiceConfig = configProvider.getOverriddenPractice('JavaScript.GitignoreCorrectlySet');
    expect(practiceConfig).toEqual(undefined);
  });
});
