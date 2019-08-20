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

  describe('#listDirectory', () => {
    it('returns array of files after calling listDirectory()', async () => {
      const expected = gitHubNock.getDirectory(
        'mockFolder',
        ['mockFile.ts', 'mockFileSLbroken.ln', 'mockFileToRewrite.ts'],
        ['mockSubFolder'],
      );

      const result = await git.listDirectory('mockFolder');
      expect(result).toEqual(expected);
    });

    it("throws an error if the target doesn't exist", async () => {
      gitHubNock.getNonexistentContents('notExistingMockFolder');

      await expect(git.listDirectory('notExistingMockFolder')).rejects.toThrow('notExistingMockFolder is not a directory');
    });

    it('throws an error if the target is a file', async () => {
      gitHubNock.getFile('mockFolder/mockFile.ts');

      await expect(git.listDirectory('mockFolder/mockFile.ts')).rejects.toThrow('mockFolder/mockFile.ts is not a directory');
    });

    it('caches the results', async () => {
      // bacause of persist == false, the second call to git.listDirectory() would cause Nock to throw an error if the cache wasn't used
      const expected = gitHubNock.getDirectory('mockFolder', ['mockFile.ts'], [], false);
      await git.listDirectory('mockFolder');

      const result = await git.listDirectory('mockFolder');
      expect(result).toEqual(expected);
    });
  });

  describe('#getFile', () => {
    it('returns the file', async () => {
      const expected = gitHubNock.getFile('mockFolder/mockFile.ts');

      const result = await git.getFile('mockFolder/mockFile.ts');
      expect(result).toEqual(expected);
    });

    it("throws an error if the target doesn't exist", async () => {
      gitHubNock.getNonexistentContents('notExistingMockFolder');

      await expect(git.getFile('notExistingMockFolder')).rejects.toThrow('notExistingMockFolder is not a file');
    });

    it("throws an error if the target isn't a file", async () => {
      gitHubNock.getDirectory('mockFolder', ['mockFile.ts'], []);

      await expect(git.getFile('mockFolder')).rejects.toThrow('mockFolder is not a file');
    });

    it('caches the results', async () => {
      // bacause of persist == false, the second call to git.getFile() would cause Nock to throw an error if the cache wasn't used
      const expected = gitHubNock.getFile('mockFolder/mockFile.ts', undefined, undefined, false);
      await git.getFile('mockFolder/mockFile.ts');

      const result = await git.getFile('mockFolder/mockFile.ts');
      expect(result).toEqual(expected);
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
          {
            number: 1,
            state: 'open',
            title: '1',
            body: '1',
            head: { ref: 'head', repo: { id: 1, name: 'Hello-World', owner: { id: 1, login: 'octocat' } } },
            base: { ref: 'base', repo: { id: 1, name: 'Hello-World', owner: { id: 1, login: 'octocat' } } },
          },
          {
            number: 2,
            state: 'closed',
            title: '2',
            body: '2',
            head: { ref: 'head', repo: { id: 1, name: 'Hello-World', owner: { id: 1, login: 'octocat' } } },
            base: { ref: 'base', repo: { id: 1, name: 'Hello-World', owner: { id: 1, login: 'octocat' } } },
          },
        ],
        'all',
      );

      const result = await git.getPullRequestCount();
      expect(result).toEqual(2);
    });
  });

  describe('#getTextFileContent', () => {
    it('returns the content', async () => {
      gitHubNock.getFile('mockFolder/mockFile.ts', '...');

      const result = await git.getTextFileContent('mockFolder/mockFile.ts');
      expect(result).toEqual('...');
    });

    it("throws an error if the target doesn't exist", async () => {
      gitHubNock.getNonexistentContents('notExistingMockFolder');

      await expect(git.getTextFileContent('notExistingMockFolder')).rejects.toThrow('notExistingMockFolder is not a file');
    });

    it("throws an error if the target isn't a file", async () => {
      gitHubNock.getDirectory('mockFolder', ['mockFile.ts'], []);

      await expect(git.getTextFileContent('mockFolder')).rejects.toThrow('mockFolder is not a file');
    });

    it('caches the results', async () => {
      // bacause of persist == false, the second call to git.getTextFileContent() would cause Nock to throw an error if the cache wasn't used
      gitHubNock.getFile('mockFolder/mockFile.ts', '...', undefined, false);
      await git.getTextFileContent('mockFolder/mockFile.ts');

      const result = await git.getTextFileContent('mockFolder/mockFile.ts');
      expect(result).toEqual('...');
    });
  });
});
