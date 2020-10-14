import { PullRequestState, IssueState } from '../../inspectors';
import {
  getIssueResponse,
  getPullCommitsResponse,
  getPullRequestResponse,
  getRepoCommit,
  getRepoCommits,
} from '../../services/git/__MOCKS__/bitbucketServiceMockFolder';
import { argumentsProviderFactory } from '../../test/factories/ArgumentsProviderFactory';
import { bitbucketIssueCommentResponseFactory } from '../../test/factories/responses/bitbucket/issueCommentResponseFactory';
import { bitbucketIssueResponseFactory } from '../../test/factories/responses/bitbucket/issueResponseFactory';
import { bitbucketPullRequestResponseFactory } from '../../test/factories/responses/bitbucket/prResponseFactory';
import { bitbucketPullCommitsResponseFactory } from '../../test/factories/responses/bitbucket/pullCommitsFactory';
import { bitbucketRepoCommitsResponseFactory } from '../../test/factories/responses/bitbucket/repoCommitsResponseFactory';
import { BitbucketNock } from '../../test/helpers/bitbucketNock';
import { VCSServicesUtils } from '../git/VCSServicesUtils';
import { BitbucketService } from './BitbucketService';
import { BitbucketIssueState, BitbucketPullRequestState } from './IBitbucketService';
import { getContributorsServiceResponse } from '../git/__MOCKS__/bitbucketServiceMockFolder/getContributorsServiceResponse.mock';

describe('Bitbucket Service', () => {
  let service: BitbucketService;
  let bitbucketNock: BitbucketNock;

  const repositoryConfig = {
    remoteUrl: 'https://bitbucket.org/pypy/pypy',
    baseUrl: 'https://bitbucket.org',
    host: 'bitbucket.org',
    protocol: 'https',
  };

  beforeEach(async () => {
    service = new BitbucketService(argumentsProviderFactory({ uri: '.' }), repositoryConfig);

    bitbucketNock = new BitbucketNock('pypy', 'pypy');
  });

  it('returns open pull requests in own interface', async () => {
    const mockPr = bitbucketPullRequestResponseFactory({ state: BitbucketPullRequestState.open });
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
    const mockPr = bitbucketPullRequestResponseFactory({ state: BitbucketPullRequestState.open });
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
    const mockPr = bitbucketPullRequestResponseFactory({ state: BitbucketPullRequestState.open });
    bitbucketNock.getOwnerId();
    bitbucketNock.listPullRequestsResponse([mockPr]);
    bitbucketNock.getPRsAdditionsAndDeletions(mockPr.id!);

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
    const allStates = <BitbucketPullRequestState[]>VCSServicesUtils.getBitbucketPRState(PullRequestState.all);

    const prs = allStates.map((state) => bitbucketPullRequestResponseFactory({ state }));

    bitbucketNock.getOwnerId();
    bitbucketNock.listPullRequestsResponse(prs, { filter: { state: allStates } });

    const response = await service.listPullRequests('pypy', 'pypy', { filter: { state: PullRequestState.all } });

    expect(response.items).toHaveLength(prs.length);

    expect(response.hasNextPage).toEqual(true);
    expect(response.hasPreviousPage).toEqual(true);
    expect(response.page).toEqual(1);
    expect(response.perPage).toEqual(3);
    expect(response.totalCount).toEqual(3);
  });

  it('returns specific pull request in own interface', async () => {
    const mockPr = bitbucketPullRequestResponseFactory();
    bitbucketNock.getOwnerId();
    bitbucketNock.getPullRequestResponse(mockPr);

    const response = await service.getPullRequest('pypy', 'pypy', mockPr.id!);
    expect(response).toMatchObject(getPullRequestResponse());
  });

  it('returns merged pull requests in own interface', async () => {
    const mockPr = bitbucketPullRequestResponseFactory({ state: BitbucketPullRequestState.closed });
    bitbucketNock.getOwnerId();
    bitbucketNock.listPullRequestsResponse([mockPr], { filter: { state: BitbucketPullRequestState.closed } });

    const response = await service.listPullRequests('pypy', 'pypy', { filter: { state: PullRequestState.closed } });

    expect(response.items).toHaveLength(1);
    expect(response.items[0].id).toEqual(mockPr.id);
    expect(response.items[0].state).toEqual(BitbucketPullRequestState.closed);
  });

  it('returns pullrequest commits in own interface', async () => {
    const mockPullCommits = bitbucketPullCommitsResponseFactory();
    bitbucketNock.listPullCommits([mockPullCommits], 622);

    const response = await service.listPullCommits('pypy', 'pypy', 622);
    expect(response).toMatchObject(getPullCommitsResponse());
  });

  it('returns open issues in own interface', async () => {
    const mockIssue = bitbucketIssueResponseFactory({ state: BitbucketIssueState.new });
    bitbucketNock.listIssuesResponse([mockIssue], { filter: { state: BitbucketIssueState.new } });

    const response = await service.listIssues('pypy', 'pypy', { filter: { state: IssueState.open } });
    expect(response.items).toHaveLength(1);
    expect(response.items[0].id).toEqual(mockIssue.id);

    expect(response.hasNextPage).toEqual(true);
    expect(response.hasPreviousPage).toEqual(true);
    expect(response.page).toEqual(1);
    expect(response.perPage).toEqual(1);
    expect(response.totalCount).toEqual(1);
  });

  it('returns all issues in own interface', async () => {
    const mockNewIssue = bitbucketIssueResponseFactory({ state: BitbucketIssueState.new });
    const mockResolvedIssue = bitbucketIssueResponseFactory({ state: BitbucketIssueState.resolved });
    const mockClosedIssue = bitbucketIssueResponseFactory({ state: BitbucketIssueState.closed });

    bitbucketNock.listIssuesResponse([mockNewIssue, mockResolvedIssue, mockClosedIssue], {
      filter: { state: [BitbucketIssueState.new, BitbucketIssueState.resolved, BitbucketIssueState.closed] },
    });

    const response = await service.listIssues('pypy', 'pypy', { filter: { state: IssueState.all } });
    expect(response.items).toHaveLength(3);

    expect(response.hasNextPage).toEqual(true);
    expect(response.hasPreviousPage).toEqual(true);
    expect(response.page).toEqual(1);
    expect(response.perPage).toEqual(3);
    expect(response.totalCount).toEqual(3);
  });

  it('throws an error if issue tracker is disabled', async () => {
    bitbucketNock.listIssuesErrorResponse();
    await expect(() => service.listIssues('pypy', 'pypy', { filter: { state: IssueState.all } })).rejects.toMatchObject({
      message: 'Request failed with status code 404',
    });
  });

  it('returns issue in own interface', async () => {
    const mockIssue = bitbucketIssueResponseFactory({ state: BitbucketIssueState.new });
    bitbucketNock.getIssueResponse(mockIssue);

    const response = await service.getIssue('pypy', 'pypy', 3086);
    expect(response).toMatchObject(getIssueResponse());
  });

  it('returns issue comments in own interface', async () => {
    const mockIssueComment = bitbucketIssueCommentResponseFactory();

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
      values: [bitbucketRepoCommitsResponseFactory()],
    });

    const response = await service.listRepoCommits('pypy', 'pypy');
    expect(response).toMatchObject(getRepoCommits());
  });

  it('returns one commit in own interface', async () => {
    const mockRepoCommit = bitbucketRepoCommitsResponseFactory();
    bitbucketNock.getCommitResponse(mockRepoCommit, '961b3a27');

    const response = await service.getCommit('pypy', 'pypy', '961b3a27');
    expect(response).toMatchObject(getRepoCommit());
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
    } catch (error) {
      expect(error.message).toEqual('Method not implemented yet.');
    }
  });

  it('Throws error if listPullRequestFiles is called as the function is not implemented yet', async () => {
    try {
      await service.listPullRequestFiles('pypy', 'pypy', 1);
    } catch (error) {
      expect(error.message).toEqual('Method not implemented yet.');
    }
  });

  it('returns contributors in own interface', async () => {
    bitbucketNock.listCommitsResponse({ values: [bitbucketRepoCommitsResponseFactory()] });

    const response = await service.listContributors('pypy', 'pypy');
    expect(response).toMatchObject(getContributorsServiceResponse);
  });

  it('Throws error if getContributorsStats is called as the function is not implemented yet', async () => {
    try {
      await service.listContributorsStats('pypy', 'pypy');
    } catch (error) {
      expect(error.message).toEqual('Method not implemented yet.');
    }
  });

  it('Throws error if getRepoContent is called as the function is not implemented yet', async () => {
    try {
      await service.getRepoContent('pypy', 'pypy', 'path');
    } catch (error) {
      expect(error.message).toEqual('Method not implemented yet.');
    }
  });
});
