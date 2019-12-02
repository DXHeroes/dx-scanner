import nock from 'nock';
import { BitbucketNock } from '../../../test/helpers/bitbucketNock';
import { ListGetterOptions } from '../../inspectors/common/ListGetterOptions';
import { PullRequestState } from '../../inspectors/ICollaborationInspector';
import { getIssueCommentsResponse } from '../git/__MOCKS__/bitbucketServiceMockFolder/getIssueCommentsResponse';
import { getIssueResponse } from '../git/__MOCKS__/bitbucketServiceMockFolder/getIssueResponse';
import { getIssuesResponse } from '../git/__MOCKS__/bitbucketServiceMockFolder/getIssuesResponse';
import { getPullCommits } from '../git/__MOCKS__/bitbucketServiceMockFolder/getPullCommits';
import { getPullRequestResponse } from '../git/__MOCKS__/bitbucketServiceMockFolder/getPullRequestResponse';
import { getPullRequestsResponse } from '../git/__MOCKS__/bitbucketServiceMockFolder/getPullRequestsResponse';
import { BitbucketService } from './BitbucketService';
import { getRepoCommits } from '../git/__MOCKS__/bitbucketServiceMockFolder/getRepoCommits';
import { getRepoCommit } from '../git/__MOCKS__/bitbucketServiceMockFolder/getRepoCommit';

describe('Bitbucket Service', () => {
  let service: BitbucketService;
  let bitbucketNock: BitbucketNock;

  beforeEach(async () => {
    service = new BitbucketService({ uri: '.' });
    nock.cleanAll();
    bitbucketNock = new BitbucketNock('pypy', 'pypy');
  });

  it('returns pull requests in own interface', async () => {
    nock(bitbucketNock.url)
      .get('/users/pypy')
      .reply(200);
    bitbucketNock.getApiResponse('pullrequests');

    const response = await service.getPullRequests('pypy', 'pypy');
    expect(response).toMatchObject(getPullRequestsResponse);
  });

  it('returns pull request in own interface', async () => {
    bitbucketNock.getApiResponse('pullrequests', 1);

    const response = await service.getPullRequest('pypy', 'pypy', 1);
    expect(response).toMatchObject(getPullRequestResponse);
  });

  it('returns pullrequest commits in own interface', async () => {
    bitbucketNock.getApiResponse('pullrequests', 622, 'commits');

    const response = await service.getPullCommits('pypy', 'pypy', 622);
    expect(response).toMatchObject(getPullCommits);
  });

  it('returns issues in own interface', async () => {
    bitbucketNock.getApiResponse('issues');

    const response = await service.getIssues('pypy', 'pypy');
    expect(response).toMatchObject(getIssuesResponse);
  });

  it('returns issue in own interface', async () => {
    bitbucketNock.getApiResponse('issues', 3086);

    const response = await service.getIssue('pypy', 'pypy', 3086);
    expect(response).toMatchObject(getIssueResponse);
  });

  it('returns issue comments in own interface', async () => {
    bitbucketNock.getApiResponse('issues', 3086, 'comments');

    const response = await service.getIssueComments('pypy', 'pypy', 3086);
    expect(response).toMatchObject(getIssueCommentsResponse);
  });

  it('returns declined pull requests in own interface', async () => {
    const state: ListGetterOptions<{ state?: PullRequestState }> = {
      filter: {
        state: PullRequestState.closed,
      },
    };

    nock(bitbucketNock.url)
      .get('/users/pypy')
      .reply(200);
    bitbucketNock.getApiResponse('pullrequests', undefined, undefined, 'MERGED');
    const response = await service.getPullRequests('pypy', 'pypy', state);
    expect(response).toMatchObject(getPullRequestsResponse);
  });

  it('returns repo commits in own interface', async () => {
    bitbucketNock.getApiResponse('commits');

    const response = await service.getRepoCommits('pypy', 'pypy');
    expect(response).toMatchObject(getRepoCommits);
  });

  it('return on commit in own interface', async () => {
    bitbucketNock.getApiResponse('commit', '961b3a27');

    const response = await service.getCommit('pypy', 'pypy', '961b3a27');
    expect(response).toMatchObject(getRepoCommit);
  });
});
