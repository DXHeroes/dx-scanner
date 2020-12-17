"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_config_1 = require("../inversify.config");
const gitHubNock_1 = require("../test/helpers/gitHubNock");
const gitHubServiceMockFolder_1 = require("../services/git/__MOCKS__/gitHubServiceMockFolder");
const types_1 = require("../types");
const services_1 = require("../services");
const bitbucketNock_1 = require("../test/helpers/bitbucketNock");
const _1 = require(".");
const prResponseFactory_1 = require("../test/factories/responses/bitbucket/prResponseFactory");
const IBitbucketService_1 = require("../services/bitbucket/IBitbucketService");
const nock_1 = __importDefault(require("nock"));
const gqlPullsResponse_mock_1 = require("../services/git/__MOCKS__/gitHubServiceMockFolder/gqlPullsResponse.mock");
const listPullRequests_1 = require("../services/git/gqlQueries/listPullRequests");
describe('Collaboration Inspector', () => {
    let inspector;
    let containerCtx;
    let bitbucketNock;
    beforeAll(async () => {
        containerCtx = inversify_config_1.createTestContainer();
    });
    beforeEach(async () => {
        inspector = containerCtx.practiceContext.collaborationInspector;
    });
    it('returns paginated pull requests', async () => {
        const pagination = { perPage: 1 };
        const lastMonth = new Date();
        lastMonth.setMonth(new Date().getMonth() - 1);
        const searchQuery = listPullRequests_1.generateSearchQuery('octocat', 'Hello-World', lastMonth, services_1.GitHubGqlPullRequestState.all);
        const queryBody = {
            query: listPullRequests_1.listPullRequestsQuery(searchQuery),
            variables: {
                count: 1,
            },
        };
        nock_1.default('https://api.github.com').post('/graphql', queryBody).reply(200, gqlPullsResponse_mock_1.gqlPullsResponse());
        const response = await inspector.listPullRequests('octocat', 'Hello-World', { pagination });
        expect(response).toMatchObject(gitHubServiceMockFolder_1.getPullsServiceResponse);
    });
    it('returns one pull request', async () => {
        new gitHubNock_1.GitHubNock('583231', 'octocat', 1296269, 'Hello-World').getPull(1, 'closed', 'Edited README via GitHub', '', 'patch-1', 'master');
        const response = await inspector.getPullRequest('octocat', 'Hello-World', 1);
        expect(response).toMatchObject(gitHubServiceMockFolder_1.getPullServiceResponse);
    });
    it('returns pull request files', async () => {
        new gitHubNock_1.GitHubNock('1', 'octocat', 1, 'Hello-World').getRepo('/pulls/1/files').reply(200, gitHubServiceMockFolder_1.getPullsFilesResponse);
        const response = await inspector.listPullRequestFiles('octocat', 'Hello-World', 1);
        expect(response).toMatchObject(gitHubServiceMockFolder_1.getPullsFilesServiceResponse);
    });
    it('return pull request commits', async () => {
        new gitHubNock_1.GitHubNock('1', 'octocat', 1, 'Hello-World').getRepo('/pulls/1/commits').reply(200, gitHubServiceMockFolder_1.getPullCommitsResponse);
        const response = await inspector.listPullCommits('octocat', 'Hello-World', 1);
        expect(response).toMatchObject(gitHubServiceMockFolder_1.getPullCommitsServiceResponse);
    });
    it('returns max number of pull requests', async () => {
        bitbucketNock = new bitbucketNock_1.BitbucketNock('pypy', 'pypy');
        containerCtx.container.rebind(types_1.Types.IContentRepositoryBrowser).to(services_1.BitbucketService);
        const collaborationInspector = containerCtx.container.get(types_1.Types.ICollaborationInspector);
        const mockPr = prResponseFactory_1.bitbucketPullRequestResponseFactory({
            state: IBitbucketService_1.BitbucketPullRequestState.closed,
        });
        bitbucketNock.getOwnerId();
        bitbucketNock.listPullRequestsResponse([mockPr], {
            pagination: { page: 1, perPage: 5 },
            filter: { state: IBitbucketService_1.BitbucketPullRequestState.closed },
        });
        const response = await collaborationInspector.listPullRequests('pypy', 'pypy', {
            pagination: { page: 1, perPage: 5 },
            filter: { state: _1.PullRequestState.closed },
        });
        expect(response.items).toHaveLength(1);
        expect(response.items[0].state).toEqual(IBitbucketService_1.BitbucketPullRequestState.closed);
    });
    it('returns pulls diff stat in own interface', async () => {
        bitbucketNock = new bitbucketNock_1.BitbucketNock('pypy', 'pypy');
        containerCtx.container.rebind(types_1.Types.IContentRepositoryBrowser).to(services_1.BitbucketService);
        const collaborationInspector = containerCtx.container.get(types_1.Types.ICollaborationInspector);
        bitbucketNock.getPRsAdditionsAndDeletions(622);
        const response = await collaborationInspector.getPullsDiffStat('pypy', 'pypy', 622);
        expect(response).toMatchObject({ additions: 2, deletions: 1, changes: 3 });
    });
});
//# sourceMappingURL=CollaborationInspector.spec.js.map