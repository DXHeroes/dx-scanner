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
    gitHubNock = new GitHubNock('DXHeroes', 'dx-scanner');
  });

  beforeEach(() => {
    cache.purge();
    nock.cleanAll();
  });

  describe('#exists', () => {
    it('returns true if the file exists', async () => {
      gitHubNock.getDirectory('src', [], []);

      const result = await git.exists('src');

      expect(result).toBe(true);
    });

    it('returns true if the directory is a root directory', async () => {
      gitHubNock.getDirectory('/', [], []);

      const result = await git.exists('/');

      expect(result).toBe(true);
    });

    it('returns true if the directory exists on absolute path', async () => {
      gitHubNock.getDirectory('/', ['src'], []);
      gitHubNock.getDirectory('/src', [], []);

      const result = await git.exists('/src');

      expect(result).toBe(true);
    });

    it('returns true if the directory exists on relative path', async () => {
      gitHubNock.getDirectory('src', [], []);

      const result = await git.exists('src');

      expect(result).toBe(true);
    });

    it('returns true if the symbolic link exists', async () => {
      gitHubNock.getFile('indexSL.ts');

      const result = await git.exists('indexSL.ts');

      expect(result).toBe(true);
    });

    it('returns false if the broken symbolic link exists', async () => {
      gitHubNock.getSymlink('indexSLbroken.ts', 'non-existing-file.ts');
      gitHubNock.getNonexistentContents('non-existing-file.ts');

      const result = await git.exists('indexSLbroken.ts');

      expect(result).toBe(false);
    });

    it("returns false if the file doesn't exists", async () => {
      gitHubNock.getNonexistentContents('non-existing-file.ts');

      const result = await git.exists('non-existing-file.ts');

      expect(result).toBe(false);
    });

    it('follows symlinks', async () => {
      gitHubNock.getSymlink('srcSL', 'src');
      gitHubNock.getDirectory('src', [], ['index.ts']);
      gitHubNock.getFile('src/index.ts');

      const result = await git.exists('srcSL/index.ts');
      expect(result).toBe(true);
    });

    it('caches the results', async () => {
      // bacause of persist == false, the second call to git.exists() would cause Nock to throw an error if the cache wasn't used
      gitHubNock.getDirectory('src', [], [], false);
      await git.exists('src');

      const result = await git.exists('src');
      expect(result).toBe(true);
    });
  });

  describe('#listDirectory', () => {
    it('returns array of files after calling readDirectory()', async () => {
      const expected = gitHubNock.getDirectory('src', ['index.ts'], []);

      const result = await git.listDirectory('src');
      expect(result).toEqual(expected);
    });

    it("throws an error if the target doesn't exist", async () => {
      gitHubNock.getNonexistentContents('non/existing/dir');

      await expect(git.listDirectory('non/existing/dir')).rejects.toThrow('non/existing/dir is not a directory');
    });

    it('throws an error if the target is a file', async () => {
      gitHubNock.getFile('src/index.ts');

      await expect(git.listDirectory('src/index.ts')).rejects.toThrow('src/index.ts is not a directory');
    });

    it('throws an error if the target is a broken symbolic link', async () => {
      gitHubNock.getSymlink('indexSLbroken.ts', 'non-existing-file.ts');
      gitHubNock.getNonexistentContents('non-existing-file.ts');

      await expect(git.listDirectory('indexSLbroken.ts')).rejects.toThrow('indexSLbroken.ts is not a directory');
    });

    it('caches the results', async () => {
      // bacause of persist == false, the second call to git.listDirectory() would cause Nock to throw an error if the cache wasn't used
      const expected = gitHubNock.getDirectory('src', ['index.ts'], [], false);
      await git.listDirectory('src');

      const result = await git.listDirectory('src');
      expect(result).toEqual(expected);
    });
  });

  describe('#getFile', () => {
    it('returns the file', async () => {
      const expected = gitHubNock.getFile('src/index.ts');

      const result = await git.getFile('src/index.ts');
      expect(result).toEqual(expected);
    });

    it("throws an error if the target doesn't exist", async () => {
      gitHubNock.getNonexistentContents('non/existing/file.ts');

      await expect(git.getFile('non/existing/file.ts')).rejects.toThrow('non/existing/file.ts is not a file');
    });

    it("throws an error if the target isn't a file", async () => {
      gitHubNock.getDirectory('src', ['index.ts'], []);

      await expect(git.getFile('src')).rejects.toThrow('src is not a file');
    });

    it('caches the results', async () => {
      // bacause of persist == false, the second call to git.getFile() would cause Nock to throw an error if the cache wasn't used
      const expected = gitHubNock.getFile('src/index.ts', undefined, undefined, false);
      await git.getFile('src/index.ts');

      const result = await git.getFile('src/index.ts');
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

  describe('#getTextFileContent', () => {
    it('returns the content', async () => {
      gitHubNock.getFile('src/index.ts', '...');

      const result = await git.getTextFileContent('src/index.ts');
      expect(result).toEqual('...');
    });

    it("throws an error if the target doesn't exist", async () => {
      gitHubNock.getNonexistentContents('non/existing/file.ts');

      await expect(git.getTextFileContent('non/existing/file.ts')).rejects.toThrow('non/existing/file.ts is not a file');
    });

    it("throws an error if the target isn't a file", async () => {
      gitHubNock.getDirectory('src', ['index.ts'], []);

      await expect(git.getTextFileContent('src')).rejects.toThrow('src is not a file');
    });

    it('caches the results', async () => {
      // bacause of persist == false, the second call to git.getTextFileContent() would cause Nock to throw an error if the cache wasn't used
      gitHubNock.getFile('src/index.ts', '...', undefined, false);
      await git.getTextFileContent('src/index.ts');

      const result = await git.getTextFileContent('src/index.ts');
      expect(result).toEqual('...');
    });
  });
});
