import nock from 'nock';
import git from 'simple-git/promise';
import { createTestContainer } from '../inversify.config';
import { GitHubNock } from '../test/helpers/gitHubNock';
import { AccessType, ServiceType } from './ScanningStrategyDetector';
jest.mock('simple-git/promise');

describe('ScanningStrategyDetector', () => {
  const mockedGit = <jest.Mock>git;

  beforeEach(() => {
    nock.cleanAll();
  });

  describe('#detect', () => {
    it('local path without remote', async () => {
      mockedGit.mockImplementation(() => {
        return {
          checkIsRepo: () => true,
          getRemotes: () => [],
        };
      });
      const container = createTestContainer({ uri: '/local/path' });

      const result = await container.scanningStrategyDetector.detect();

      expect(result).toEqual({
        accessType: undefined,
        localPath: '/local/path',
        remoteUrl: undefined,
        isOnline: false,
        serviceType: ServiceType.git,
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
      const container = createTestContainer({ uri: '/local/path', auth: 'fake_token' });

      const result = await container.scanningStrategyDetector.detect();

      expect(result).toEqual({
        accessType: AccessType.public,
        localPath: '/local/path',
        remoteUrl: repoPath,
        isOnline: true,
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
      const container = createTestContainer({ uri: '/local/path' });

      const result = await container.scanningStrategyDetector.detect();

      expect(result).toEqual({
        accessType: 'public',
        localPath: '/local/path',
        remoteUrl: repoPath,
        isOnline: true,
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

      const container = createTestContainer({ uri: '/local/path', auth: 'bad AT' });
      const result = await container.scanningStrategyDetector.detect();

      expect(result).toEqual({
        accessType: AccessType.unknown,
        localPath: '/local/path',
        remoteUrl: repoPath,
        isOnline: true,
        serviceType: ServiceType.github,
      });
    });

    it('remote public GitHub', async () => {
      const repoPath = 'https://github.com/DXHeroes/dx-scanner.git';
      new GitHubNock('1', 'DXHeroes', 1, 'dx-scanner').getRepo('').reply(200);
      const container = createTestContainer({ uri: repoPath });

      const result = await container.scanningStrategyDetector.detect();

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
      const container = createTestContainer({ uri: repoPath, auth: 'bad AT' });
      const result = await container.scanningStrategyDetector.detect();

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
      const container = createTestContainer({ uri: repoPath });

      const result = await container.scanningStrategyDetector.detect();

      expect(result).toEqual({
        accessType: AccessType.public,
        localPath: undefined,
        remoteUrl: `https://${repoPath}`,
        isOnline: true,
        serviceType: ServiceType.github,
      });
    });
  });
});
