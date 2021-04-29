"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GitInspector_1 = require("./GitInspector");
const types_1 = require("../types");
const fs_1 = __importDefault(require("fs"));
const promise_1 = __importDefault(require("simple-git/promise"));
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const rimraf_1 = __importDefault(require("rimraf"));
const util_1 = __importDefault(require("util"));
const inversify_1 = require("inversify");
const delay_1 = require("../lib/delay");
describe('GitInspector', () => {
    let testDir;
    beforeEach(async () => {
        testDir = new TestDir();
    });
    afterEach(async () => {
        await util_1.default.promisify(rimraf_1.default)(testDir.path);
    });
    it('is injectable', () => {
        const container = new inversify_1.Container();
        container.bind(types_1.Types.RepositoryPath).toConstantValue(testDir.path);
        container.bind(GitInspector_1.GitInspector).toSelf();
        expect(() => container.get(GitInspector_1.GitInspector)).not.toThrow();
    });
    describe('#getCommits', () => {
        it('returns the page number', async () => {
            await testDir.gitInit();
            await testDir.gitCommit();
            const gitInspector = new GitInspector_1.GitInspector(testDir.path);
            const { page } = await gitInspector.getCommits({});
            expect(page).toStrictEqual(0);
        });
        it('returns the per page number', async () => {
            await testDir.gitInit();
            await testDir.gitCommit();
            const gitInspector = new GitInspector_1.GitInspector(testDir.path);
            const { perPage } = await gitInspector.getCommits({});
            expect(perPage).toStrictEqual(1);
        });
        it('returns all repository commits', async () => {
            await testDir.gitInit({ name: 'test', email: 'test@example.com' });
            await testDir.gitCommit('msg');
            const gitInspector = new GitInspector_1.GitInspector(testDir.path);
            const { items } = await gitInspector.getCommits({});
            const expected = (await testDir.gitLog()).latest;
            expect(items).toStrictEqual([
                {
                    sha: expected === null || expected === void 0 ? void 0 : expected.hash,
                    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
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
            const gitInspector = new GitInspector_1.GitInspector(testDir.path);
            const { items } = await gitInspector.getCommits({ filter: { author: 'test2@example.com' } });
            expect(items).toStrictEqual([
                {
                    sha: expected === null || expected === void 0 ? void 0 : expected.hash,
                    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
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
            const gitInspector = new GitInspector_1.GitInspector(testDir.path);
            const { items } = await gitInspector.getCommits({ filter: { sha: commit1 === null || commit1 === void 0 ? void 0 : commit1.hash } });
            expect(items).toStrictEqual([
                {
                    sha: commit2 === null || commit2 === void 0 ? void 0 : commit2.hash,
                    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
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
            const gitInspector = new GitInspector_1.GitInspector(testDir.path);
            const { items } = await gitInspector.getCommits({ filter: { path: 'file.txt' } });
            expect(items).toStrictEqual([
                {
                    sha: expected === null || expected === void 0 ? void 0 : expected.hash,
                    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
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
            await delay_1.delay(1000);
            await testDir.gitCommit('msg2');
            const expected = (await testDir.gitLog()).latest;
            const gitInspector = new GitInspector_1.GitInspector(testDir.path);
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
            const { items } = await gitInspector.getCommits({ filter: { since: new Date(expected.date) } });
            expect(items).toStrictEqual([
                {
                    sha: expected === null || expected === void 0 ? void 0 : expected.hash,
                    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
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
            await delay_1.delay(1000);
            await testDir.gitCommit('msg2');
            const gitInspector = new GitInspector_1.GitInspector(testDir.path);
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
            const { items } = await gitInspector.getCommits({ filter: { until: new Date(expected.date) } });
            expect(items).toStrictEqual([
                {
                    sha: expected === null || expected === void 0 ? void 0 : expected.hash,
                    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
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
            const gitInspector = new GitInspector_1.GitInspector(testDir.path);
            const { items } = await gitInspector.getCommits({ pagination: { page: 1, perPage: 2 } });
            expect(items).toStrictEqual([
                {
                    sha: expected2 === null || expected2 === void 0 ? void 0 : expected2.hash,
                    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
                    date: new Date(expected2.date),
                    message: 'msg4\n',
                    author: { name: 'test', email: 'test@example.com' },
                    commiter: undefined,
                },
                {
                    sha: expected1 === null || expected1 === void 0 ? void 0 : expected1.hash,
                    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
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
            const gitInspector = new GitInspector_1.GitInspector(testDir.path);
            const { items } = await gitInspector.getCommits({ pagination: { page: 0, perPage: 2 } });
            const expected = (await testDir.gitLog()).latest;
            expect(items).toStrictEqual([
                {
                    sha: expected === null || expected === void 0 ? void 0 : expected.hash,
                    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
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
            const gitInspector = new GitInspector_1.GitInspector(testDir.path);
            const message = (await gitInspector.getCommits({})).items[0].message;
            expect(message).toStrictEqual('multi\nline\nmessage\n');
        });
        it('returns the total count', async () => {
            await testDir.gitInit();
            await testDir.gitCommit();
            const gitInspector = new GitInspector_1.GitInspector(testDir.path);
            const { totalCount } = await gitInspector.getCommits({});
            expect(totalCount).toStrictEqual(1);
        });
        it('returns true if there is a next page', async () => {
            await testDir.gitInit();
            await testDir.gitCommit();
            await testDir.gitCommit();
            await testDir.gitCommit();
            await testDir.gitCommit();
            const gitInspector = new GitInspector_1.GitInspector(testDir.path);
            const { hasNextPage } = await gitInspector.getCommits({ pagination: { page: 0, perPage: 2 } });
            expect(hasNextPage).toStrictEqual(true);
        });
        it('returns false if there is no next page', async () => {
            await testDir.gitInit();
            await testDir.gitCommit();
            await testDir.gitCommit();
            const gitInspector = new GitInspector_1.GitInspector(testDir.path);
            const { hasNextPage } = await gitInspector.getCommits({ pagination: { page: 0, perPage: 2 } });
            expect(hasNextPage).toStrictEqual(false);
        });
        it('returns true if there is a previous page', async () => {
            await testDir.gitInit();
            await testDir.gitCommit();
            await testDir.gitCommit();
            await testDir.gitCommit();
            await testDir.gitCommit();
            const gitInspector = new GitInspector_1.GitInspector(testDir.path);
            const { hasPreviousPage } = await gitInspector.getCommits({ pagination: { page: 1, perPage: 2 } });
            expect(hasPreviousPage).toStrictEqual(true);
        });
        it('returns false if there is no previous page', async () => {
            await testDir.gitInit();
            await testDir.gitCommit();
            await testDir.gitCommit();
            const gitInspector = new GitInspector_1.GitInspector(testDir.path);
            const { hasPreviousPage } = await gitInspector.getCommits({ pagination: { page: 0, perPage: 2 } });
            expect(hasPreviousPage).toStrictEqual(false);
        });
        it('throws an error if the path does not exist', async () => {
            const gitInspector = new GitInspector_1.GitInspector(path_1.default.join(testDir.path, 'non-existing-dir'));
            await expect(gitInspector.getCommits({})).rejects.toThrow('Cannot use simple-git on a directory that does not exist');
        });
        it('throws an error if the path is not a repository', async () => {
            const gitInspector = new GitInspector_1.GitInspector(testDir.path);
            await expect(gitInspector.getCommits({})).rejects.toThrow();
        });
        it('throws an error if there are no commits in the repository', async () => {
            await testDir.gitInit();
            const gitInspector = new GitInspector_1.GitInspector(testDir.path);
            await expect(gitInspector.getCommits({})).rejects.toThrow("fatal: your current branch 'master' does not have any commits yet");
        });
        it('throws an error if sorting is requested', async () => {
            await testDir.gitInit();
            await testDir.gitCommit();
            const gitInspector = new GitInspector_1.GitInspector(testDir.path);
            await expect(gitInspector.getCommits({ sort: {} })).rejects.toThrow('sorting not implemented');
        });
    });
    describe('#getAuthors', () => {
        it('returns the page number', async () => {
            await testDir.gitInit();
            await testDir.gitCommit();
            const gitInspector = new GitInspector_1.GitInspector(testDir.path);
            const { page } = await gitInspector.getAuthors({});
            expect(page).toStrictEqual(0);
        });
        it('returns the per page number', async () => {
            await testDir.gitInit();
            await testDir.gitCommit();
            const gitInspector = new GitInspector_1.GitInspector(testDir.path);
            const { perPage } = await gitInspector.getAuthors({});
            expect(perPage).toStrictEqual(1);
        });
        it('returns all repository authors', async () => {
            await testDir.gitInit({ name: 'test', email: 'test@example.com' });
            await testDir.gitCommit();
            const gitInspector = new GitInspector_1.GitInspector(testDir.path);
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
            const gitInspector = new GitInspector_1.GitInspector(testDir.path);
            const { items } = await gitInspector.getAuthors({ pagination: { page: 1, perPage: 2 } });
            expect(items).toStrictEqual([
                { name: 'test4', email: 'test4@example.com' },
                { name: 'test3', email: 'test3@example.com' },
            ]);
        });
        it('returns remaining repository authors if pagination specifies a greater subset', async () => {
            await testDir.gitInit({ name: 'test', email: 'test@example.com' });
            await testDir.gitCommit();
            const gitInspector = new GitInspector_1.GitInspector(testDir.path);
            const { items } = await gitInspector.getAuthors({ pagination: { page: 0, perPage: 2 } });
            expect(items).toStrictEqual([{ name: 'test', email: 'test@example.com' }]);
        });
        it('returns only unique authors', async () => {
            await testDir.gitInit({ name: 'test', email: 'test@example.com' });
            await testDir.gitCommit();
            await testDir.gitCommit();
            const gitInspector = new GitInspector_1.GitInspector(testDir.path);
            const { items } = await gitInspector.getAuthors({});
            expect(items).toStrictEqual([{ name: 'test', email: 'test@example.com' }]);
        });
        it('returns the total count', async () => {
            await testDir.gitInit();
            await testDir.gitCommit();
            const gitInspector = new GitInspector_1.GitInspector(testDir.path);
            const { totalCount } = await gitInspector.getAuthors({});
            expect(totalCount).toStrictEqual(1);
        });
        it('returns true if there is a next page', async () => {
            await testDir.gitInit();
            await testDir.gitCommit(undefined, 'test1 <test1@example.com>');
            await testDir.gitCommit(undefined, 'test2 <test2@example.com>');
            await testDir.gitCommit(undefined, 'test3 <test3@example.com>');
            await testDir.gitCommit(undefined, 'test4 <test4@example.com>');
            const gitInspector = new GitInspector_1.GitInspector(testDir.path);
            const { hasNextPage } = await gitInspector.getAuthors({ pagination: { page: 0, perPage: 2 } });
            expect(hasNextPage).toStrictEqual(true);
        });
        it('returns false if there is no next page', async () => {
            await testDir.gitInit();
            await testDir.gitCommit();
            const gitInspector = new GitInspector_1.GitInspector(testDir.path);
            const { hasNextPage } = await gitInspector.getAuthors({});
            expect(hasNextPage).toStrictEqual(false);
        });
        it('returns true if there is a previous page', async () => {
            await testDir.gitInit();
            await testDir.gitCommit(undefined, 'test1 <test1@example.com>');
            await testDir.gitCommit(undefined, 'test2 <test2@example.com>');
            await testDir.gitCommit(undefined, 'test3 <test3@example.com>');
            await testDir.gitCommit(undefined, 'test4 <test4@example.com>');
            const gitInspector = new GitInspector_1.GitInspector(testDir.path);
            const { hasPreviousPage } = await gitInspector.getAuthors({ pagination: { page: 1, perPage: 2 } });
            expect(hasPreviousPage).toStrictEqual(true);
        });
        it('returns false if there is a previous page', async () => {
            await testDir.gitInit();
            await testDir.gitCommit();
            const gitInspector = new GitInspector_1.GitInspector(testDir.path);
            const { hasPreviousPage } = await gitInspector.getAuthors({});
            expect(hasPreviousPage).toStrictEqual(false);
        });
        it('throws an error if the path does not exist', async () => {
            const gitInspector = new GitInspector_1.GitInspector(path_1.default.join(testDir.path, 'non-existing-dir'));
            await expect(gitInspector.getAuthors({})).rejects.toThrow('Cannot use simple-git on a directory that does not exist');
        });
        it('throws an error if the path is not a repository', async () => {
            const gitInspector = new GitInspector_1.GitInspector(testDir.path);
            await expect(gitInspector.getAuthors({})).rejects.toThrow();
        });
        it('throws an error if there are no commits in the repository', async () => {
            await testDir.gitInit();
            const gitInspector = new GitInspector_1.GitInspector(testDir.path);
            await expect(gitInspector.getAuthors({})).rejects.toThrow("fatal: your current branch 'master' does not have any commits yet");
        });
        it('throws an error if filtering is requested', async () => {
            await testDir.gitInit();
            await testDir.gitCommit();
            const gitInspector = new GitInspector_1.GitInspector(testDir.path);
            await expect(gitInspector.getAuthors({ filter: {} })).rejects.toThrow('filtering and sorting not implemented');
        });
        it('throws an error if sorting is requested', async () => {
            await testDir.gitInit();
            await testDir.gitCommit();
            const gitInspector = new GitInspector_1.GitInspector(testDir.path);
            await expect(gitInspector.getAuthors({ sort: {} })).rejects.toThrow('filtering and sorting not implemented');
        });
    });
    describe('#getAllTags', () => {
        it('returns all repository tags', async () => {
            var _a;
            await testDir.gitInit();
            await testDir.gitCommit();
            await testDir.gitTag('1.0.0');
            const gitInspector = new GitInspector_1.GitInspector(testDir.path);
            const tags = gitInspector.getAllTags();
            const commit = (_a = (await testDir.gitLog()).latest) === null || _a === void 0 ? void 0 : _a.hash;
            await expect(tags).resolves.toStrictEqual([{ tag: '1.0.0', commit }]);
        });
        it('throws an error if the path does not exist', async () => {
            const gitInspector = new GitInspector_1.GitInspector(path_1.default.join(testDir.path, 'non-existing-dir'));
            await expect(gitInspector.getAllTags()).rejects.toThrow('Cannot use simple-git on a directory that does not exist');
        });
        it('throws an error if the path is not a repository', async () => {
            const gitInspector = new GitInspector_1.GitInspector(testDir.path);
            await expect(gitInspector.getAllTags()).rejects.toThrow();
        });
    });
});
class TestDir {
    constructor() {
        this.path = fs_1.default.mkdtempSync(path_1.default.join(os_1.default.tmpdir(), 'dx-scanner'));
    }
    async gitInit(user) {
        if (user === undefined) {
            user = { name: 'test', email: 'test@example.com' };
        }
        await promise_1.default(this.path).init();
        await promise_1.default(this.path).addConfig('user.name', user.name);
        await promise_1.default(this.path).addConfig('user.email', user.email);
    }
    async gitAddFile(repoPath) {
        await fs_1.default.promises.writeFile(path_1.default.join(this.path, repoPath), '');
        await promise_1.default(this.path).add(repoPath);
    }
    async gitCommit(message, author) {
        if (message === undefined) {
            message = 'msg';
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const options = { '--allow-empty': true };
        if (author !== undefined) {
            options['--author'] = author;
        }
        await promise_1.default(this.path).commit(message, undefined, options);
    }
    gitLog() {
        return promise_1.default(this.path).log();
    }
    async gitTag(name) {
        await promise_1.default(this.path).tag([name]);
    }
}
//# sourceMappingURL=GitInspector.spec.js.map