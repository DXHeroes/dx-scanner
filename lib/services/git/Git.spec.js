"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Git_1 = require("./Git");
const gitHubNock_1 = require("../../test/helpers/gitHubNock");
const GitHubService_1 = require("./GitHubService");
const ArgumentsProviderFactory_1 = require("../../test/factories/ArgumentsProviderFactory");
const listPullRequests_1 = require("./gqlQueries/listPullRequests");
const nock_1 = __importDefault(require("nock"));
const gqlPullsResponse_mock_1 = require("./__MOCKS__/gitHubServiceMockFolder/gqlPullsResponse.mock");
const _1 = require(".");
describe('Git', () => {
    let service, git, gitHubNock;
    const repositoryConfig = {
        remoteUrl: 'https://github.com/octocat/Hello-World',
        baseUrl: 'https://github.com',
        host: 'github.com',
        protocol: 'https',
    };
    beforeAll(() => {
        service = new GitHubService_1.GitHubService(ArgumentsProviderFactory_1.argumentsProviderFactory({ uri: '.' }), repositoryConfig);
        git = new Git_1.Git({ url: 'https://github.com/octocat/Hello-World.git' }, service);
        gitHubNock = new gitHubNock_1.GitHubNock('1', 'octocat', 1, 'Hello-World');
    });
    beforeEach(() => {
        service.purgeCache();
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
    describe('#isFile', () => {
        it('should return file', async () => {
            gitHubNock.getFile('mockFile.ts');
            const result = await git.isFile('mockFile.ts');
            expect(result).toEqual(true);
        });
        it("should throw an error if the target doesn't exist", async () => {
            gitHubNock.getNonexistentContents('notExistingMockFolder');
            await expect(git.isFile('notExistingMockFolder')).rejects.toThrow('Could not get content of notExistingMockFolder');
        });
        it('caches the results', async () => {
            // bacause of persist == false, the second call to git.isFile() would cause Nock to throw an error if the cache wasn't used
            gitHubNock.getFile('mockFile.ts', undefined, undefined, false);
            await git.isFile('mockFile.ts');
            await git.isFile('mockFile.ts');
        });
    });
    describe('#isDirectory', () => {
        it('should return file', async () => {
            gitHubNock.getDirectory('mockFolder', [], []);
            const result = await git.isDirectory('mockFolder');
            expect(result).toEqual(true);
        });
        it("should throw an error if the target doesn't exist", async () => {
            gitHubNock.getNonexistentContents('notExistingMockFolder');
            await expect(git.isDirectory('notExistingMockFolder')).rejects.toThrow('Could not get content of notExistingMockFolder');
        });
        it('caches the results', async () => {
            // bacause of persist == false, the second call to git.isDirectory() would cause Nock to throw an error if the cache wasn't used
            gitHubNock.getDirectory('mockFolder', [], [], false);
            await git.isDirectory('mockFolder');
            await git.isDirectory('mockFolder');
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
    describe('#flatTraverse', () => {
        describe('#fetch dir and files', () => {
            beforeEach(() => {
                gitHubNock.getDirectory('mockFolder', ['mockFile.ts'], ['mockSubFolder']);
                gitHubNock.getFile('mockFolder/mockFile.ts');
                gitHubNock.getDirectory('mockFolder/mockSubFolder', ['mockSubFolderFile.txt'], []);
                gitHubNock.getFile('mockFolder/mockSubFolder/mockSubFolderFile.txt');
            });
            it('returns keys of metadata of all results', async () => {
                const files = [];
                await git.flatTraverse('mockFolder', (meta) => {
                    files.push(meta.name);
                });
                expect(files.length).toEqual(3);
                expect(files).toContain('mockFile.ts');
                expect(files).toContain('mockSubFolder');
                expect(files).toContain('mockSubFolderFile.txt');
            });
            it('stops on false', async () => {
                await git
                    .flatTraverse('mockFolder', () => {
                    return false;
                })
                    .then(() => fail("promise didn't fail"))
                    .catch((e) => expect(e).toBe(false));
            });
        });
        it("throws an error if the root doesn't exist", async () => {
            gitHubNock.getNonexistentContents('notExistingMockFolder');
            await expect(git.flatTraverse('notExistingMockFolder', () => true)).rejects.toThrow('notExistingMockFolder is not a directory');
        });
        it("throws an error if the root isn't a directory", async () => {
            gitHubNock.getFile('mockFile.ts');
            await expect(git.flatTraverse('mockFile.ts', () => true)).rejects.toThrow('mockFile.ts is not a directory');
        });
        it('caches the results', async () => {
            // bacause of persist == false, the second call to git.flatTraverse() would cause Nock to throw an error if the cache wasn't used
            gitHubNock.getDirectory('mockFolder', ['mockFile.ts'], ['mockSubFolder'], false);
            gitHubNock.getFile('mockFolder/mockFile.ts', undefined, undefined, false);
            gitHubNock.getDirectory('mockFolder/mockSubFolder', ['mockSubFolderFile.txt'], [], false);
            gitHubNock.getFile('mockFolder/mockSubFolder/mockSubFolderFile.txt', undefined, undefined, false);
            await git.flatTraverse('mockFolder', () => true);
            await git.flatTraverse('mockFolder', () => true);
        });
    });
    describe('#getContributorCount', () => {
        it('returns the number of contributors', async () => {
            gitHubNock.getContributors([
                { id: '251370', login: 'Spaceghost' },
                { id: '583231', login: 'octocat' },
            ]);
            const result = await git.getContributorCount();
            expect(result).toEqual(2);
        });
    });
    describe('#getPullRequestCount', () => {
        it('returns the number of both open and closed pull requests', async () => {
            const lastMonth = new Date();
            lastMonth.setMonth(new Date().getMonth() - 1);
            const searchQuery = listPullRequests_1.generateSearchQuery('octocat', 'Hello-World', lastMonth, _1.GitHubGqlPullRequestState.all);
            const queryBody = {
                query: listPullRequests_1.listPullRequestsQuery(searchQuery),
                variables: {
                    count: 100,
                },
            };
            const pulls = gqlPullsResponse_mock_1.gqlPullsResponse({
                data: {
                    search: {
                        edges: [
                            gqlPullsResponse_mock_1.oneGqlPullRequest({ node: { state: 'OPEN' } }),
                            gqlPullsResponse_mock_1.oneGqlPullRequest({ node: { state: 'MERGED' } }),
                            gqlPullsResponse_mock_1.oneGqlPullRequest({ node: { state: 'CLOSED' } }),
                        ],
                    },
                },
            });
            nock_1.default('https://api.github.com').post('/graphql', queryBody).reply(200, pulls);
            const result = await git.getPullRequestCount();
            expect(result).toEqual(3);
        });
    });
});
//# sourceMappingURL=Git.spec.js.map