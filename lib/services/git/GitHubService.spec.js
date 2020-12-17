"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const nock_1 = __importDefault(require("nock"));
const inspectors_1 = require("../../inspectors");
const ArgumentsProviderFactory_1 = require("../../test/factories/ArgumentsProviderFactory");
const gitHubNock_1 = require("../../test/helpers/gitHubNock");
const GitHubService_1 = require("./GitHubService");
const listPullRequests_1 = require("./gqlQueries/listPullRequests");
const gitHubServiceMockFolder_1 = require("./__MOCKS__/gitHubServiceMockFolder");
const getRepoCommitsServiceResponse_mock_1 = require("./__MOCKS__/gitHubServiceMockFolder/getRepoCommitsServiceResponse.mock");
const gqlPullsResponse_mock_1 = require("./__MOCKS__/gitHubServiceMockFolder/gqlPullsResponse.mock");
const IGitHubService_1 = require("./IGitHubService");
describe('GitHub Service', () => {
    let service;
    const repositoryConfig = {
        remoteUrl: 'https://github.com/octocat/Hello-World',
        baseUrl: 'https://github.com',
        host: 'githum.com',
        protocol: 'https',
    };
    beforeEach(async () => {
        service = new GitHubService_1.GitHubService(ArgumentsProviderFactory_1.argumentsProviderFactory({ uri: '.' }), repositoryConfig);
    });
    describe('#getPullRequests', () => {
        it('purges the cache', async () => {
            new gitHubNock_1.GitHubNock('1', 'octocat', 1, 'Hello-World').getFile('README', 'before', undefined, false);
            await service.getRepoContent('octocat', 'Hello-World', 'README');
            service.purgeCache();
            new gitHubNock_1.GitHubNock('1', 'octocat', 1, 'Hello-World').getFile('README', 'after');
            const response = await service.getRepoContent('octocat', 'Hello-World', 'README');
            expect(response.content).toEqual('YWZ0ZXI=');
        });
        it('returns pulls in own interface', async () => {
            const lastMonth = new Date();
            lastMonth.setMonth(new Date().getMonth() - 1);
            const searchQuery = listPullRequests_1.generateSearchQuery('octocat', 'Hello-World', lastMonth, IGitHubService_1.GitHubGqlPullRequestState.all);
            const queryBody = {
                query: listPullRequests_1.listPullRequestsQuery(searchQuery),
                variables: {
                    count: 100,
                },
            };
            nock_1.default('https://api.github.com').post('/graphql', queryBody).reply(200, gqlPullsResponse_mock_1.gqlPullsResponse());
            const response = await service.listPullRequests('octocat', 'Hello-World');
            expect(response).toMatchObject(gitHubServiceMockFolder_1.getPullsServiceResponse);
        });
        it('returns pulls in own interface with diffStat', async () => {
            const lastMonth = new Date();
            lastMonth.setMonth(new Date().getMonth() - 1);
            const searchQuery = listPullRequests_1.generateSearchQuery('octocat', 'Hello-World', lastMonth, IGitHubService_1.GitHubGqlPullRequestState.open);
            const queryBody = {
                query: listPullRequests_1.listPullRequestsQuery(searchQuery),
                variables: {
                    count: 100,
                },
            };
            nock_1.default('https://api.github.com').post('/graphql', queryBody).reply(200, gqlPullsResponse_mock_1.gqlPullsResponse());
            const response = await service.listPullRequests('octocat', 'Hello-World', {
                withDiffStat: true,
                filter: { state: inspectors_1.PullRequestState.open },
            });
            const lines = { additions: 1, deletions: 1, changes: 2 };
            const getPullsServiceResponseWithDiffStat = lodash_1.default.cloneDeep(gitHubServiceMockFolder_1.getPullsServiceResponse);
            getPullsServiceResponseWithDiffStat.items[0] = Object.assign(Object.assign({}, getPullsServiceResponseWithDiffStat.items[0]), { lines });
            expect(response).toMatchObject(getPullsServiceResponseWithDiffStat);
        });
        it('returns one pull in own interface', async () => {
            const pagination = { perPage: 1 };
            const lastMonth = new Date();
            lastMonth.setMonth(new Date().getMonth() - 1);
            const searchQuery = listPullRequests_1.generateSearchQuery('octocat', 'Hello-World', lastMonth, IGitHubService_1.GitHubGqlPullRequestState.all);
            const queryBody = {
                query: listPullRequests_1.listPullRequestsQuery(searchQuery),
                variables: {
                    count: 1,
                },
            };
            nock_1.default('https://api.github.com').post('/graphql', queryBody).reply(200, gqlPullsResponse_mock_1.gqlPullsResponse());
            const response = await service.listPullRequests('octocat', 'Hello-World', { pagination });
            expect(response).toMatchObject(gitHubServiceMockFolder_1.getPullsServiceResponse);
        });
        it('returns two pulls in own interface one per page', async () => {
            const pagination = { perPage: 1 };
            const lastMonth = new Date();
            lastMonth.setMonth(new Date().getMonth() - 1);
            const searchQuery = listPullRequests_1.generateSearchQuery('octocat', 'Hello-World', lastMonth, IGitHubService_1.GitHubGqlPullRequestState.all);
            const queryBody = {
                query: listPullRequests_1.listPullRequestsQuery(searchQuery),
                variables: {
                    count: 1,
                },
            };
            const queryBodyScnd = {
                query: listPullRequests_1.listPullRequestsQuery(searchQuery),
                variables: {
                    count: 1,
                    startCursor: 'Y3Vyc29yOnYyOpHOHh1zPQ==',
                },
            };
            nock_1.default('https://api.github.com')
                .post('/graphql', queryBody)
                .reply(200, gqlPullsResponse_mock_1.gqlPullsResponse({ data: { search: { pageInfo: { hasNextPage: true } } } }));
            nock_1.default('https://api.github.com').post('/graphql', queryBodyScnd).reply(200, gqlPullsResponse_mock_1.gqlPullsResponse());
            const response = await service.listPullRequests('octocat', 'Hello-World', { pagination });
            expect(response.items.length).toEqual(2);
        });
        it('returns open pulls', async () => {
            const lastMonth = new Date();
            lastMonth.setMonth(new Date().getMonth() - 1);
            const searchQuery = listPullRequests_1.generateSearchQuery('octocat', 'Hello-World', lastMonth, IGitHubService_1.GitHubGqlPullRequestState.open);
            const queryBody = {
                query: listPullRequests_1.listPullRequestsQuery(searchQuery),
                variables: {
                    count: 100,
                },
            };
            nock_1.default('https://api.github.com').post('/graphql', queryBody).reply(200, gqlPullsResponse_mock_1.gqlPullsResponse());
            const response = await service.listPullRequests('octocat', 'Hello-World', { filter: { state: inspectors_1.PullRequestState.open } });
            expect(response.items.map((item) => item.state)).toMatchObject(['OPEN']);
        });
        it('returns closed pulls', async () => {
            const lastMonth = new Date();
            lastMonth.setMonth(new Date().getMonth() - 1);
            const searchQuery = listPullRequests_1.generateSearchQuery('octocat', 'Hello-World', lastMonth, IGitHubService_1.GitHubGqlPullRequestState.closed);
            const queryBody = {
                query: listPullRequests_1.listPullRequestsQuery(searchQuery),
                variables: {
                    count: 100,
                },
            };
            nock_1.default('https://api.github.com')
                .post('/graphql', queryBody)
                .reply(200, gqlPullsResponse_mock_1.gqlPullsResponse({ data: { search: { edges: [{ node: { state: 'CLOSED' } }] } } }));
            const response = await service.listPullRequests('octocat', 'Hello-World', { filter: { state: inspectors_1.PullRequestState.closed } });
            expect(response.items.map((item) => item.state)).toMatchObject(['CLOSED']);
        });
        it('returns all pulls', async () => {
            const lastMonth = new Date();
            lastMonth.setMonth(new Date().getMonth() - 1);
            const searchQuery = listPullRequests_1.generateSearchQuery('octocat', 'Hello-World', lastMonth, IGitHubService_1.GitHubGqlPullRequestState.all);
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
                            gqlPullsResponse_mock_1.oneGqlPullRequest({ node: { state: 'CLOSED' } }),
                            gqlPullsResponse_mock_1.oneGqlPullRequest({ node: { state: 'MERGED' } }),
                        ],
                    },
                },
            });
            nock_1.default('https://api.github.com').post('/graphql', queryBody).reply(200, pulls);
            const response = await service.listPullRequests('octocat', 'Hello-World', { filter: { state: inspectors_1.PullRequestState.all } });
            expect(response.items.map((item) => item.state)).toMatchObject(['OPEN', 'CLOSED', 'MERGED']);
        });
    });
    it('returns pull request reviews in own interface', async () => {
        new gitHubNock_1.GitHubNock('1', 'octocat', 1, 'Hello-World').getRepo('/pulls/1/reviews').reply(200, gitHubServiceMockFolder_1.getPullRequestsReviewsResponse);
        const response = await service.listPullRequestReviews('octocat', 'Hello-World', 1);
        expect(response).toMatchObject(gitHubServiceMockFolder_1.getPullsReviewsServiceResponse);
    });
    it('returns commits in own interface', async () => {
        new gitHubNock_1.GitHubNock('1', 'octocat', 1, 'Hello-World').getCommits().reply(200, gitHubServiceMockFolder_1.getRepoCommitsResponse);
        const response = await service.listRepoCommits('octocat', 'Hello-World');
        expect(response).toMatchObject(getRepoCommitsServiceResponse_mock_1.getRepoCommitsServiceResponse);
    });
    it('returns commits in own interface', async () => {
        new gitHubNock_1.GitHubNock('1', 'octocat', 1, 'Hello-World')
            .getGitCommits('762941318ee16e59dabbacb1b4049eec22f0d303')
            .reply(200, gitHubServiceMockFolder_1.getCommitResponse);
        const response = await service.getCommit('octocat', 'Hello-World', '762941318ee16e59dabbacb1b4049eec22f0d303');
        expect(response).toMatchObject(gitHubServiceMockFolder_1.getCommitServiceResponse);
    });
    it('returns contributors in own interface', async () => {
        new gitHubNock_1.GitHubNock('1', 'octocat', 1, 'Hello-World').getContributors([
            { id: '251370', login: 'Spaceghost' },
            { id: '583231', login: 'octocat' },
        ]);
        const response = await service.listContributors('octocat', 'Hello-World');
        expect(response).toMatchObject(gitHubServiceMockFolder_1.getContributorsServiceResponse);
    });
    it('returns contributor stats in own interface', async () => {
        new gitHubNock_1.GitHubNock('1', 'octocat', 1, 'Hello-World').getRepo('/stats/contributors').reply(200, gitHubServiceMockFolder_1.getContributorsStatsResponse);
        const response = await service.listContributorsStats('octocat', 'Hello-World');
        expect(response).toMatchObject(gitHubServiceMockFolder_1.getContributorsStatsServiceResponse);
    });
    describe('#getRepoContent', () => {
        it('returns files in own interface', async () => {
            new gitHubNock_1.GitHubNock('1', 'octocat', 1, 'Hello-World').getFile('README', 'Hello World!\n', '980a0d5f19a64b4b30a87d4206aade58726b60e3');
            const response = await service.getRepoContent('octocat', 'Hello-World', 'README');
            expect(response).toMatchObject(gitHubServiceMockFolder_1.getRepoContentServiceResponseFile);
        });
        it('returns directories in own interface', async () => {
            new gitHubNock_1.GitHubNock('1', 'octocat', 1, 'Hello-World').getDirectory('mockFolder', ['mockFile.ts'], []);
            const response = await service.getRepoContent('octocat', 'Hello-World', 'mockFolder');
            expect(response).toMatchObject(gitHubServiceMockFolder_1.getRepoContentServiceResponseDir);
        });
        it("returns null if the path doesn't exists", async () => {
            new gitHubNock_1.GitHubNock('1', 'octocat', 1, 'Hello-World').getNonexistentContents('notExistingMockFolder');
            const result = await service.getRepoContent('octocat', 'Hello-World', 'notExistingMockFolder');
            expect(result).toBe(null);
        });
        it('caches the results', async () => {
            // bacause of persist == false, the second call to service.getRepoContent() would cause Nock to throw an error if the cache wasn't used
            new gitHubNock_1.GitHubNock('1', 'octocat', 1, 'Hello-World').getFile('README', undefined, undefined, false);
            await service.getRepoContent('octocat', 'Hello-World', 'README');
            await service.getRepoContent('octocat', 'Hello-World', 'README');
        });
    });
    it('returns issues in own interface', async () => {
        new gitHubNock_1.GitHubNock('1', 'octocat', 1, 'Hello-World').getIssues().reply(200, gitHubServiceMockFolder_1.getIssuesResponse);
        const response = await service.listIssues('octocat', 'Hello-World');
        expect(response).toMatchObject(gitHubServiceMockFolder_1.getIssuesServiceResponse);
    });
    it('returns comments in own interface', async () => {
        new gitHubNock_1.GitHubNock('1', 'octocat', 1, 'Hello-World').getRepo('/issues/1/comments').reply(200, gitHubServiceMockFolder_1.getIssueCommentsResponse);
        const response = await service.listIssueComments('octocat', 'Hello-World', 1);
        expect(response).toMatchObject(gitHubServiceMockFolder_1.getIssueCommentsServiceResponse);
    });
    it('returns commits in own interfa', async () => {
        new gitHubNock_1.GitHubNock('1', 'octocat', 1, 'Hello-World').getRepo('/issues/1/comments').reply(200, gitHubServiceMockFolder_1.getIssueCommentsResponse);
        const response = await service.listIssueComments('octocat', 'Hello-World', 1);
        expect(response).toMatchObject(gitHubServiceMockFolder_1.getIssueCommentsServiceResponse);
    });
    it('returns pull files in own interface', async () => {
        new gitHubNock_1.GitHubNock('1', 'octocat', 1, 'Hello-World').getRepo('/pulls/1/files').reply(200, gitHubServiceMockFolder_1.getPullsFilesResponse);
        const response = await service.listPullRequestFiles('octocat', 'Hello-World', 1);
        expect(response).toMatchObject(gitHubServiceMockFolder_1.getPullsFilesServiceResponse);
    });
    it('returns pull commits in own interface', async () => {
        new gitHubNock_1.GitHubNock('1', 'octocat', 1, 'Hello-World').getRepo('/pulls/1/commits').reply(200, gitHubServiceMockFolder_1.getPullCommitsResponse);
        const response = await service.listPullCommits('octocat', 'Hello-World', 1);
        expect(response).toMatchObject(gitHubServiceMockFolder_1.getPullCommitsServiceResponse);
    });
});
//# sourceMappingURL=GitHubService.spec.js.map