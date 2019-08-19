/* eslint-disable @typescript-eslint/camelcase */
import { GitHubClient } from './GitHubClient';
import nock from 'nock';
import { getPullsRequestsResponse } from './__MOCKS__/gitHubClientMockFolder/getPullsRequestsResponse.mock';
import { getContributorsStatsResponse } from './__MOCKS__/gitHubClientMockFolder/getContributorsStatsResponse.mock';
import { getPullRequestsReviewsResponse } from './__MOCKS__/gitHubClientMockFolder/getPullRequestsReviewsResponse.mock';
import { getIssuesResponse } from './__MOCKS__/gitHubClientMockFolder/getIssuesResponse.mock';
import { getPaginatedIssuesResponse } from './__MOCKS__/gitHubClientMockFolder/getPaginatedIssuesResponse.mock';
import { getCommitResponse } from './__MOCKS__/gitHubClientMockFolder/getCommitResponse.mock';
import { getRepoCommitsResponse } from './__MOCKS__/gitHubClientMockFolder/getRepoCommitsResponse.mock';
import { getPullsFilesResponse } from './__MOCKS__/gitHubClientMockFolder/getPullsFiles.mock';
import { getPullCommitsResponse } from './__MOCKS__/gitHubClientMockFolder/getPullsCommitsResponse.mock';
import { GitHubNock } from '../../../test/helpers/gitHubNock';

describe('GitHubClient', () => {
  let client: GitHubClient;

  beforeEach(async () => {
    nock.cleanAll();
    client = new GitHubClient({ uri: '.' });
  });

  it('gets repo content', async () => {
    const file = new GitHubNock(1, 'octocat', 1, 'Hello-World').getFile('README');
    const response = await client.getRepoContent('octocat', 'Hello-World', 'README');

    expect(response.data).toMatchObject(file);
  });

  it('gets contributors stats', async () => {
    new GitHubNock(1, 'octocat', 1, 'Hello-World').getRepo('/stats/contributors').reply(200, getContributorsStatsResponse);
    const response = await client.getContributorsStats('octocat', 'Hello-World');

    expect(response.data).toMatchObject(getContributorsStatsResponse);
  });

  it('gets contributors anonymous contributors included', async () => {
    const contributors = new GitHubNock(1, 'octocat', 1, 'Hello-World').getContributors(
      [{ id: 251370, login: 'Spaceghost' }, { id: 583231, login: 'octocat' }],
      true,
    );
    const response = await client.getContributors('octocat', 'Hello-World', { filter: { anon: true } });

    expect(response.data).toMatchObject(contributors);
  });

  it('gets contributors', async () => {
    const contributors = new GitHubNock(1, 'octocat', 1, 'Hello-World').getContributors([
      { id: 251370, login: 'Spaceghost' },
      { id: 583231, login: 'octocat' },
    ]);
    const response = await client.getContributors('octocat', 'Hello-World');

    expect(response.data).toMatchObject(contributors);
  });

  it('gets pull requests', async () => {
    new GitHubNock(1, 'octocat', 1, 'Hello-World').getPulls(undefined, 'open').reply(200, getPullsRequestsResponse);
    const response = await client.getPullRequests('octocat', 'Hello-World');

    expect(response.data).toMatchObject(getPullsRequestsResponse);
  });

  it('get pull request reviews', async () => {
    new GitHubNock(1, 'octocat', 1, 'Hello-World').getRepo('/pulls/1/reviews').reply(200, getPullRequestsReviewsResponse);
    const response = await client.getPullRequestReviews('octocat', 'Hello-World', 1);

    expect(response.data).toMatchObject(getPullRequestsReviewsResponse);
  });

  it('gets issues', async () => {
    new GitHubNock(1, 'octocat', 1, 'Hello-World').getIssues().reply(200, getIssuesResponse);
    const response = await client.getIssues('octocat', 'Hello-World');

    expect(response.data).toMatchObject(getIssuesResponse);
  });

  it('gets paginated issues', async () => {
    new GitHubNock(1, 'octocat', 1, 'Hello-World').getIssues(undefined, 1, 1).reply(200, getPaginatedIssuesResponse);
    const response = await client.getIssues('octocat', 'Hello-World', { page: 1, per_page: 1 });

    expect(response.data).toMatchObject(getPaginatedIssuesResponse);
  });

  it('gets commit', async () => {
    new GitHubNock(1, 'octocat', 1, 'Hello-World').getGitCommits('762941318ee16e59dabbacb1b4049eec22f0d303').reply(200, getCommitResponse);
    const response = await client.getCommit('octocat', 'Hello-World', '762941318ee16e59dabbacb1b4049eec22f0d303');

    expect(response.data).toMatchObject(getCommitResponse);
  });

  it('gets repo commits', async () => {
    new GitHubNock(1, 'octocat', 1, 'Hello-World').getCommits().reply(200, getRepoCommitsResponse);
    const response = await client.getRepoCommits('octocat', 'Hello-World');

    expect(response.data).toMatchObject(getRepoCommitsResponse);
  });

  it('gets pull request files', async () => {
    new GitHubNock(1, 'octocat', 1, 'Hello-World').getRepo('/pulls/1/files').reply(200, getPullsFilesResponse);
    const response = await client.getPullRequestFiles('octocat', 'Hello-World', 1);

    expect(response.data).toMatchObject(getPullsFilesResponse);
  });

  it('gets pulls commits', async () => {
    new GitHubNock(1, 'octocat', 1, 'Hello-World').getRepo('/pulls/1/commits').reply(200, getPullCommitsResponse);
    const response = await client.getPullCommits('octocat', 'Hello-World', 1);

    expect(response.data).toMatchObject(getPullCommitsResponse);
  });

  it('gets all issues with paginate', async () => {
    new GitHubNock(1, 'octocat', 1, 'Hello-World').getIssues().reply(200, getIssuesResponse);
    const response = await client.paginate('GET /repos/:owner/:repo/issues', 'octocat', 'Hello-World');

    expect(response).toMatchObject(getIssuesResponse);
  });
});
