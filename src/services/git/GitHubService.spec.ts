/* eslint-disable @typescript-eslint/camelcase */
import { GitHubService } from './GitHubService';
import { GitHubClient } from './GitHubClient';
import { getPullsServiceResponse } from './__MOCKS__/gitHubServiceMockFolder/getPullsServiceResponse.mock';
import { getPullsReviewsServiceResponse } from './__MOCKS__/gitHubServiceMockFolder/getPullsReviewsServiceResponse.mock';
import { getCommitServiceResponse } from './__MOCKS__/gitHubServiceMockFolder/getCommitServiceResponse.mock';
import { getContributorsServiceResponse } from './__MOCKS__/gitHubServiceMockFolder/getContributorsServiceResponse.mock';
import { getContributorsStatsServiceResponse } from './__MOCKS__/gitHubServiceMockFolder/getContributorsStatsServiceResponse.mock';
import { getRepoContentServiceResponse } from './__MOCKS__/gitHubServiceMockFolder/getRepoContentServiceResponse.mock';
import { getIssuesServiceResponse } from './__MOCKS__/gitHubServiceMockFolder/getIssuesServiceResponse.mock';
import { getPullRequestsReviewsResponse } from './__MOCKS__/gitHubClientMockFolder/getPullRequestsReviewsResponse.mock';
import { getCommitResponse } from './__MOCKS__/gitHubClientMockFolder/getCommitResponse.mock';
import { getContributorsStatsResponse } from './__MOCKS__/gitHubClientMockFolder/getContributorsStatsResponse.mock';
import { getIssuesResponse } from './__MOCKS__/gitHubClientMockFolder/getIssuesResponse.mock';
import { getIssueCommentsResponse } from './__MOCKS__/gitHubClientMockFolder/getIssueCommentsResponse.mock';
import { getIssueCommentsServiceResponse } from './__MOCKS__/gitHubServiceMockFolder/getIssueCommentsServiceResponse.mock';
import nock from 'nock';
import { getPullsFilesResponse } from './__MOCKS__/gitHubClientMockFolder/getPullsFiles.mock';
import { getPullsFilesServiceResponse } from './__MOCKS__/gitHubServiceMockFolder/getPullFilesServiceResponse.mock';
import { getPullCommitsResponse } from './__MOCKS__/gitHubClientMockFolder/getPullsCommitsResponse.mock';
import { getPullCommitsServiceResponse } from './__MOCKS__/gitHubServiceMockFolder/getPullCommitsServiceResponse.mock';
import { GitHubNock } from '../../../test/helpers/gitHubNock';

describe('GitHub Service', () => {
  let service: GitHubService;
  let client: GitHubClient;

  beforeEach(async () => {
    client = new GitHubClient({ uri: '.' });
    service = new GitHubService(client);
    nock.cleanAll();
  });

  it('returns open pulls in own interface', async () => {
    new GitHubNock(1, 'octocat', 1, 'Hello-World').getPulls([
      {
        number: 1347,
        state: 'open',
        title: 'new-feature',
        body: 'Please pull these awesome changes',
        head: { ref: 'new-topic', repo: { id: 1296269, name: 'Hello-World', owner: { id: 1, login: 'octocat' } } },
        base: { ref: 'master', repo: { id: 1296269, name: 'Hello-World', owner: { id: 1, login: 'octocat' } } },
      },
    ]);

    const response = await service.getPullRequests('octocat', 'Hello-World');
    expect(response).toMatchObject(getPullsServiceResponse);
  });

  it('returns pull request reviews in own interface', async () => {
    new GitHubNock(1, 'octocat', 1, 'Hello-World').getRepo('/pulls/1/reviews').reply(200, getPullRequestsReviewsResponse);

    const response = await service.getPullRequestReviews('octocat', 'Hello-World', 1);
    expect(response).toMatchObject(getPullsReviewsServiceResponse);
  });

  it('returns commits in own interface', async () => {
    new GitHubNock(1, 'octocat', 1, 'Hello-World').getGitCommits('762941318ee16e59dabbacb1b4049eec22f0d303').reply(200, getCommitResponse);

    const response = await service.getCommit('octocat', 'Hello-World', '762941318ee16e59dabbacb1b4049eec22f0d303');
    expect(response).toMatchObject(getCommitServiceResponse);
  });

  it('returns contributors in own interface', async () => {
    new GitHubNock(1, 'octocat', 1, 'Hello-World').getContributors([{ id: 251370, login: 'Spaceghost' }, { id: 583231, login: 'octocat' }]);

    const response = await service.getContributors('octocat', 'Hello-World');
    expect(response).toMatchObject(getContributorsServiceResponse);
  });

  it('returns contributor stats in own interface', async () => {
    new GitHubNock(1, 'octocat', 1, 'Hello-World').getRepo('/stats/contributors').reply(200, getContributorsStatsResponse);

    const response = await service.getContributorsStats('octocat', 'Hello-World');
    expect(response).toMatchObject(getContributorsStatsServiceResponse);
  });

  it('returns repo content in own interface', async () => {
    new GitHubNock(1, 'octocat', 1, 'Hello-World').getFile('README', 'Hello World!\n', '980a0d5f19a64b4b30a87d4206aade58726b60e3');

    const response = await service.getRepoContent('octocat', 'Hello-World', 'README');
    expect(response).toMatchObject(getRepoContentServiceResponse);
  });

  it('returns issues in own interface', async () => {
    new GitHubNock(1, 'octocat', 1, 'Hello-World').getIssues().reply(200, getIssuesResponse);

    const response = await service.getIssues('octocat', 'Hello-World');
    expect(response).toMatchObject(getIssuesServiceResponse);
  });

  it('returns comments in own interface', async () => {
    new GitHubNock(1, 'octocat', 1, 'Hello-World').getRepo('/issues/1/comments').reply(200, getIssueCommentsResponse);

    const response = await service.getIssueComments('octocat', 'Hello-World', 1);
    expect(response).toMatchObject(getIssueCommentsServiceResponse);
  });

  it('returns commits in own interfa', async () => {
    new GitHubNock(1, 'octocat', 1, 'Hello-World').getRepo('/issues/1/comments').reply(200, getIssueCommentsResponse);

    const response = await service.getIssueComments('octocat', 'Hello-World', 1);
    expect(response).toMatchObject(getIssueCommentsServiceResponse);
  });

  it('returns pull files in own interface', async () => {
    new GitHubNock(1, 'octocat', 1, 'Hello-World').getRepo('/pulls/1/files').reply(200, getPullsFilesResponse);

    const response = await service.getPullRequestFiles('octocat', 'Hello-World', 1);
    expect(response).toMatchObject(getPullsFilesServiceResponse);
  });

  it('returns pull commits in own interface', async () => {
    new GitHubNock(1, 'octocat', 1, 'Hello-World').getRepo('/pulls/1/commits').reply(200, getPullCommitsResponse);

    const response = await service.getPullCommits('octocat', 'Hello-World', 1);
    expect(response).toMatchObject(getPullCommitsServiceResponse);
  });
});
