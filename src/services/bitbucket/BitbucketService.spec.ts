import nock from 'nock';
import { ListGetterOptions, PullRequestState } from '../../inspectors';
import {
  getIssueCommentsResponse,
  getIssueResponse,
  getIssuesResponse,
  getPullCommits,
  getPullRequestResponse,
  getRepoCommit,
  getRepoCommits,
} from '../../services/git/__MOCKS__/bitbucketServiceMockFolder';
import { BitbucketNock } from '../../test/helpers/bitbucketNock';
import { BitbucketPullRequestState, VCSService } from '../git/IVCSService';
import { VCSServicesUtils } from '../git/VCSServicesUtils';
import { BitbucketService } from './BitbucketService';
import { bitbucketPullRequestResponseFactory } from '../../test/factories/responses/bitbucket/prResponseFactory';

describe('Bitbucket Service', () => {
  let service: BitbucketService;
  let bitbucketNock: BitbucketNock;

  beforeEach(async () => {
    service = new BitbucketService({ uri: '.' });
    nock.cleanAll();
    bitbucketNock = new BitbucketNock('pypy', 'pypy');
  });

  it('returns open pull requests in own interface', async () => {
    const mockPr = bitbucketPullRequestResponseFactory({ state: BitbucketPullRequestState.open });
    bitbucketNock.getOwnerId();
    bitbucketNock.listPullRequestsResponse([mockPr]);

    const response = await service.getPullRequests('pypy', 'pypy');

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

    const response = await service.getPullRequests('pypy', 'pypy', { pagination: { page: 1, perPage: 1 } });

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
    bitbucketNock.getAdditionsAndDeletions(mockPr.id!);

    const response = await service.getPullRequests('pypy', 'pypy', { withDiffStat: true });

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
    const allStates = <BitbucketPullRequestState[]>VCSServicesUtils.getPRState(PullRequestState.all, VCSService.bitbucket);

    const prs = allStates.map((state) => bitbucketPullRequestResponseFactory({ state }));

    bitbucketNock.getOwnerId();
    bitbucketNock.listPullRequestsResponse(prs, { filter: { state: allStates } });

    const response = await service.getPullRequests('pypy', 'pypy', { filter: { state: PullRequestState.all } });

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

    const response = await service.getPullRequests('pypy', 'pypy', { filter: { state: PullRequestState.closed } });

    expect(response.items).toHaveLength(1);
    expect(response.items[0].id).toEqual(mockPr.id);
    expect(response.items[0].state).toEqual(BitbucketPullRequestState.closed);
  });

  // TODO: refactor
  it('returns pullrequest commits in own interface', async () => {
    bitbucketNock.getApiResponse({ resource: 'pullrequests', id: 622, value: 'commits' });

    const response = await service.getPullCommits('pypy', 'pypy', 622);
    expect(response).toMatchObject(getPullCommits);
  });

  // TODO: refactor
  it('returns issues in own interface', async () => {
    bitbucketNock.getApiResponse({ resource: 'issues' });

    const response = await service.getIssues('pypy', 'pypy');
    expect(response).toMatchObject(getIssuesResponse);
  });

  // TODO: refactor
  it('returns issue in own interface', async () => {
    bitbucketNock.getApiResponse({ resource: 'issues', id: 3086 });

    const response = await service.getIssue('pypy', 'pypy', 3086);
    expect(response).toMatchObject(getIssueResponse);
  });

  // TODO: refactor
  it('returns issue comments in own interface', async () => {
    bitbucketNock.getApiResponse({ resource: 'issues', id: 3086, value: 'comments' });

    const response = await service.getIssueComments('pypy', 'pypy', 3086);
    expect(response).toMatchObject(getIssueCommentsResponse);
  });

  // TODO: refactor
  it('returns repo commits in own interface', async () => {
    bitbucketNock.getApiResponse({ resource: 'commits' });

    const response = await service.getRepoCommits('pypy', 'pypy');
    expect(response).toMatchObject(getRepoCommits);
  });

  // TODO: refactor
  it('returns one commit in own interface', async () => {
    bitbucketNock.getApiResponse({ resource: 'commit', id: '961b3a27' });

    const response = await service.getCommit('pypy', 'pypy', '961b3a27');
    expect(response).toMatchObject(getRepoCommit);
  });

  // TODO: refactor
  it('returns pulls diff stat in own interface', async () => {
    bitbucketNock.getAdditionsAndDeletions(622);

    const response = await service.getPullsDiffStat('pypy', 'pypy', '622');
    expect(response).toMatchObject({ additions: 2, deletions: 1, changes: 3 });
  });
});
