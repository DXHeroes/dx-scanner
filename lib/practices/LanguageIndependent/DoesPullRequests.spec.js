"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nock_1 = __importDefault(require("nock"));
const inversify_config_1 = require("../../inversify.config");
const model_1 = require("../../model");
const getRepoCommitsResponse_mock_1 = require("../../services/git/__MOCKS__/gitHubServiceMockFolder/getRepoCommitsResponse.mock");
const gqlPullsResponse_mock_1 = require("../../services/git/__MOCKS__/gitHubServiceMockFolder/gqlPullsResponse.mock");
const gitHubNock_1 = require("../../test/helpers/gitHubNock");
const DoesPullRequests_1 = require("./DoesPullRequests");
const listPullRequests_1 = require("../../services/git/gqlQueries/listPullRequests");
const services_1 = require("../../services");
describe('DoesPullRequests', () => {
    let practice;
    let containerCtx;
    beforeAll(() => {
        containerCtx = inversify_config_1.createTestContainer();
        containerCtx.container.bind('DoesPullRequests').to(DoesPullRequests_1.DoesPullRequestsPractice);
        practice = containerCtx.container.get('DoesPullRequests');
    });
    afterEach(async () => {
        var _a;
        containerCtx.virtualFileSystemService.clearFileSystem();
        containerCtx.practiceContext.fileInspector.purgeCache();
        (_a = containerCtx.practiceContext.collaborationInspector) === null || _a === void 0 ? void 0 : _a.purgeCache();
    });
    it('return practicing if there is at least one PR which is newer than last commit in master minus 30 days', async () => {
        var _a;
        containerCtx.practiceContext.projectComponent.repositoryPath = 'https://github.com/octocat/Hello-World';
        const lastMonth = new Date();
        lastMonth.setMonth(new Date().getMonth() - 1);
        const searchQuery = listPullRequests_1.generateSearchQuery('octocat', 'Hello-World', lastMonth, services_1.GitHubGqlPullRequestState.all);
        const queryBody = {
            query: listPullRequests_1.listPullRequestsQuery(searchQuery),
            variables: {
                count: 100,
            },
        };
        nock_1.default('https://api.github.com')
            .post('/graphql', queryBody)
            .reply(200, gqlPullsResponse_mock_1.gqlPullsResponse({
            data: {
                search: { edges: [{ node: { createdAt: '2011-01-13T04:42:41Z', updatedAt: '2011-01-13T04:42:41Z' } }] },
            },
        }));
        new gitHubNock_1.GitHubNock('1', 'octocat', 1, 'Hello-World').getCommits().reply(200, getRepoCommitsResponse_mock_1.getRepoCommitsResponse);
        const evaluated = await practice.evaluate(containerCtx.practiceContext);
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.practicing);
        expect((_a = practice.data.statistics) === null || _a === void 0 ? void 0 : _a.pullRequests).toBeDefined();
    });
    it('return practicing if there is at least one PR which is newer than last commit in master minus 30 days, author can be null', async () => {
        var _a;
        containerCtx.practiceContext.projectComponent.repositoryPath = 'https://github.com/octocat/Hello-World';
        const lastMonth = new Date();
        lastMonth.setMonth(new Date().getMonth() - 1);
        const searchQuery = listPullRequests_1.generateSearchQuery('octocat', 'Hello-World', lastMonth, services_1.GitHubGqlPullRequestState.all);
        const queryBody = {
            query: listPullRequests_1.listPullRequestsQuery(searchQuery),
            variables: {
                count: 100,
            },
        };
        nock_1.default('https://api.github.com')
            .post('/graphql', queryBody)
            .reply(200, gqlPullsResponse_mock_1.gqlPullsResponse({
            data: {
                search: {
                    edges: [{ node: { author: null, createdAt: '2011-01-13T04:42:41Z', updatedAt: '2011-01-13T04:42:41Z' } }],
                },
            },
        }));
        new gitHubNock_1.GitHubNock('1', 'octocat', 1, 'Hello-World').getCommits().reply(200, getRepoCommitsResponse_mock_1.getRepoCommitsResponse);
        const evaluated = await practice.evaluate(containerCtx.practiceContext);
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.practicing);
        expect((_a = practice.data.statistics) === null || _a === void 0 ? void 0 : _a.pullRequests).toBeDefined();
    });
    it('return notPracticing if there is no PR which is newer than last commit in master minus 30 days', async () => {
        containerCtx.practiceContext.projectComponent.repositoryPath = 'https://github.com/octocat/Hello-World';
        const lastMonth = new Date();
        lastMonth.setMonth(new Date().getMonth() - 1);
        const searchQuery = listPullRequests_1.generateSearchQuery('octocat', 'Hello-World', lastMonth, services_1.GitHubGqlPullRequestState.all);
        const queryBody = {
            query: listPullRequests_1.listPullRequestsQuery(searchQuery),
            variables: {
                count: 100,
            },
        };
        nock_1.default('https://api.github.com')
            .post('/graphql', queryBody)
            .reply(200, gqlPullsResponse_mock_1.gqlPullsResponse({
            data: {
                search: { edges: [{ node: { createdAt: '2010-01-13T04:42:41Z', updatedAt: '2010-01-13T04:42:41Z' } }] },
            },
        }));
        new gitHubNock_1.GitHubNock('1', 'octocat', 1, 'Hello-World').getCommits().reply(200, getRepoCommitsResponse_mock_1.getRepoCommitsResponse);
        const evaluated = await practice.evaluate(containerCtx.practiceContext);
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.notPracticing);
    });
    it('return notPracticing if there is PR older than 30 days than the last commit in master', async () => {
        containerCtx.practiceContext.projectComponent.repositoryPath = 'https://github.com/octocat/Hello-World';
        const lastMonth = new Date();
        lastMonth.setMonth(new Date().getMonth() - 1);
        const searchQuery = listPullRequests_1.generateSearchQuery('octocat', 'Hello-World', lastMonth, services_1.GitHubGqlPullRequestState.all);
        const queryBody = {
            query: listPullRequests_1.listPullRequestsQuery(searchQuery),
            variables: {
                count: 100,
            },
        };
        nock_1.default('https://api.github.com')
            .post('/graphql', queryBody)
            .reply(200, gqlPullsResponse_mock_1.gqlPullsResponse({
            data: {
                search: { edges: [{ node: { createdAt: '2010-01-13T04:42:41Z', updatedAt: '2010-01-13T04:42:41Z' } }] },
            },
        }));
        new gitHubNock_1.GitHubNock('1', 'octocat', 1, 'Hello-World').getCommits().reply(200, getRepoCommitsResponse_mock_1.getRepoCommitsResponse);
        const evaluated = await practice.evaluate(containerCtx.practiceContext);
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.notPracticing);
    });
    it('return true as it is always applicable', async () => {
        const applicable = await practice.isApplicable();
        expect(applicable).toEqual(true);
    });
    it('return unknown if there is no collaborationInspector', async () => {
        containerCtx.practiceContext.collaborationInspector = undefined;
        const evaluated = await practice.evaluate(containerCtx.practiceContext);
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.unknown);
    });
});
//# sourceMappingURL=DoesPullRequests.spec.js.map