import nock from 'nock';
import git from 'simple-git/promise';
import { createTestContainer } from '../inversify.config';
import { GitHubNock } from '../test/helpers/gitHubNock';
import { AccessType, ServiceType, ScanningStrategyDetector } from './ScanningStrategyDetector';
import { GitHubService, BitbucketService } from '../services';
import { GitLabService } from '../services/gitlab/GitLabService';
import { argumentsProviderFactory } from '../test/factories/ArgumentsProviderFactory';
import { ArgumentsProvider } from '../scanner';
jest.mock('simple-git/promise');

describe('ScanningStrategyDetector', () => {
  const mockedGit = <jest.Mock>git;

  beforeEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  describe('#detect', () => {
    it('local path without remote', async () => {
      mockedGit.mockImplementation(() => {
        return {
          checkIsRepo: () => true,
          getRemotes: () => [],
        };
      });

      const scanningStrategyDetector = await createScanningStrategyDetector({ uri: '/local/path' });
      const result = await scanningStrategyDetector.detect();

      expect(result).toEqual({
        accessType: undefined,
        localPath: '/local/path',
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
          getRemotes: () => [{ name: 'origin', refs: { fetch: repoPath, push: repoPath } }],
        };
      });

      const scanningStrategyDetector = await createScanningStrategyDetector({ uri: '/local/path', auth: 'fake_token' });
      const result = await scanningStrategyDetector.detect();

      expect(result).toEqual({
        accessType: AccessType.public,
        localPath: '/local/path',
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
          getRemotes: () => [{ name: 'origin', refs: { fetch: repoPath, push: repoPath } }],
        };
      });

      const scanningStrategyDetector = await createScanningStrategyDetector({ uri: '/local/path', auth: 'fake_token' });
      const result = await scanningStrategyDetector.detect();

      expect(result).toEqual({
        accessType: AccessType.unknown,
        localPath: '/local/path',
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
          getRemotes: () => [{ name: 'origin', refs: { fetch: repoPath, push: repoPath } }],
        };
      });

      const scanningStrategyDetector = await createScanningStrategyDetector({ uri: '/local/path' });
      const result = await scanningStrategyDetector.detect();

      expect(result).toEqual({
        accessType: 'public',
        localPath: '/local/path',
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
          getRemotes: () => [{ name: 'origin', refs: { fetch: repoPath, push: repoPath } }],
        };
      });

      const scanningStrategyDetector = await createScanningStrategyDetector({ uri: '/local/path' });
      const result = await scanningStrategyDetector.detect();
      expect(result).toEqual({
        accessType: AccessType.unknown,
        localPath: '/local/path',
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
          getRemotes: () => [{ name: 'origin', refs: { fetch: repoPath, push: repoPath } }],
        };
      });

      const scanningStrategyDetector = await createScanningStrategyDetector({ uri: '/local/path', auth: 'fake_token' });
      const result = await scanningStrategyDetector.detect();

      expect(result).toEqual({
        accessType: AccessType.unknown,
        localPath: '/local/path',
        remoteUrl: repoPath,
        isOnline: true,
        serviceType: ServiceType.github,
      });
    });

    it('offline local path with remote private GitHub', async () => {
      const repoPath = 'git@github.com:DXHeroes/dx-scanner-private.git';

      nock.disableNetConnect();

      new GitHubNock('1', 'DXHeroes', 1, 'dx-scanner-private').getRepo('').reply(500);

      mockedGit.mockImplementation(() => {
        return {
          checkIsRepo: () => true,
          getRemotes: () => [{ name: 'origin', refs: { fetch: repoPath, push: repoPath } }],
        };
      });

      const scanningStrategyDetector = await createScanningStrategyDetector({ uri: '/local/path', auth: 'fake_token' });
      const result = await scanningStrategyDetector.detect();

      expect(result).toEqual({
        accessType: AccessType.unknown,
        localPath: '/local/path',
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

      expect(result).toEqual({
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

      expect(result).toEqual({
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

      expect(result).toEqual({
        accessType: AccessType.public,
        localPath: undefined,
        remoteUrl: `https://${repoPath}`,
        isOnline: true,
        serviceType: ServiceType.github,
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
