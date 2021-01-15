import nock from 'nock';
import git from 'simple-git/promise';
import { createTestContainer } from '../inversify.config';
import { GitHubNock } from '../test/helpers/gitHubNock';
import { ScanningStrategyDetector, ScanningStrategy } from './ScanningStrategyDetector';
import { GitHubService, BitbucketService } from '../services';
import { GitLabService } from '../services/gitlab/GitLabService';
import { argumentsProviderFactory } from '../test/factories/ArgumentsProviderFactory';
import { ArgumentsProvider } from '../scanner';
import { ServiceType, AccessType } from './IScanningStrategy';
import { GitLabNock } from '../test/helpers/gitLabNock';
jest.mock('simple-git/promise');

describe('ScanningStrategyDetector', () => {
  const mockedGit = <jest.Mock>(<unknown>git);

  beforeEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  describe('#detect', () => {
    it('local path without remote', async () => {
      const nock = new GitLabNock('DXHeroes', 'dx-scanner', 'gitlab.com');
      nock.listProjects();
      nock.listGroups();
      nock.checkVersion();
      nock.getRepoResponse(404);

      mockedGit.mockImplementation(() => {
        return {
          checkIsRepo: () => true,
          revparse: () => '/local/path',
          getRemotes: () => [],
        };
      });

      const scanningStrategyDetector = await createScanningStrategyDetector({ uri: '/local/path' });
      const result = await scanningStrategyDetector.detect();

      expect(result).toEqual(<ScanningStrategy>{
        accessType: undefined,
        localPath: '/local/path',
        rootPath: '/local/path',
        remoteUrl: undefined,
        isOnline: false,
        serviceType: ServiceType.local,
      });
    });

    it('local path that is a git repository', async () => {
      const repoPath = 'git@github.com:DXHeroes/dx-scanner.git';
      mockedGit.mockImplementation(() => {
        return {
          checkIsRepo: () => true,
          revparse: () => '/local/rootDir',
          getRemotes: () => [{ name: 'origin', refs: { fetch: repoPath, push: repoPath } }],
        };
      });
      new GitHubNock('1', 'DXHeroes', 1, 'dx-scanner').getRepo('').reply(200);

      const scanningStrategyDetector = await createScanningStrategyDetector({ uri: '/local/rootDir/subDir' });
      const result = await scanningStrategyDetector.detect();

      expect(result).toEqual(<ScanningStrategy>{
        accessType: AccessType.public,
        localPath: '/local/rootDir/subDir',
        rootPath: '/local/rootDir',
        remoteUrl: repoPath,
        isOnline: true,
        serviceType: ServiceType.github,
      });
    });

    it('local path that is not a git repository', async () => {
      const nock = new GitLabNock('DXHeroes', 'dx-scanner', 'gitlab.com');
      nock.listProjects();
      nock.listGroups();
      nock.checkVersion();
      nock.getRepoResponse(404);

      mockedGit.mockImplementation(() => {
        return {
          checkIsRepo: () => false,
          getRemotes: () => [],
        };
      });

      const scanningStrategyDetector = await createScanningStrategyDetector({ uri: '/local/rootDir/subDir' });
      const result = await scanningStrategyDetector.detect();

      expect(result).toEqual(<ScanningStrategy>{
        accessType: undefined,
        localPath: '/local/rootDir/subDir',
        rootPath: '/local/rootDir/subDir',
        remoteUrl: undefined,
        isOnline: false,
        serviceType: ServiceType.local,
      });
    });

    it('local path with remote public GitHub and auth', async () => {
      const repoPath = 'git@github.com:DXHeroes/dx-scanner.git';
      new GitHubNock('1', 'DXHeroes', 1, 'dx-scanner').getRepo('').reply(200);

      mockedGit.mockImplementation(() => {
        return {
          checkIsRepo: () => true,
          revparse: () => '/local/path',
          getRemotes: () => [{ name: 'origin', refs: { fetch: repoPath, push: repoPath } }],
        };
      });

      const scanningStrategyDetector = await createScanningStrategyDetector({ uri: '/local/path', auth: 'fake_token' });
      const result = await scanningStrategyDetector.detect();

      expect(result).toEqual(<ScanningStrategy>{
        accessType: AccessType.public,
        localPath: '/local/path',
        rootPath: '/local/path',
        remoteUrl: repoPath,
        isOnline: true,
        serviceType: ServiceType.github,
      });
    });

    it('offline local path with remote public GitHub and auth', async () => {
      const repoPath = 'git@github.com:DXHeroes/dx-scanner.git';
      nock.disableNetConnect();
      new GitHubNock('1', 'DXHeroes', 1, 'dx-scanner').getRepo('').reply(500);

      mockedGit.mockImplementation(() => {
        return {
          checkIsRepo: () => true,
          revparse: () => '/local/path',
          getRemotes: () => [{ name: 'origin', refs: { fetch: repoPath, push: repoPath } }],
        };
      });

      const scanningStrategyDetector = await createScanningStrategyDetector({ uri: '/local/path', auth: 'fake_token' });
      const result = await scanningStrategyDetector.detect();

      expect(result).toEqual(<ScanningStrategy>{
        accessType: AccessType.unknown,
        localPath: '/local/path',
        rootPath: '/local/path',
        remoteUrl: repoPath,
        isOnline: false,
        serviceType: ServiceType.github,
      });
    });

    it('local path with remote public GitHub and no auth', async () => {
      const repoPath = 'git@github.com:DXHeroes/dx-scanner.git';
      new GitHubNock('1', 'DXHeroes', 1, 'dx-scanner').getRepo('').reply(200);

      mockedGit.mockImplementation(() => {
        return {
          checkIsRepo: () => true,
          revparse: () => '/local/path',
          getRemotes: () => [{ name: 'origin', refs: { fetch: repoPath, push: repoPath } }],
        };
      });

      const scanningStrategyDetector = await createScanningStrategyDetector({ uri: '/local/path' });
      const result = await scanningStrategyDetector.detect();

      expect(result).toEqual(<ScanningStrategy>{
        accessType: 'public',
        localPath: '/local/path',
        rootPath: '/local/path',
        remoteUrl: repoPath,
        isOnline: true,
        serviceType: ServiceType.github,
      });
    });

    it('offline local path with remote public GitHub and no auth', async () => {
      const repoPath = 'git@github.com:DXHeroes/dx-scanner.git';
      nock.disableNetConnect();
      new GitHubNock('1', 'DXHeroes', 1, 'dx-scanner').getRepo('').reply(500);

      mockedGit.mockImplementation(() => {
        return {
          checkIsRepo: () => true,
          revparse: () => '/local/path',
          getRemotes: () => [{ name: 'origin', refs: { fetch: repoPath, push: repoPath } }],
        };
      });

      const scanningStrategyDetector = await createScanningStrategyDetector({ uri: '/local/path' });
      const result = await scanningStrategyDetector.detect();
      expect(result).toEqual(<ScanningStrategy>{
        accessType: AccessType.unknown,
        localPath: '/local/path',
        rootPath: '/local/path',
        remoteUrl: repoPath,
        isOnline: false,
        serviceType: ServiceType.github,
      });
    });

    it('local path with remote private GitHub', async () => {
      const repoPath = 'git@github.com:DXHeroes/dx-scanner-private.git';
      new GitHubNock('1', 'DXHeroes', 1, 'dx-scanner-private').getRepo('').reply(404);

      mockedGit.mockImplementation(() => {
        return {
          checkIsRepo: () => true,
          revparse: () => '/local/path',
          getRemotes: () => [{ name: 'origin', refs: { fetch: repoPath, push: repoPath } }],
        };
      });

      const scanningStrategyDetector = await createScanningStrategyDetector({ uri: '/local/path', auth: 'fake_token' });
      const result = await scanningStrategyDetector.detect();

      expect(result).toEqual(<ScanningStrategy>{
        accessType: AccessType.unknown,
        localPath: '/local/path',
        rootPath: '/local/path',
        remoteUrl: repoPath,
        isOnline: true,
        serviceType: ServiceType.github,
      });
    });

    it('local path with remote unsupported VCS', async () => {
      const repoPath = 'http://www.example.com/my/own/project.git';
      nock.disableNetConnect();

      mockedGit.mockImplementation(() => {
        return {
          checkIsRepo: () => true,
          revparse: () => '/local/path',
          getRemotes: () => [{ name: 'origin', refs: { fetch: repoPath, push: repoPath } }],
        };
      });

      const scanningStrategyDetector = await createScanningStrategyDetector({ uri: '/local/path', auth: 'fake_token' });
      const result = await scanningStrategyDetector.detect();

      expect(result).toEqual(<ScanningStrategy>{
        accessType: undefined,
        localPath: '/local/path',
        rootPath: '/local/path',
        remoteUrl: undefined,
        isOnline: false,
        serviceType: ServiceType.local,
      });
    });

    it('local path with remote private GitHub, error 402', async () => {
      const repoPath = 'git@github.com:DXHeroes/dx-scanner-private.git';
      new GitHubNock('1', 'DXHeroes', 1, 'dx-scanner-private').getRepo('').reply(402);

      mockedGit.mockImplementation(() => {
        return {
          checkIsRepo: () => true,
          getRemotes: () => [{ name: 'origin', refs: { fetch: repoPath, push: repoPath } }],
        };
      });

      const scanningStrategyDetector = await createScanningStrategyDetector({ uri: '/local/path', auth: 'fake_token' });

      try {
        await scanningStrategyDetector.detect();
        fail();
      } catch (error) {
        expect(error.name).toMatch('HttpError');
      }
    });

    it('offline local path with remote private GitHub', async () => {
      const repoPath = 'git@github.com:DXHeroes/dx-scanner-private.git';

      nock.disableNetConnect();

      new GitHubNock('1', 'DXHeroes', 1, 'dx-scanner-private').getRepo('').reply(500);

      mockedGit.mockImplementation(() => {
        return {
          checkIsRepo: () => true,
          revparse: () => '/local/path',
          getRemotes: () => [{ name: 'origin', refs: { fetch: repoPath, push: repoPath } }],
        };
      });

      const scanningStrategyDetector = await createScanningStrategyDetector({ uri: '/local/path', auth: 'fake_token' });
      const result = await scanningStrategyDetector.detect();

      expect(result).toEqual(<ScanningStrategy>{
        accessType: AccessType.unknown,
        localPath: '/local/path',
        rootPath: '/local/path',
        remoteUrl: repoPath,
        isOnline: false,
        serviceType: ServiceType.github,
      });
    });

    it('remote public GitHub', async () => {
      const repoPath = 'https://github.com/DXHeroes/dx-scanner.git';
      new GitHubNock('1', 'DXHeroes', 1, 'dx-scanner').getRepo('').reply(200);

      const scanningStrategyDetector = await createScanningStrategyDetector({ uri: repoPath });
      const result = await scanningStrategyDetector.detect();

      expect(result).toEqual(<ScanningStrategy>{
        accessType: AccessType.public,
        localPath: undefined,
        remoteUrl: repoPath,
        isOnline: true,
        serviceType: ServiceType.github,
      });
    });

    it('remote private GitHub', async () => {
      const repoPath = 'https://github.com/DXHeroes/dx-scanner-private.git';
      new GitHubNock('1', 'DXHeroes', 1, 'dx-scanner-private').getRepo('').reply(404);

      const scanningStrategyDetector = await createScanningStrategyDetector({ uri: repoPath, auth: 'fake_token' });
      const result = await scanningStrategyDetector.detect();

      expect(result).toEqual(<ScanningStrategy>{
        accessType: AccessType.unknown,
        localPath: undefined,
        remoteUrl: repoPath,
        isOnline: true,
        serviceType: ServiceType.github,
      });
    });

    it('remote public GitHub without protocol in the URL', async () => {
      const repoPath = 'github.com/DXHeroes/dx-scanner.git';
      new GitHubNock('1', 'DXHeroes', 1, 'dx-scanner').getRepo('').reply(200);

      const scanningStrategyDetector = await createScanningStrategyDetector({ uri: repoPath, auth: 'fake_token' });
      const result = await scanningStrategyDetector.detect();

      expect(result).toEqual(<ScanningStrategy>{
        accessType: AccessType.public,
        localPath: undefined,
        remoteUrl: `https://${repoPath}`,
        isOnline: true,
        serviceType: ServiceType.github,
      });
    });

    it('remote private GitLab without protocol in the URL with valid credentials', async () => {
      const repoPath = 'gitlab.com/DXHeroes/dx-scanner.git';
      const nock = new GitLabNock('DXHeroes', 'dx-scanner', 'gitlab.com');
      nock.listProjects();
      nock.listGroups();
      nock.checkVersion();
      nock.getRepoResponse(200, { visibility: 'private' });

      const scanningStrategyDetector = await createScanningStrategyDetector({ uri: repoPath, auth: 'valid_token' });
      const result = await scanningStrategyDetector.detect();

      expect(result).toEqual(<ScanningStrategy>{
        accessType: AccessType.private,
        localPath: undefined,
        remoteUrl: `https://${repoPath}`,
        isOnline: true,
        serviceType: ServiceType.gitlab,
      });
    });

    it('remote private GitLab without protocol in the URL with invalid credentials', async () => {
      const repoPath = 'gitlab.com/DXHeroes/dx-scanner.git';
      const nock = new GitLabNock('DXHeroes', 'dx-scanner', 'gitlab.com');
      nock.listProjects();
      nock.listGroups();
      nock.checkVersion().reply(403);
      nock.getRepoResponse(403);

      const scanningStrategyDetector = await createScanningStrategyDetector({ uri: repoPath, auth: 'invalid_token' });
      const result = await scanningStrategyDetector.detect();

      expect(result).toEqual(<ScanningStrategy>{
        accessType: AccessType.unknown,
        localPath: undefined,
        remoteUrl: `https://${repoPath}`,
        isOnline: true,
        serviceType: ServiceType.gitlab,
      });
    });

    const createScanningStrategyDetector = async (args: Partial<ArgumentsProvider>) => {
      const container = createTestContainer(args);
      const argumentsProvider = argumentsProviderFactory(args);
      const repositoryConfig = await container.scanningStrategyExplorer.explore();
      return new ScanningStrategyDetector(
        new GitHubService(argumentsProvider, repositoryConfig),
        new BitbucketService(argumentsProvider, repositoryConfig),
        new GitLabService(argumentsProvider, repositoryConfig),
        argumentsProvider,
        repositoryConfig,
      );
    };
  });
});
