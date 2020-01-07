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

describe('Bitbucket Service', () => {
  let service: BitbucketService;
  let bitbucketNock: BitbucketNock;

  beforeEach(async () => {
    service = new BitbucketService({ uri: '.' });
    nock.cleanAll();
    bitbucketNock = new BitbucketNock('pypy', 'pypy');
  });

  it('returns open pull requests in own interface', async () => {
    bitbucketNock.getOwnerId();
    bitbucketNock.getApiResponse({ resource: 'pullrequests' });

    const response = await service.getPullRequests('pypy', 'pypy');
    const getOpenPullRequestsResponse = bitbucketNock.mockBitbucketIssuesOrPullRequestsResponse({ states: BitbucketPullRequestState.open });
    expect(response).toMatchObject(getOpenPullRequestsResponse);
  });

  it('returns one open pull requests in own interface', async () => {
    bitbucketNock.getOwnerId();
    bitbucketNock.getApiResponse({ resource: 'pullrequests', state: BitbucketPullRequestState.open, pagination: { page: 1, perPage: 1 } });

    const response = await service.getPullRequests('pypy', 'pypy', { pagination: { page: 1, perPage: 1 } });
    const getOpenPullRequestsResponse = bitbucketNock.mockBitbucketIssuesOrPullRequestsResponse({ states: BitbucketPullRequestState.open });
    expect(response).toMatchObject(getOpenPullRequestsResponse);
  });

  it('returns open pull requests with diffStat in own interface', async () => {
    bitbucketNock.getOwnerId();
    bitbucketNock.getApiResponse({ resource: 'pullrequests' });
    bitbucketNock.getAdditionsAndDeletions('1');

    const response = await service.getPullRequests('pypy', 'pypy', { withDiffStat: true });
    const getOpenPullRequestsResponse = bitbucketNock.mockBitbucketIssuesOrPullRequestsResponse({
      states: BitbucketPullRequestState.open,
      withDiffStat: true,
    });

    expect(response).toMatchObject(getOpenPullRequestsResponse);
  });

  it('returns all pull requests in own interface', async () => {
    const state = <BitbucketPullRequestState>VCSServicesUtils.getPRState(PullRequestState.all, VCSService.bitbucket);
    bitbucketNock.getOwnerId();
    bitbucketNock.getApiResponse({ resource: 'pullrequests', state: state });

    const response = await service.getPullRequests('pypy', 'pypy', { filter: { state: PullRequestState.all } });
    const allPullrequestsResponse = bitbucketNock.mockBitbucketIssuesOrPullRequestsResponse({ states: state });

    expect(response).toMatchObject(allPullrequestsResponse);
  });

  it('returns specific pull request in own interface', async () => {
    bitbucketNock.getOwnerId();
    bitbucketNock.getApiResponse({ resource: 'pullrequests', id: 1 });

    const response = await service.getPullRequest('pypy', 'pypy', 1);
    expect(response).toMatchObject(getPullRequestResponse);
  });

  it('returns pullrequest commits in own interface', async () => {
    bitbucketNock.getApiResponse({ resource: 'pullrequests', id: 622, value: 'commits' });

    const response = await service.getPullCommits('pypy', 'pypy', 622);
    expect(response).toMatchObject(getPullCommits);
  });

  it('returns issues in own interface', async () => {
    bitbucketNock.getApiResponse({ resource: 'issues' });

    const response = await service.getIssues('pypy', 'pypy');
    expect(response).toMatchObject(getIssuesResponse);
  });

  it('returns issue in own interface', async () => {
    bitbucketNock.getApiResponse({ resource: 'issues', id: 3086 });

    const response = await service.getIssue('pypy', 'pypy', 3086);
    expect(response).toMatchObject(getIssueResponse);
  });

  it('returns issue comments in own interface', async () => {
    bitbucketNock.getApiResponse({ resource: 'issues', id: 3086, value: 'comments' });

    const response = await service.getIssueComments('pypy', 'pypy', 3086);
    expect(response).toMatchObject(getIssueCommentsResponse);
  });

  it('returns merged pull requests in own interface', async () => {
    const state: ListGetterOptions<{ state?: PullRequestState }> = {
      filter: {
        state: PullRequestState.closed,
      },
    };

    bitbucketNock.getOwnerId();
    bitbucketNock.getApiResponse({ resource: 'pullrequests', state: BitbucketPullRequestState.closed });

    const response = await service.getPullRequests('pypy', 'pypy', state);
    const getMergedPullRequestsResponse = bitbucketNock.mockBitbucketIssuesOrPullRequestsResponse({ states: BitbucketPullRequestState.closed });

    expect(response).toMatchObject(getMergedPullRequestsResponse);
  });

  it('returns repo commits in own interface', async () => {
    bitbucketNock.getApiResponse({ resource: 'commits' });

    const response = await service.getRepoCommits('pypy', 'pypy');
    expect(response).toMatchObject(getRepoCommits);
  });

  it('returns one commit in own interface', async () => {
    bitbucketNock.getApiResponse({ resource: 'commit', id: '961b3a27' });

    const response = await service.getCommit('pypy', 'pypy', '961b3a27');
    expect(response).toMatchObject(getRepoCommit);
  });

  it('returns pulls diff stat in own interface', async () => {
    bitbucketNock.getAdditionsAndDeletions('622');

    const response = await service.getPullsDiffStat('pypy', 'pypy', '622');
    expect(response).toMatchObject({ additions: 2, deletions: 1, changes: 3 });
  });
});
