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
});
