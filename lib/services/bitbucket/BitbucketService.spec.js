"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inspectors_1 = require("../../inspectors");
const bitbucketServiceMockFolder_1 = require("../../services/git/__MOCKS__/bitbucketServiceMockFolder");
const ArgumentsProviderFactory_1 = require("../../test/factories/ArgumentsProviderFactory");
const issueCommentResponseFactory_1 = require("../../test/factories/responses/bitbucket/issueCommentResponseFactory");
const issueResponseFactory_1 = require("../../test/factories/responses/bitbucket/issueResponseFactory");
const prResponseFactory_1 = require("../../test/factories/responses/bitbucket/prResponseFactory");
const pullCommitsFactory_1 = require("../../test/factories/responses/bitbucket/pullCommitsFactory");
const repoCommitsResponseFactory_1 = require("../../test/factories/responses/bitbucket/repoCommitsResponseFactory");
const bitbucketNock_1 = require("../../test/helpers/bitbucketNock");
const VCSServicesUtils_1 = require("../git/VCSServicesUtils");
const BitbucketService_1 = require("./BitbucketService");
const IBitbucketService_1 = require("./IBitbucketService");
const getContributorsServiceResponse_mock_1 = require("../git/__MOCKS__/bitbucketServiceMockFolder/getContributorsServiceResponse.mock");
describe('Bitbucket Service', () => {
    let service;
    let bitbucketNock;
    const repositoryConfig = {
        remoteUrl: 'https://bitbucket.org/pypy/pypy',
        baseUrl: 'https://bitbucket.org',
        host: 'bitbucket.org',
        protocol: 'https',
    };
    beforeEach(async () => {
        service = new BitbucketService_1.BitbucketService(ArgumentsProviderFactory_1.argumentsProviderFactory({ uri: '.' }), repositoryConfig);
        bitbucketNock = new bitbucketNock_1.BitbucketNock('pypy', 'pypy');
    });
    it('returns open pull requests in own interface', async () => {
        const mockPr = prResponseFactory_1.bitbucketPullRequestResponseFactory({ state: IBitbucketService_1.BitbucketPullRequestState.open });
        bitbucketNock.getOwnerId();
        bitbucketNock.listPullRequestsResponse([mockPr]);
        const response = await service.listPullRequests('pypy', 'pypy');
        expect(response.items).toHaveLength(1);
        expect(response.items[0].id).toEqual(mockPr.id);
        expect(response.hasNextPage).toEqual(true);
        expect(response.hasPreviousPage).toEqual(true);
        expect(response.page).toEqual(1);
        expect(response.perPage).toEqual(1);
        expect(response.totalCount).toEqual(1);
    });
    it('returns one open pull requests in own interface', async () => {
        const mockPr = prResponseFactory_1.bitbucketPullRequestResponseFactory({ state: IBitbucketService_1.BitbucketPullRequestState.open });
        bitbucketNock.getOwnerId();
        bitbucketNock.listPullRequestsResponse([mockPr], { pagination: { page: 1, perPage: 1 } });
        const response = await service.listPullRequests('pypy', 'pypy', { pagination: { page: 1, perPage: 1 } });
        expect(response.items).toHaveLength(1);
        expect(response.items[0].id).toEqual(mockPr.id);
        expect(response.hasNextPage).toEqual(true);
        expect(response.hasPreviousPage).toEqual(true);
        expect(response.page).toEqual(1);
        expect(response.perPage).toEqual(1);
        expect(response.totalCount).toEqual(1);
    });
    it('returns open pull requests with diffStat in own interface', async () => {
        const mockPr = prResponseFactory_1.bitbucketPullRequestResponseFactory({ state: IBitbucketService_1.BitbucketPullRequestState.open });
        bitbucketNock.getOwnerId();
        bitbucketNock.listPullRequestsResponse([mockPr]);
        bitbucketNock.getPRsAdditionsAndDeletions(mockPr.id);
        const response = await service.listPullRequests('pypy', 'pypy', { withDiffStat: true });
        expect(response.items).toHaveLength(1);
        expect(response.items[0].id).toEqual(mockPr.id);
        expect(response.items[0].lines).toEqual({ additions: 2, changes: 3, deletions: 1 });
        expect(response.hasNextPage).toEqual(true);
        expect(response.hasPreviousPage).toEqual(true);
        expect(response.page).toEqual(1);
        expect(response.perPage).toEqual(1);
        expect(response.totalCount).toEqual(1);
    });
    it('returns all pull requests in own interface', async () => {
        const allStates = VCSServicesUtils_1.VCSServicesUtils.getBitbucketPRState(inspectors_1.PullRequestState.all);
        const prs = allStates.map((state) => prResponseFactory_1.bitbucketPullRequestResponseFactory({ state }));
        bitbucketNock.getOwnerId();
        bitbucketNock.listPullRequestsResponse(prs, { filter: { state: allStates } });
        const response = await service.listPullRequests('pypy', 'pypy', { filter: { state: inspectors_1.PullRequestState.all } });
        expect(response.items).toHaveLength(prs.length);
        expect(response.hasNextPage).toEqual(true);
        expect(response.hasPreviousPage).toEqual(true);
        expect(response.page).toEqual(1);
        expect(response.perPage).toEqual(3);
        expect(response.totalCount).toEqual(3);
    });
    it('returns specific pull request in own interface', async () => {
        const mockPr = prResponseFactory_1.bitbucketPullRequestResponseFactory();
        bitbucketNock.getOwnerId();
        bitbucketNock.getPullRequestResponse(mockPr);
        const response = await service.getPullRequest('pypy', 'pypy', mockPr.id);
        expect(response).toMatchObject(bitbucketServiceMockFolder_1.getPullRequestResponse());
    });
    it('returns merged pull requests in own interface', async () => {
        const mockPr = prResponseFactory_1.bitbucketPullRequestResponseFactory({ state: IBitbucketService_1.BitbucketPullRequestState.closed });
        bitbucketNock.getOwnerId();
        bitbucketNock.listPullRequestsResponse([mockPr], { filter: { state: IBitbucketService_1.BitbucketPullRequestState.closed } });
        const response = await service.listPullRequests('pypy', 'pypy', { filter: { state: inspectors_1.PullRequestState.closed } });
        expect(response.items).toHaveLength(1);
        expect(response.items[0].id).toEqual(mockPr.id);
        expect(response.items[0].state).toEqual(IBitbucketService_1.BitbucketPullRequestState.closed);
    });
    it('returns pullrequest commits in own interface', async () => {
        const mockPullCommits = pullCommitsFactory_1.bitbucketPullCommitsResponseFactory();
        bitbucketNock.listPullCommits([mockPullCommits], 622);
        const response = await service.listPullCommits('pypy', 'pypy', 622);
        expect(response).toMatchObject(bitbucketServiceMockFolder_1.getPullCommitsResponse());
    });
    it('returns open issues in own interface', async () => {
        const mockIssue = issueResponseFactory_1.bitbucketIssueResponseFactory({ state: IBitbucketService_1.BitbucketIssueState.new });
        bitbucketNock.listIssuesResponse([mockIssue], { filter: { state: IBitbucketService_1.BitbucketIssueState.new } });
        const response = await service.listIssues('pypy', 'pypy', { filter: { state: inspectors_1.IssueState.open } });
        expect(response.items).toHaveLength(1);
        expect(response.items[0].id).toEqual(mockIssue.id);
        expect(response.hasNextPage).toEqual(true);
        expect(response.hasPreviousPage).toEqual(true);
        expect(response.page).toEqual(1);
        expect(response.perPage).toEqual(1);
        expect(response.totalCount).toEqual(1);
    });
    it('returns all issues in own interface', async () => {
        const mockNewIssue = issueResponseFactory_1.bitbucketIssueResponseFactory({ state: IBitbucketService_1.BitbucketIssueState.new });
        const mockResolvedIssue = issueResponseFactory_1.bitbucketIssueResponseFactory({ state: IBitbucketService_1.BitbucketIssueState.resolved });
        const mockClosedIssue = issueResponseFactory_1.bitbucketIssueResponseFactory({ state: IBitbucketService_1.BitbucketIssueState.closed });
        bitbucketNock.listIssuesResponse([mockNewIssue, mockResolvedIssue, mockClosedIssue], {
            filter: { state: [IBitbucketService_1.BitbucketIssueState.new, IBitbucketService_1.BitbucketIssueState.resolved, IBitbucketService_1.BitbucketIssueState.closed] },
        });
        const response = await service.listIssues('pypy', 'pypy', { filter: { state: inspectors_1.IssueState.all } });
        expect(response.items).toHaveLength(3);
        expect(response.hasNextPage).toEqual(true);
        expect(response.hasPreviousPage).toEqual(true);
        expect(response.page).toEqual(1);
        expect(response.perPage).toEqual(3);
        expect(response.totalCount).toEqual(3);
    });
    it('returns empty response if issue tracker is disabled', async () => {
        bitbucketNock.listIssuesErrorResponse();
        const response = await service.listIssues('pypy', 'pypy', { filter: { state: inspectors_1.IssueState.all } });
        expect(response).toEqual({
            items: [],
            hasNextPage: false,
            hasPreviousPage: false,
            page: 1,
            perPage: 0,
            totalCount: 0,
        });
    });
    it('returns issue in own interface', async () => {
        const mockIssue = issueResponseFactory_1.bitbucketIssueResponseFactory({ state: IBitbucketService_1.BitbucketIssueState.new });
        bitbucketNock.getIssueResponse(mockIssue);
        const response = await service.getIssue('pypy', 'pypy', 3086);
        expect(response).toMatchObject(bitbucketServiceMockFolder_1.getIssueResponse());
    });
    it('returns issue comments in own interface', async () => {
        const mockIssueComment = issueCommentResponseFactory_1.bitbucketIssueCommentResponseFactory();
        bitbucketNock.listIssueCommentsResponse([mockIssueComment], 3086);
        const response = await service.listIssueComments('pypy', 'pypy', 3086);
        expect(response.items).toHaveLength(1);
        expect(response.items[0].id).toEqual(mockIssueComment.id);
        expect(response.hasNextPage).toEqual(true);
        expect(response.hasPreviousPage).toEqual(true);
        expect(response.page).toEqual(1);
        expect(response.perPage).toEqual(1);
        expect(response.totalCount).toEqual(1);
    });
    it('returns repo commits in own interface', async () => {
        bitbucketNock.listCommitsResponse({
            values: [repoCommitsResponseFactory_1.bitbucketRepoCommitsResponseFactory()],
        });
        const response = await service.listRepoCommits('pypy', 'pypy');
        expect(response).toMatchObject(bitbucketServiceMockFolder_1.getRepoCommits());
    });
    it('returns one commit in own interface', async () => {
        const mockRepoCommit = repoCommitsResponseFactory_1.bitbucketRepoCommitsResponseFactory();
        bitbucketNock.getCommitResponse(mockRepoCommit, '961b3a27');
        const response = await service.getCommit('pypy', 'pypy', '961b3a27');
        expect(response).toMatchObject(bitbucketServiceMockFolder_1.getRepoCommit());
    });
    it('returns pulls diff stat in own interface', async () => {
        bitbucketNock.getPRsAdditionsAndDeletions(622);
        const response = await service.getPullsDiffStat('pypy', 'pypy', 622);
        expect(response).toMatchObject({ additions: 2, deletions: 1, changes: 3 });
    });
    it('The response id defined when getRepo is called', async () => {
        bitbucketNock.getRepoResponse();
        const response = await service.getRepo('pypy', 'pypy');
        expect(response).toBeDefined();
    });
    it('Throws error if listPullRequestReviews is called as the function is not implemented yet', async () => {
        try {
            await service.listPullRequestReviews('pypy', 'pypy', 1);
        }
        catch (error) {
            expect(error.message).toEqual('Method not implemented yet.');
        }
    });
    it('Throws error if listPullRequestFiles is called as the function is not implemented yet', async () => {
        try {
            await service.listPullRequestFiles('pypy', 'pypy', 1);
        }
        catch (error) {
            expect(error.message).toEqual('Method not implemented yet.');
        }
    });
    it('returns contributors in own interface', async () => {
        bitbucketNock.listCommitsResponse({ values: [repoCommitsResponseFactory_1.bitbucketRepoCommitsResponseFactory()] });
        const response = await service.listContributors('pypy', 'pypy');
        expect(response).toMatchObject(getContributorsServiceResponse_mock_1.getContributorsServiceResponse);
    });
    it('Throws error if getContributorsStats is called as the function is not implemented yet', async () => {
        try {
            await service.listContributorsStats('pypy', 'pypy');
        }
        catch (error) {
            expect(error.message).toEqual('Method not implemented yet.');
        }
    });
    it('Throws error if getRepoContent is called as the function is not implemented yet', async () => {
        try {
            await service.getRepoContent('pypy', 'pypy', 'path');
        }
        catch (error) {
            expect(error.message).toEqual('Method not implemented yet.');
        }
    });
});
//# sourceMappingURL=BitbucketService.spec.js.map