"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inspectors_1 = require("../../inspectors");
const ArgumentsProviderFactory_1 = require("../../test/factories/ArgumentsProviderFactory");
const commitsFactory_1 = require("../../test/factories/responses/gitLab/commitsFactory");
const issueResponseFactory_1 = require("../../test/factories/responses/gitLab/issueResponseFactory");
const branchResponseFactory_1 = require("../../test/factories/responses/gitLab/branchResponseFactory");
const prResponseFactory_1 = require("../../test/factories/responses/gitLab/prResponseFactory");
const repoCommitResponseFactory_1 = require("../../test/factories/responses/gitLab/repoCommitResponseFactory");
const gitLabNock_1 = require("../../test/helpers/gitLabNock");
const getIssueResponse_1 = require("../git/__MOCKS__/gitLabServiceMockFolder/getIssueResponse");
const getPullCommitsResponse_1 = require("../git/__MOCKS__/gitLabServiceMockFolder/getPullCommitsResponse");
const getPullRequestResponse_1 = require("../git/__MOCKS__/gitLabServiceMockFolder/getPullRequestResponse");
const listBranchesResponse_1 = require("../git/__MOCKS__/gitLabServiceMockFolder/listBranchesResponse");
const getRepoCommitResponse_1 = require("../git/__MOCKS__/gitLabServiceMockFolder/getRepoCommitResponse");
const listIssueComments_1 = require("../git/__MOCKS__/gitLabServiceMockFolder/listIssueComments");
const listIssuesResponse_1 = require("../git/__MOCKS__/gitLabServiceMockFolder/listIssuesResponse");
const listPullRequestsResponse_1 = require("../git/__MOCKS__/gitLabServiceMockFolder/listPullRequestsResponse");
const listRepoCommitsResponse_1 = require("../git/__MOCKS__/gitLabServiceMockFolder/listRepoCommitsResponse");
const GitLabService_1 = require("./GitLabService");
const IGitLabService_1 = require("./IGitLabService");
const nock_1 = __importDefault(require("nock"));
const listPullRequestComments_1 = require("../git/__MOCKS__/gitLabServiceMockFolder/listPullRequestComments");
const getContributorsServiceResponse_mock_1 = require("../git/__MOCKS__/gitLabServiceMockFolder/getContributorsServiceResponse.mock");
describe('GitLab Service', () => {
    let service;
    let gitLabNock;
    const repositoryConfig = {
        remoteUrl: 'https://gitlab.com/gitlab/gitlab-org',
        baseUrl: 'https://gitlab.com',
        host: 'gitlab.com',
        protocol: 'https',
    };
    beforeEach(async () => {
        service = new GitLabService_1.GitLabService(ArgumentsProviderFactory_1.argumentsProviderFactory({ uri: 'https://gitlab.com/gitlab-org/gitlab' }), repositoryConfig);
        gitLabNock = new gitLabNock_1.GitLabNock('gitlab-org', 'gitlab');
    });
    it('Returns list of merge requests in own interface', async () => {
        const mockPr = prResponseFactory_1.gitLabPullRequestResponseFactory();
        gitLabNock.getGroupInfo();
        gitLabNock.listPullRequestsResponse([mockPr], { filter: { state: IGitLabService_1.GitLabPullRequestState.open }, pagination: { page: 1, perPage: 1 } });
        const response = await service.listPullRequests('gitlab-org', 'gitlab', {
            pagination: { page: 1, perPage: 1 },
            filter: { state: inspectors_1.PullRequestState.open },
        });
        expect(response).toMatchObject(listPullRequestsResponse_1.listPullRequestsResponse(undefined, { page: 1, perPage: 1 }));
    });
    it('Returns one pull request in own interface', async () => {
        const mockPr = prResponseFactory_1.gitLabPullRequestResponseFactory();
        gitLabNock.getPullRequestResponse(mockPr, 25985);
        gitLabNock.getGroupInfo();
        const response = await service.getPullRequest('gitlab-org', 'gitlab', 25985);
        expect(response).toMatchObject(getPullRequestResponse_1.getPullRequestResponse());
    });
    it('Returns pull commits in own interface', async () => {
        const mockCommits = commitsFactory_1.gitLabCommitsResponseFactory();
        gitLabNock.listPullCommitsResponse([mockCommits], 25985, { pagination: { page: 1, perPage: 1 } });
        gitLabNock.getCommitResponse(mockCommits, '4eecfba1b1e2c35c13a7b34fc3d71e58cbb3645d');
        const response = await service.listPullCommits('gitlab-org', 'gitlab', 25985, { pagination: { page: 1, perPage: 1 } });
        expect(response).toMatchObject(getPullCommitsResponse_1.getPullCommitsResponse(undefined, { page: 1, perPage: 1 }));
    });
    it('Returns repo commit in own interface', async () => {
        const mockCommits = commitsFactory_1.gitLabCommitsResponseFactory();
        gitLabNock.getCommitResponse(mockCommits, 'df760e1c');
        const response = await service.getCommit('gitlab-org', 'gitlab', 'df760e1c');
        expect(response).toMatchObject(getRepoCommitResponse_1.getRepoCommit());
    });
    it('Returns repo commits in own interface', async () => {
        const mockCommits = repoCommitResponseFactory_1.gitLabRepoCommitsResponseFactory();
        gitLabNock.listRepoCommitsResponse([mockCommits], true, { pagination: { page: 1, perPage: 1 } });
        const response = await service.listRepoCommits('gitlab-org', 'gitlab', { pagination: { page: 1, perPage: 1 } });
        expect(response).toMatchObject(listRepoCommitsResponse_1.listRepoCommits(undefined, { page: 1, perPage: 1 }));
    });
    it('Returns one issue in own interface', async () => {
        const mockIssue = issueResponseFactory_1.gitLabIssueResponseFactory({});
        gitLabNock.getIssueResponse(mockIssue);
        const response = await service.getIssue('gitlab-org', 'gitlab', 207825);
        expect(response).toMatchObject(getIssueResponse_1.getIssueResponse());
    });
    it('Returns issues in own interface', async () => {
        const mockIssue = issueResponseFactory_1.gitLabIssueResponseFactory({});
        gitLabNock.listIssuesResponse([mockIssue], { pagination: { page: 1, perPage: 1 } });
        gitLabNock.getGroupInfo();
        const response = await service.listIssues('gitlab-org', 'gitlab', { pagination: { page: 1, perPage: 1 } });
        expect(response).toMatchObject(listIssuesResponse_1.listIssuesResponse(undefined, { page: 1, perPage: 1 }));
    });
    it('Returns issues for user in own interface', async () => {
        gitLabNock = new gitLabNock_1.GitLabNock('homolova', 'ted_ontouml_kom');
        const mockIssue = issueResponseFactory_1.gitLabIssueResponseFactory(issueResponseFactory_1.issueOfUser);
        gitLabNock.listIssuesResponse([mockIssue], { pagination: { page: 1, perPage: 1 } });
        gitLabNock.getUserInfo();
        const response = await service.listIssues('homolova', 'ted_ontouml_kom', { pagination: { page: 1, perPage: 1 } });
        expect(response).toMatchObject(listIssuesResponse_1.listIssuesResponse(listIssuesResponse_1.mockListIssuesResponseForUser, { page: 1, perPage: 1 }));
    });
    it('Returns issue comments in own interface', async () => {
        gitLabNock = new gitLabNock_1.GitLabNock('homolova', 'ted_ontouml_kom');
        gitLabNock.listIssueCommentsResponse(1, { pagination: { page: 1, perPage: 1 } });
        const response = await service.listIssueComments('homolova', 'ted_ontouml_kom', 1, { pagination: { page: 1, perPage: 1 } });
        expect(response).toMatchObject(listIssueComments_1.listIssueCommentsResponse(undefined, { page: 1, perPage: 1 }));
    });
    it('The response id defined when getRepo is called', async () => {
        gitLabNock.getRepoResponse();
        const response = await service.getRepo('gitlab-org', 'gitlab');
        expect(response).toBeDefined();
    });
    it('Returns pull request comments in own interface', async () => {
        gitLabNock = new gitLabNock_1.GitLabNock('homolova', 'ted_ontouml_kom');
        gitLabNock.listPullRequestCommentsResponse(1);
        const response = await service.listPullRequestComments('homolova', 'ted_ontouml_kom', 1);
        expect(response).toMatchObject(listPullRequestComments_1.listPullRequestCommentsResponse());
    });
    it('Returns version and revision if the host name exists and AT is provided', async () => {
        const repositoryConfig = {
            remoteUrl: 'https://git.example.cz/dxheroes/user/repo',
            baseUrl: 'https://git.example.cz',
            host: 'git.example.cz',
            protocol: 'https',
        };
        service = new GitLabService_1.GitLabService(ArgumentsProviderFactory_1.argumentsProviderFactory({ uri: 'https://git.example.cz/dxheroes/user/repo', auth: 'auth' }), repositoryConfig);
        gitLabNock = new gitLabNock_1.GitLabNock('user', 'repo', repositoryConfig.host);
        gitLabNock.checkVersion().reply(200, { version: '1.0.0', revision: '225c2e' });
        const response = await service.checkVersion();
        expect(response).toMatchObject({ version: '1.0.0', revision: '225c2e' });
    });
    it('Returns branches in own interface', async () => {
        const mockBranch = branchResponseFactory_1.gitLabBranchResponseFactory({});
        gitLabNock.listBranchesResponse([mockBranch], { pagination: { page: 1, perPage: 1 } });
        gitLabNock.getGroupInfo();
        const response = await service.listBranches('gitlab-org', 'gitlab', { pagination: { page: 1, perPage: 1 } });
        expect(response).toMatchObject(listBranchesResponse_1.listBranchesResponse(undefined, { page: 1, perPage: 1 }));
    });
    it('Returns 401 if the host name exists but AT is not provided', async () => {
        const repositoryConfig = {
            remoteUrl: 'https://git.example.cz/dxheroes/user/repo',
            baseUrl: 'https://git.example.cz',
            host: 'git.example.cz',
            protocol: 'https',
        };
        service = new GitLabService_1.GitLabService(ArgumentsProviderFactory_1.argumentsProviderFactory({ uri: 'https://git.example.cz/dxheroes/user/repo' }), repositoryConfig);
        nock_1.default('https://git.example.cz').get('/api/v4/version').reply(401);
        try {
            await service.checkVersion();
        }
        catch (error) {
            expect(error.message).toEqual('Request failed with status code 401');
        }
    });
    it('Throws error if listPullRequestReviews is called as the function is not implemented yet', async () => {
        try {
            await service.listPullRequestReviews('gitlab-org', 'gitlab', 1);
        }
        catch (error) {
            expect(error.message).toEqual('Method not implemented yet.');
        }
    });
    it('Throws error if listPullRequestFiles is called as the function is not implemented yet', async () => {
        try {
            await service.listPullRequestFiles('gitlab-org', 'gitlab', 1);
        }
        catch (error) {
            expect(error.message).toEqual('Method not implemented yet.');
        }
    });
    it('returns contributors in own interface', async () => {
        gitLabNock.listRepoCommitsResponse([commitsFactory_1.gitLabCommitsResponseFactory({ committer_email: 'email@email.com' })], false);
        gitLabNock.searchUser('email@email.com');
        const response = await service.listContributors('gitlab-org', 'gitlab');
        expect(response).toMatchObject(getContributorsServiceResponse_mock_1.getContributorsServiceResponse);
    });
    it('Throws error if getContributorsStats is called as the function is not implemented yet', async () => {
        try {
            await service.listContributorsStats('gitlab-org', 'gitlab');
        }
        catch (error) {
            expect(error.message).toEqual('Method not implemented yet.');
        }
    });
    it('Throws error if getRepoContent is called as the function is not implemented yet', async () => {
        try {
            await service.getRepoContent('gitlab-org', 'gitlab', 'path');
        }
        catch (error) {
            expect(error.message).toEqual('Method not implemented yet.');
        }
    });
    it('Throws error if getPullsDiffStat is called as the function is not implemented yet', async () => {
        try {
            await service.getPullsDiffStat('gitlab-org', 'gitlab', 1);
        }
        catch (error) {
            expect(error.message).toEqual('Method not implemented yet for GitLab.');
        }
    });
});
//# sourceMappingURL=GitLabService.spec.js.map