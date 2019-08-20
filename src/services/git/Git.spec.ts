import { Git } from './Git';
import { GitHubClient } from './GitHubClient';
import { InMemoryCache } from '../../scanner/cache/InMemoryCahce';
import { GitHubNock } from '../../../test/helpers/gitHubNock';
import nock from 'nock';

describe('Git', () => {
  let cache: InMemoryCache, git: Git, gitHubNock: GitHubNock;

  beforeAll(() => {
    cache = new InMemoryCache();
    git = new Git({ url: 'https://github.com/DXHeroes/dx-scanner.git' }, new GitHubClient({ uri: '.' }), cache);
    gitHubNock = new GitHubNock(1, 'DXHeroes', 1, 'dx-scanner');
  });

  beforeEach(() => {
    cache.purge();
    nock.cleanAll();
  });

  describe('#exists', () => {
    it('returns true if the file exists', async () => {
      gitHubNock.getFile('mockFile.ts');

      const result = await git.exists('mockFile.ts');

      expect(result).toBe(true);
    });

    it('returns true if the directory exists', async () => {
      gitHubNock.getDirectory('mockFolder', [], []);

      const result = await git.exists('mockFolder');

      expect(result).toBe(true);
    });

    it("returns false if the file doesn't exists", async () => {
      gitHubNock.getNonexistentContents('notExistingMockFolder');

      const result = await git.exists('notExistingMockFolder');

      expect(result).toBe(false);
    });

    it('caches the results', async () => {
      // bacause of persist == false, the second call to git.exists() would cause Nock to throw an error if the cache wasn't used
      gitHubNock.getDirectory('mockFolder', [], [], false);
      await git.exists('mockFolder');

      const result = await git.exists('mockFolder');
      expect(result).toBe(true);
    });
  });

  describe('#readDirectory', () => {
    it('returns array of files after calling listDirectory()', async () => {
      gitHubNock.getDirectory('mockFolder', ['mockFile.ts', 'mockFileSLbroken.ln', 'mockFileToRewrite.ts'], ['mockSubFolder']);

      const result = await git.readDirectory('mockFolder');
      expect(result.length).toEqual(4);
      expect(result).toContain('mockFile.ts');
      expect(result).toContain('mockFileSLbroken.ln');
      expect(result).toContain('mockFileToRewrite.ts');
      expect(result).toContain('mockSubFolder');
    });

    it("throws an error if the target doesn't exist", async () => {
      gitHubNock.getNonexistentContents('notExistingMockFolder');

      await expect(git.readDirectory('notExistingMockFolder')).rejects.toThrow('notExistingMockFolder is not a directory');
    });

    it('throws an error if the target is a file', async () => {
      gitHubNock.getFile('mockFile.ts');

      await expect(git.readDirectory('mockFile.ts')).rejects.toThrow('mockFile.ts is not a directory');
    });

    it('caches the results', async () => {
      // bacause of persist == false, the second call to git.readDirectory() would cause Nock to throw an error if the cache wasn't used
      gitHubNock.getDirectory('mockFolder', ['mockFile.ts'], [], false);
      await git.readDirectory('mockFolder');

      await git.readDirectory('mockFolder');
    });
  });

  describe('#readFile', () => {
    it('returns the content', async () => {
      gitHubNock.getFile('mockFile.ts', '...');

      const result = await git.readFile('mockFile.ts');
      expect(result).toEqual('...');
    });

    it("throws an error if the target doesn't exist", async () => {
      gitHubNock.getNonexistentContents('notExistingMockFolder');

      await expect(git.readFile('notExistingMockFolder')).rejects.toThrow('notExistingMockFolder is not a file');
    });

    it("throws an error if the target isn't a file", async () => {
      gitHubNock.getDirectory('mockFolder', ['mockFile.ts'], []);

      await expect(git.readFile('mockFolder')).rejects.toThrow('mockFolder is not a file');
    });

    it('caches the results', async () => {
      // bacause of persist == false, the second call to git.readFile() would cause Nock to throw an error if the cache wasn't used
      gitHubNock.getFile('mockFile.ts', undefined, undefined, false);
      await git.readFile('mockFile.ts');

      await git.readFile('mockFile.ts');
    });
  });

  describe('#getMetadata', () => {
    it('it returns metadata for Folder', async () => {
      gitHubNock.getDirectory('mockFolder', ['mockFile.ts'], []);

      const result = await git.getMetadata('mockFolder');

      expect(result.baseName).toEqual('mockFolder');
      expect(result.extension).toEqual(undefined);
      expect(result.name).toMatch('mockFolder');
      expect(result.path).toMatch('mockFolder');
      expect(typeof result.size).toBe('number');
      expect(result.type).toEqual('dir');
    });

    it('it returns metadata for File', async () => {
      gitHubNock.getFile('mockFile.ts');

      const result = await git.getMetadata('mockFile.ts');

      expect(result.baseName).toEqual('mockFile');
      expect(result.extension).toEqual('.ts');
      expect(result.name).toEqual('mockFile.ts');
      expect(result.path).toMatch('mockFile.ts');
      expect(typeof result.size).toBe('number');
      expect(result.type).toEqual('file');
    });

    it('it returns metadata for dotfile', async () => {
      gitHubNock.getFile('.keep');

      const result = await git.getMetadata('.keep');

      expect(result.baseName).toEqual('.keep');
      expect(result.name).toEqual('.keep');
      expect(result.extension).toEqual(undefined);
      expect(result.path).toMatch('.keep');
      expect(typeof result.size).toBe('number');
      expect(result.type).toEqual('file');
    });

    it("throws an error if the target doesn't exist", async () => {
      gitHubNock.getNonexistentContents('notExistingMockFolder');

      await expect(git.getMetadata('notExistingMockFolder')).rejects.toThrow('Could not get content of notExistingMockFolder');
    });

    it('caches the results', async () => {
      // bacause of persist == false, the second call to git.getMetadata() would cause Nock to throw an error if the cache wasn't used
      gitHubNock.getDirectory('mockFolder', ['mockFile.ts'], [], false);
      await git.getMetadata('mockFolder');

      await git.getMetadata('mockFolder');
    });
  });

  describe('#getContributorCount', () => {
    it('returns the number of contributors', async () => {
      gitHubNock.getContributors([{ id: 251370, login: 'Spaceghost' }, { id: 583231, login: 'octocat' }]);

      const result = await git.getContributorCount();
      expect(result).toEqual(2);
    });
  });

  describe('#getPullRequestCount', () => {
    it('returns the number of both open and closed pull requests', async () => {
      gitHubNock.getPulls(
        [
          { number: 1, state: 'open', title: '1', body: '1', head: 'head', base: 'base' },
          { number: 2, state: 'closed', title: '2', body: '2', head: 'head', base: 'base' },
        ],
        'all',
      );

      const result = await git.getPullRequestCount();
      expect(result).toEqual(2);
    });
  });
});
