import { GitInspector } from './GitInspector';
import { Types } from '../types';
import fs from 'fs';
import git from 'simple-git/promise';
import os from 'os';
import path from 'path';
import rimraf from 'rimraf';
import util from 'util';
import { Container } from 'inversify';

describe('GitInspector', () => {
  let testDir: TestDir;

  beforeEach(async () => {
    testDir = new TestDir();
  });

  afterEach(async () => {
    await util.promisify(rimraf)(testDir.path);
  });

  it('is injectable', () => {
    const container = new Container();
    container.bind(Types.RepositoryPath).toConstantValue(testDir.path);
    container.bind(GitInspector).toSelf();

    expect(() => container.get(GitInspector)).not.toThrow();
  });

  describe('#getCommits', () => {
    it('returns the page number', async () => {
      await testDir.gitInit();
      await testDir.gitCommit();
      const gitInspector = new GitInspector(testDir.path);

      const { page } = await gitInspector.getCommits({});

      expect(page).toStrictEqual(0);
    });

    it('returns the per page number', async () => {
      await testDir.gitInit();
      await testDir.gitCommit();
      const gitInspector = new GitInspector(testDir.path);

      const { perPage } = await gitInspector.getCommits({});

      expect(perPage).toStrictEqual(1);
    });

    it('returns all repository commits', async () => {
      await testDir.gitInit({ name: 'test', email: 'test@example.com' });
      await testDir.gitCommit('msg');
      const gitInspector = new GitInspector(testDir.path);

      const { items } = await gitInspector.getCommits({});

      const expected = (await testDir.gitLog()).latest;
      expect(items).toStrictEqual([
        {
          sha: expected.hash,
          date: new Date(expected.date),
          message: 'msg\n',
          author: { name: 'test', email: 'test@example.com' },
          commiter: undefined,
        },
      ]);
    });

    it('returns repository commits containing an author', async () => {
      await testDir.gitInit();
      await testDir.gitCommit('msg1', 'test1 <test1@example.com>');
      await testDir.gitCommit('msg2', 'test2 <test2@example.com>');
      const expected = (await testDir.gitLog()).latest;
      const gitInspector = new GitInspector(testDir.path);

      const { items } = await gitInspector.getCommits({ filter: { author: 'test2@example.com' } });

      expect(items).toStrictEqual([
        {
          sha: expected.hash,
          date: new Date(expected.date),
          message: 'msg2\n',
          author: { name: 'test2', email: 'test2@example.com' },
          commiter: undefined,
        },
      ]);
    });

    it('returns repository commits between sha and HEAD', async () => {
      await testDir.gitInit({ name: 'test', email: 'test@example.com' });
      await testDir.gitCommit('msg1');
      const commit1 = (await testDir.gitLog()).latest;
      await testDir.gitCommit('msg2');
      const commit2 = (await testDir.gitLog()).latest;
      const gitInspector = new GitInspector(testDir.path);

      const { items } = await gitInspector.getCommits({ filter: { sha: commit1.hash } });

      expect(items).toStrictEqual([
        {
          sha: commit2.hash,
          date: new Date(commit2.date),
          message: 'msg2\n',
          author: { name: 'test', email: 'test@example.com' },
          commiter: undefined,
        },
      ]);
    });

    it('returns repository commits containing a path', async () => {
      await testDir.gitInit({ name: 'test', email: 'test@example.com' });
      await testDir.gitCommit('msg1');
      await testDir.gitAddFile('file.txt');
      await testDir.gitCommit('msg2');
      const expected = (await testDir.gitLog()).latest;
      const gitInspector = new GitInspector(testDir.path);

      const { items } = await gitInspector.getCommits({ filter: { path: 'file.txt' } });

      expect(items).toStrictEqual([
        {
          sha: expected.hash,
          date: new Date(expected.date),
          message: 'msg2\n',
          author: { name: 'test', email: 'test@example.com' },
          commiter: undefined,
        },
      ]);
    });

    it('returns repository commits since a date', async () => {
      await testDir.gitInit({ name: 'test', email: 'test@example.com' });
      await testDir.gitCommit('msg1');
      await new Promise((resolve) => setTimeout(resolve, 1000)); // sleep 1 s
      await testDir.gitCommit('msg2');
      const expected = (await testDir.gitLog()).latest;
      const gitInspector = new GitInspector(testDir.path);

      const { items } = await gitInspector.getCommits({ filter: { since: new Date(expected.date) } });

      expect(items).toStrictEqual([
        {
          sha: expected.hash,
          date: new Date(expected.date),
          message: 'msg2\n',
          author: { name: 'test', email: 'test@example.com' },
          commiter: undefined,
        },
      ]);
    });

    it('returns repository commits until a date', async () => {
      await testDir.gitInit({ name: 'test', email: 'test@example.com' });
      await testDir.gitCommit('msg1');
      const expected = (await testDir.gitLog()).latest;
      await new Promise((resolve) => setTimeout(resolve, 1000)); // sleep 1 s
      await testDir.gitCommit('msg2');
      const gitInspector = new GitInspector(testDir.path);

      const { items } = await gitInspector.getCommits({ filter: { until: new Date(expected.date) } });

      expect(items).toStrictEqual([
        {
          sha: expected.hash,
          date: new Date(expected.date),
          message: 'msg1\n',
          author: { name: 'test', email: 'test@example.com' },
          commiter: undefined,
        },
      ]);
    });

    it('returns selected repository commits', async () => {
      await testDir.gitInit({ name: 'test', email: 'test@example.com' });
      await testDir.gitCommit('msg1');
      await testDir.gitCommit('msg2');
      await testDir.gitCommit('msg3');
      const expected1 = (await testDir.gitLog()).latest;
      await testDir.gitCommit('msg4');
      const expected2 = (await testDir.gitLog()).latest;
      await testDir.gitCommit('msg5');
      await testDir.gitCommit('msg6');
      const gitInspector = new GitInspector(testDir.path);

      const { items } = await gitInspector.getCommits({ pagination: { page: 1, perPage: 2 } });

      expect(items).toStrictEqual([
        {
          sha: expected2.hash,
          date: new Date(expected2.date),
          message: 'msg4\n',
          author: { name: 'test', email: 'test@example.com' },
          commiter: undefined,
        },
        {
          sha: expected1.hash,
          date: new Date(expected1.date),
          message: 'msg3\n',
          author: { name: 'test', email: 'test@example.com' },
          commiter: undefined,
        },
      ]);
    });

    it('returns remaining repository commits if pagination specifies a greater subset', async () => {
      await testDir.gitInit({ name: 'test', email: 'test@example.com' });
      await testDir.gitCommit('msg');
      const gitInspector = new GitInspector(testDir.path);

      const { items } = await gitInspector.getCommits({ pagination: { page: 0, perPage: 2 } });

      const expected = (await testDir.gitLog()).latest;
      expect(items).toStrictEqual([
        {
          sha: expected.hash,
          date: new Date(expected.date),
          message: 'msg\n',
          author: { name: 'test', email: 'test@example.com' },
          commiter: undefined,
        },
      ]);
    });

    it('returns multiline commit messages', async () => {
      await testDir.gitInit();
      await testDir.gitCommit('multi\nline\nmessage');
      const gitInspector = new GitInspector(testDir.path);

      const message = (await gitInspector.getCommits({})).items[0].message;

      expect(message).toStrictEqual('multi\nline\nmessage\n');
    });

    it('returns the total count', async () => {
      await testDir.gitInit();
      await testDir.gitCommit();
      const gitInspector = new GitInspector(testDir.path);

      const { totalCount } = await gitInspector.getCommits({});

      expect(totalCount).toStrictEqual(1);
    });

    it('returns true if there is a next page', async () => {
      await testDir.gitInit();
      await testDir.gitCommit();
      await testDir.gitCommit();
      await testDir.gitCommit();
      await testDir.gitCommit();
      const gitInspector = new GitInspector(testDir.path);

      const { hasNextPage } = await gitInspector.getCommits({ pagination: { page: 0, perPage: 2 } });

      expect(hasNextPage).toStrictEqual(true);
    });

    it('returns false if there is no next page', async () => {
      await testDir.gitInit();
      await testDir.gitCommit();
      await testDir.gitCommit();
      const gitInspector = new GitInspector(testDir.path);

      const { hasNextPage } = await gitInspector.getCommits({ pagination: { page: 0, perPage: 2 } });

      expect(hasNextPage).toStrictEqual(false);
    });

    it('returns true if there is a previous page', async () => {
      await testDir.gitInit();
      await testDir.gitCommit();
      await testDir.gitCommit();
      await testDir.gitCommit();
      await testDir.gitCommit();
      const gitInspector = new GitInspector(testDir.path);

      const { hasPreviousPage } = await gitInspector.getCommits({ pagination: { page: 1, perPage: 2 } });

      expect(hasPreviousPage).toStrictEqual(true);
    });

    it('returns false if there is no previous page', async () => {
      await testDir.gitInit();
      await testDir.gitCommit();
      await testDir.gitCommit();
      const gitInspector = new GitInspector(testDir.path);

      const { hasPreviousPage } = await gitInspector.getCommits({ pagination: { page: 0, perPage: 2 } });

      expect(hasPreviousPage).toStrictEqual(false);
    });

    it('throws an error if the path does not exist', async () => {
      const gitInspector = new GitInspector(path.join(testDir.path, 'non-existing-dir'));

      await expect(gitInspector.getCommits({})).rejects.toThrow('Cannot use simple-git on a directory that does not exist.');
    });

    it('throws an error if the path is not a repository', async () => {
      const gitInspector = new GitInspector(testDir.path);

      await expect(gitInspector.getCommits({})).rejects.toThrow();
    });

    it('throws an error if there are no commits in the repository', async () => {
      await testDir.gitInit();
      const gitInspector = new GitInspector(testDir.path);

      await expect(gitInspector.getCommits({})).rejects.toThrow("fatal: your current branch 'master' does not have any commits yet");
    });

    it('throws an error if sorting is requested', async () => {
      await testDir.gitInit();
      await testDir.gitCommit();
      const gitInspector = new GitInspector(testDir.path);

      await expect(gitInspector.getCommits({ sort: {} })).rejects.toThrow('sorting not implemented');
    });
  });

  describe('#getAuthors', () => {
    it('returns the page number', async () => {
      await testDir.gitInit();
      await testDir.gitCommit();
      const gitInspector = new GitInspector(testDir.path);

      const { page } = await gitInspector.getAuthors({});

      expect(page).toStrictEqual(0);
    });

    it('returns the per page number', async () => {
      await testDir.gitInit();
      await testDir.gitCommit();
      const gitInspector = new GitInspector(testDir.path);

      const { perPage } = await gitInspector.getAuthors({});

      expect(perPage).toStrictEqual(1);
    });

    it('returns all repository authors', async () => {
      await testDir.gitInit({ name: 'test', email: 'test@example.com' });
      await testDir.gitCommit();
      const gitInspector = new GitInspector(testDir.path);

      const { items } = await gitInspector.getAuthors({});

      expect(items).toStrictEqual([{ name: 'test', email: 'test@example.com' }]);
    });

    it('returns selected repository authors', async () => {
      await testDir.gitInit();
      await testDir.gitCommit(undefined, 'test1 <test1@example.com>');
      await testDir.gitCommit(undefined, 'test2 <test2@example.com>');
      await testDir.gitCommit(undefined, 'test3 <test3@example.com>');
      await testDir.gitCommit(undefined, 'test4 <test4@example.com>');
      await testDir.gitCommit(undefined, 'test5 <test5@example.com>');
      await testDir.gitCommit(undefined, 'test6 <test6@example.com>');
      const gitInspector = new GitInspector(testDir.path);

      const { items } = await gitInspector.getAuthors({ pagination: { page: 1, perPage: 2 } });

      expect(items).toStrictEqual([{ name: 'test4', email: 'test4@example.com' }, { name: 'test3', email: 'test3@example.com' }]);
    });

    it('returns remaining repository authors if pagination specifies a greater subset', async () => {
      await testDir.gitInit({ name: 'test', email: 'test@example.com' });
      await testDir.gitCommit();
      const gitInspector = new GitInspector(testDir.path);

      const { items } = await gitInspector.getAuthors({ pagination: { page: 0, perPage: 2 } });

      expect(items).toStrictEqual([{ name: 'test', email: 'test@example.com' }]);
    });

    it('returns only unique authors', async () => {
      await testDir.gitInit({ name: 'test', email: 'test@example.com' });
      await testDir.gitCommit();
      await testDir.gitCommit();
      const gitInspector = new GitInspector(testDir.path);

      const { items } = await gitInspector.getAuthors({});

      expect(items).toStrictEqual([{ name: 'test', email: 'test@example.com' }]);
    });

    it('returns the total count', async () => {
      await testDir.gitInit();
      await testDir.gitCommit();
      const gitInspector = new GitInspector(testDir.path);

      const { totalCount } = await gitInspector.getAuthors({});

      expect(totalCount).toStrictEqual(1);
    });

    it('returns true if there is a next page', async () => {
      await testDir.gitInit();
      await testDir.gitCommit(undefined, 'test1 <test1@example.com>');
      await testDir.gitCommit(undefined, 'test2 <test2@example.com>');
      await testDir.gitCommit(undefined, 'test3 <test3@example.com>');
      await testDir.gitCommit(undefined, 'test4 <test4@example.com>');
      const gitInspector = new GitInspector(testDir.path);

      const { hasNextPage } = await gitInspector.getAuthors({ pagination: { page: 0, perPage: 2 } });

      expect(hasNextPage).toStrictEqual(true);
    });

    it('returns false if there is no next page', async () => {
      await testDir.gitInit();
      await testDir.gitCommit();
      const gitInspector = new GitInspector(testDir.path);

      const { hasNextPage } = await gitInspector.getAuthors({});

      expect(hasNextPage).toStrictEqual(false);
    });

    it('returns true if there is a previous page', async () => {
      await testDir.gitInit();
      await testDir.gitCommit(undefined, 'test1 <test1@example.com>');
      await testDir.gitCommit(undefined, 'test2 <test2@example.com>');
      await testDir.gitCommit(undefined, 'test3 <test3@example.com>');
      await testDir.gitCommit(undefined, 'test4 <test4@example.com>');
      const gitInspector = new GitInspector(testDir.path);

      const { hasPreviousPage } = await gitInspector.getAuthors({ pagination: { page: 1, perPage: 2 } });

      expect(hasPreviousPage).toStrictEqual(true);
    });

    it('returns false if there is a previous page', async () => {
      await testDir.gitInit();
      await testDir.gitCommit();
      const gitInspector = new GitInspector(testDir.path);

      const { hasPreviousPage } = await gitInspector.getAuthors({});

      expect(hasPreviousPage).toStrictEqual(false);
    });

    it('throws an error if the path does not exist', async () => {
      const gitInspector = new GitInspector(path.join(testDir.path, 'non-existing-dir'));

      await expect(gitInspector.getAuthors({})).rejects.toThrow('Cannot use simple-git on a directory that does not exist.');
    });

    it('throws an error if the path is not a repository', async () => {
      const gitInspector = new GitInspector(testDir.path);

      await expect(gitInspector.getAuthors({})).rejects.toThrow();
    });

    it('throws an error if there are no commits in the repository', async () => {
      await testDir.gitInit();
      const gitInspector = new GitInspector(testDir.path);

      await expect(gitInspector.getAuthors({})).rejects.toThrow("fatal: your current branch 'master' does not have any commits yet");
    });

    it('throws an error if filtering is requested', async () => {
      await testDir.gitInit();
      await testDir.gitCommit();
      const gitInspector = new GitInspector(testDir.path);

      await expect(gitInspector.getAuthors({ filter: {} })).rejects.toThrow('filtering and sorting not implemented');
    });

    it('throws an error if sorting is requested', async () => {
      await testDir.gitInit();
      await testDir.gitCommit();
      const gitInspector = new GitInspector(testDir.path);

      await expect(gitInspector.getAuthors({ sort: {} })).rejects.toThrow('filtering and sorting not implemented');
    });
  });

  describe('#getAllTags', () => {
    it('returns all repository tags', async () => {
      await testDir.gitInit();
      await testDir.gitCommit();
      await testDir.gitTag('1.0.0');
      const gitInspector = new GitInspector(testDir.path);

      const tags = gitInspector.getAllTags();

      const commit = (await testDir.gitLog()).latest.hash;
      await expect(tags).resolves.toStrictEqual([{ tag: '1.0.0', commit }]);
    });

    it('throws an error if the path does not exist', async () => {
      const gitInspector = new GitInspector(path.join(testDir.path, 'non-existing-dir'));

      await expect(gitInspector.getAllTags()).rejects.toThrow('Cannot use simple-git on a directory that does not exist.');
    });

    it('throws an error if the path is not a repository', async () => {
      const gitInspector = new GitInspector(testDir.path);

      await expect(gitInspector.getAllTags()).rejects.toThrow();
    });
  });
});

class TestDir {
  readonly path: string;

  constructor() {
    this.path = fs.mkdtempSync(path.join(os.tmpdir(), 'dx-scanner'));
  }

  async gitInit(user?: { name: string; email: string }) {
    if (user === undefined) {
      user = { name: 'test', email: 'test@example.com' };
    }

    await git(this.path).init();
    await git(this.path).addConfig('user.name', user.name);
    await git(this.path).addConfig('user.email', user.email);
  }

  async gitAddFile(repoPath: string) {
    await fs.promises.writeFile(path.join(this.path, repoPath), '');
    await git(this.path).add(repoPath);
  }

  async gitCommit(message?: string, author?: string) {
    if (message === undefined) {
      message = 'msg';
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const options: { [key: string]: any } = { '--allow-empty': true };
    if (author !== undefined) {
      options['--author'] = author;
    }

    await git(this.path).commit(message, undefined, options);
  }

  gitLog() {
    return git(this.path).log();
  }

  async gitTag(name: string) {
    await git(this.path).tag([name]);
  }
}
