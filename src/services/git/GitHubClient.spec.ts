/* eslint-disable @typescript-eslint/camelcase */
import { GitHubClient } from './GitHubClient';
import nock from 'nock';
import { getPullsRequestsResponse } from './__MOCKS__/gitHubClientMockFolder/getPullsRequestsResponse.mock';
import { getRepoContentResponse, getRepoContentAnonIncludedResponse } from './__MOCKS__/gitHubClientMockFolder/getRepoContentResponse.mock';
import { getContributorsStatsResponse } from './__MOCKS__/gitHubClientMockFolder/getContributorsStatsResponse.mock';
import { getPullRequestsReviewsResponse } from './__MOCKS__/gitHubClientMockFolder/getPullRequestsReviewsResponse.mock';
import { getIssuesResponse } from './__MOCKS__/gitHubClientMockFolder/getIssuesResponse.mock';
import { getPaginatedIssuesResponse } from './__MOCKS__/gitHubClientMockFolder/getPaginatedIssuesResponse.mock';
import { getCommitResponse } from './__MOCKS__/gitHubClientMockFolder/getCommitResponse.mock';
import { getContributorsResponse } from './__MOCKS__/gitHubClientMockFolder/getContributorsResponse.mock';
import { getRepoCommitsResponse } from './__MOCKS__/gitHubClientMockFolder/getRepoCommitsResponse.mock';
import { getPullsFilesResponse } from './__MOCKS__/gitHubClientMockFolder/getPullsFiles.mock';
import { getPullCommitsResponse } from './__MOCKS__/gitHubClientMockFolder/getPullsCommitsResponse.mock';

describe('GitHubClient', () => {
  const gitHubNock = nock('https://api.github.com');
  let client: GitHubClient;

  beforeEach(async () => {
    client = new GitHubClient({ uri: '.' });
  });

  it('gets repo content', async () => {
    gitHubNock.get('/repos/octocat/Hello-World/contents/README').reply(200, getRepoContentResponse);
    const response = await client.getRepoContent('octocat', 'Hello-World', 'README');

    expect(response.data).toMatchObject(getRepoContentResponse);
  });

  it('gets contributors stats', async () => {
    gitHubNock.get('/repos/octocat/Hello-World/stats/contributors').reply(200, getContributorsStatsResponse);
    const response = await client.getContributorsStats('octocat', 'Hello-World');

    expect(response.data).toMatchObject(getContributorsStatsResponse);
  });

  it('gets contributors anonymous contributors included', async () => {
    gitHubNock
      .get('/repos/octocat/Hello-World/contributors')
      .query({ anon: 'true' })
      .reply(200, getRepoContentAnonIncludedResponse);
    const response = await client.getContributors('octocat', 'Hello-World', { filter: { anon: true } });

    expect(response.data).toMatchObject(getRepoContentAnonIncludedResponse);
  });

  it('gets contributors', async () => {
    gitHubNock.get('/repos/octocat/Hello-World/contributors').reply(200, getContributorsResponse);
    const response = await client.getContributors('octocat', 'Hello-World');

    expect(response.data).toMatchObject(getContributorsResponse);
  });

  it('gets pull requests', async () => {
    gitHubNock
      .get('/repos/octocat/Hello-World/pulls')
      .query({ state: 'open' })
      .reply(200, getPullsRequestsResponse);
    const response = await client.getPullRequests('octocat', 'Hello-World');

    expect(response.data).toMatchObject(getPullsRequestsResponse);
  });

  it('get pull request reviews', async () => {
    gitHubNock.get('/repos/octocat/Hello-World/pulls/1/reviews').reply(200, getPullRequestsReviewsResponse);
    const response = await client.getPullRequestReviews('octocat', 'Hello-World', 1);

    expect(response.data).toMatchObject(getPullRequestsReviewsResponse);
  });

  it('gets issues', async () => {
    gitHubNock.get('/repos/octocat/Hello-World/issues').reply(200, getIssuesResponse);
    const response = await client.getIssues('octocat', 'Hello-World');

    expect(response.data).toMatchObject(getIssuesResponse);
  });

  it('gets paginated issues', async () => {
    gitHubNock
      .get('/repos/octocat/Hello-World/issues')
      .query({ page: 1, per_page: 1 })
      .reply(200, getPaginatedIssuesResponse);
    const response = await client.getIssues('octocat', 'Hello-World', { page: 1, per_page: 1 });

    expect(response.data).toMatchObject(getPaginatedIssuesResponse);
  });

  it('gets commit', async () => {
    gitHubNock.get('/repos/octocat/Hello-World/git/commits/762941318ee16e59dabbacb1b4049eec22f0d303').reply(200, getCommitResponse);
    const response = await client.getCommit('octocat', 'Hello-World', '762941318ee16e59dabbacb1b4049eec22f0d303');

    expect(response.data).toMatchObject(getCommitResponse);
  });

  it('gets repo commits', async () => {
    gitHubNock.get('/repos/octocat/Hello-World/commits').reply(200, getRepoCommitsResponse);
    const response = await client.getRepoCommits('octocat', 'Hello-World');

    expect(response.data).toMatchObject(getRepoCommitsResponse);
  });

  it('gets pull request files', async () => {
    gitHubNock.get('/repos/octocat/Hello-World/pulls/1/files').reply(200, getPullsFilesResponse);
    const response = await client.getPullRequestFiles('octocat', 'Hello-World', 1);

    expect(response.data).toMatchObject(getPullsFilesResponse);
  });

  it('gets pulls commits', async () => {
    gitHubNock.get('/repos/octocat/Hello-World/pulls/1/commits').reply(200, getPullCommitsResponse);
    const response = await client.getPullCommits('octocat', 'Hello-World', 1);

    expect(response.data).toMatchObject(getPullCommitsResponse);
  });

  it('gets all issues with paginate', async () => {
    gitHubNock.get('/repos/octocat/Hello-World/issues').reply(200, getIssuesResponse);
    const response = await client.paginate('GET /repos/:owner/:repo/issues', 'octocat', 'Hello-World');

    expect(response).toMatchObject(getIssuesResponse);
  });
});
