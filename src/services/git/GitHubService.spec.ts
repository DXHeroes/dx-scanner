import _ from 'lodash';
import nock from 'nock';
import { PullRequestState } from '../../inspectors';
import { argumentsProviderFactory } from '../../test/factories/ArgumentsProviderFactory';
import { GitHubNock } from '../../test/helpers/gitHubNock';
import { GitHubService } from './GitHubService';
import { listPullRequestsParamas } from './gqlQueries/listPullRequests';
import { File } from './model';
import {
  getCommitResponse,
  getCommitServiceResponse,
  getContributorsServiceResponse,
  getContributorsStatsResponse,
  getContributorsStatsServiceResponse,
  getIssueCommentsResponse,
  getIssueCommentsServiceResponse,
  getIssuesResponse,
  getIssuesServiceResponse,
  getPullCommitsResponse,
  getPullCommitsServiceResponse,
  getPullRequestsReviewsResponse,
  getPullsFilesResponse,
  getPullsFilesServiceResponse,
  getPullsReviewsServiceResponse,
  getPullsServiceResponse,
  getRepoCommitsResponse,
  getRepoContentServiceResponseDir,
  getRepoContentServiceResponseFile,
} from './__MOCKS__/gitHubServiceMockFolder';
import { getRepoCommitsServiceResponse } from './__MOCKS__/gitHubServiceMockFolder/getRepoCommitsServiceResponse.mock';
import { gqlPullsResponse, oneGqlPullRequest } from './__MOCKS__/gitHubServiceMockFolder/gqlPullsResponse.mock';

describe('GitHub Service', () => {
  let service: GitHubService;

  const repositoryConfig = {
    remoteUrl: 'https://github.com/octocat/Hello-World',
    baseUrl: 'https://github.com',
    host: 'githum.com',
    protocol: 'https',
  };

  beforeEach(async () => {
    service = new GitHubService(argumentsProviderFactory({ uri: '.' }), repositoryConfig);
  });

  describe('#getPullRequests', () => {
    it('purges the cache', async () => {
      new GitHubNock('1', 'octocat', 1, 'Hello-World').getFile('README', 'before', undefined, false);
      await service.getRepoContent('octocat', 'Hello-World', 'README');

      service.purgeCache();

      new GitHubNock('1', 'octocat', 1, 'Hello-World').getFile('README', 'after');
      const response = await service.getRepoContent('octocat', 'Hello-World', 'README');
      expect(((response as unknown) as File).content).toEqual('YWZ0ZXI=');
    });

    it('returns pulls in own interface', async () => {
      const queryBody = {
        query: listPullRequestsParamas,
        variables: {
          owner: 'octocat',
          repo: 'Hello-World',
          count: 100,
          states: ['OPEN', 'MERGED', 'CLOSED'],
        },
      };

      nock('https://api.github.com').post('/graphql', queryBody).reply(200, gqlPullsResponse());

      const response = await service.listPullRequests('octocat', 'Hello-World');
      expect(response).toMatchObject(getPullsServiceResponse);
    });

    it('returns pulls in own interface with diffStat', async () => {
      const queryBody = {
        query: listPullRequestsParamas,
        variables: {
          owner: 'octocat',
          repo: 'Hello-World',
          count: 100,
          states: 'OPEN',
        },
      };

      nock('https://api.github.com').post('/graphql', queryBody).reply(200, gqlPullsResponse());

      const response = await service.listPullRequests('octocat', 'Hello-World', {
        withDiffStat: true,
        filter: { state: PullRequestState.open },
      });

      const lines = { additions: 1, deletions: 1, changes: 2 };
      const getPullsServiceResponseWithDiffStat = _.cloneDeep(getPullsServiceResponse);
      getPullsServiceResponseWithDiffStat.items[0] = { ...getPullsServiceResponseWithDiffStat.items[0], lines };
      expect(response).toMatchObject(getPullsServiceResponseWithDiffStat);
    });

    it('returns one pull in own interface', async () => {
      const pagination = { perPage: 1 };
      const queryBody = {
        query: listPullRequestsParamas,
        variables: {
          owner: 'octocat',
          repo: 'Hello-World',
          count: 1,
          states: ['OPEN', 'MERGED', 'CLOSED'],
        },
      };

      nock('https://api.github.com').post('/graphql', queryBody).reply(200, gqlPullsResponse());
      const response = await service.listPullRequests('octocat', 'Hello-World', { pagination });
      expect(response).toMatchObject(getPullsServiceResponse);
    });

    it('returns two pulls in own interface one per page', async () => {
      const pagination = { perPage: 1 };
      const queryBody = {
        query: listPullRequestsParamas,
        variables: {
          owner: 'octocat',
          repo: 'Hello-World',
          count: 1,
          states: ['OPEN', 'MERGED', 'CLOSED'],
        },
      };
      const queryBodyScnd = {
        query: listPullRequestsParamas,
        variables: {
          owner: 'octocat',
          repo: 'Hello-World',
          count: 1,
          states: ['OPEN', 'MERGED', 'CLOSED'],
          startCursor: 'Y3Vyc29yOnYyOpHODUTjBQ==',
        },
      };

      nock('https://api.github.com')
        .post('/graphql', queryBody)
        .reply(200, gqlPullsResponse({ data: { repository: { pullRequests: { pageInfo: { hasPreviousPage: true } } } } }));
      nock('https://api.github.com').post('/graphql', queryBodyScnd).reply(200, gqlPullsResponse());

      const response = await service.listPullRequests('octocat', 'Hello-World', { pagination });
      expect(response.items.length).toEqual(2);
    });

    it('returns open pulls', async () => {
      const queryBody = {
        query: listPullRequestsParamas,
        variables: {
          owner: 'octocat',
          repo: 'Hello-World',
          count: 100,
          states: 'OPEN',
        },
      };

      nock('https://api.github.com').post('/graphql', queryBody).reply(200, gqlPullsResponse());

      const response = await service.listPullRequests('octocat', 'Hello-World', { filter: { state: PullRequestState.open } });
      expect(response.items.map((item) => item.state)).toMatchObject(['OPEN']);
    });

    it('returns closed pulls', async () => {
      const queryBody = {
        query: listPullRequestsParamas,
        variables: {
          owner: 'octocat',
          repo: 'Hello-World',
          count: 100,
          states: 'CLOSED',
        },
      };

      nock('https://api.github.com')
        .post('/graphql', queryBody)
        .reply(200, gqlPullsResponse({ data: { repository: { pullRequests: { edges: [{ node: { state: 'CLOSED' } }] } } } }));

      const response = await service.listPullRequests('octocat', 'Hello-World', { filter: { state: PullRequestState.closed } });
      expect(response.items.map((item) => item.state)).toMatchObject(['CLOSED']);
    });

    it('returns all pulls', async () => {
      const queryBody = {
        query: listPullRequestsParamas,
        variables: {
          owner: 'octocat',
          repo: 'Hello-World',
          count: 100,
          states: ['OPEN', 'MERGED', 'CLOSED'],
        },
      };

      const pulls = gqlPullsResponse({
        data: {
          repository: {
            pullRequests: {
              edges: [
                oneGqlPullRequest({ node: { state: 'OPEN' } }),
                oneGqlPullRequest({ node: { state: 'CLOSED' } }),
                oneGqlPullRequest({ node: { state: 'MERGED' } }),
              ],
            },
          },
        },
      });

      nock('https://api.github.com').post('/graphql', queryBody).reply(200, pulls);

      const response = await service.listPullRequests('octocat', 'Hello-World', { filter: { state: PullRequestState.all } });
      expect(response.items.map((item) => item.state)).toMatchObject(['OPEN', 'CLOSED', 'MERGED']);
    });
  });

  it('returns pull request reviews in own interface', async () => {
    new GitHubNock('1', 'octocat', 1, 'Hello-World').getRepo('/pulls/1/reviews').reply(200, getPullRequestsReviewsResponse);

    const response = await service.listPullRequestReviews('octocat', 'Hello-World', 1);
    expect(response).toMatchObject(getPullsReviewsServiceResponse);
  });

  it('returns commits in own interface', async () => {
    new GitHubNock('1', 'octocat', 1, 'Hello-World').getCommits().reply(200, getRepoCommitsResponse);
    const response = await service.listRepoCommits('octocat', 'Hello-World');

    expect(response).toMatchObject(getRepoCommitsServiceResponse);
  });

  it('returns commits in own interface', async () => {
    new GitHubNock('1', 'octocat', 1, 'Hello-World')
      .getGitCommits('762941318ee16e59dabbacb1b4049eec22f0d303')
      .reply(200, getCommitResponse);

    const response = await service.getCommit('octocat', 'Hello-World', '762941318ee16e59dabbacb1b4049eec22f0d303');
    expect(response).toMatchObject(getCommitServiceResponse);
  });

  it('returns contributors in own interface', async () => {
    new GitHubNock('1', 'octocat', 1, 'Hello-World').getContributors([
      { id: '251370', login: 'Spaceghost' },
      { id: '583231', login: 'octocat' },
    ]);

    const response = await service.listContributors('octocat', 'Hello-World');
    expect(response).toMatchObject(getContributorsServiceResponse);
  });

  it('returns contributor stats in own interface', async () => {
    new GitHubNock('1', 'octocat', 1, 'Hello-World').getRepo('/stats/contributors').reply(200, getContributorsStatsResponse);

    const response = await service.listContributorsStats('octocat', 'Hello-World');
    expect(response).toMatchObject(getContributorsStatsServiceResponse);
  });

  describe('#getRepoContent', () => {
    it('returns files in own interface', async () => {
      new GitHubNock('1', 'octocat', 1, 'Hello-World').getFile('README', 'Hello World!\n', '980a0d5f19a64b4b30a87d4206aade58726b60e3');

      const response = await service.getRepoContent('octocat', 'Hello-World', 'README');
      expect(response).toMatchObject(getRepoContentServiceResponseFile);
    });

    it('returns directories in own interface', async () => {
      new GitHubNock('1', 'octocat', 1, 'Hello-World').getDirectory('mockFolder', ['mockFile.ts'], []);

      const response = await service.getRepoContent('octocat', 'Hello-World', 'mockFolder');
      expect(response).toMatchObject(getRepoContentServiceResponseDir);
    });

    it("returns null if the path doesn't exists", async () => {
      new GitHubNock('1', 'octocat', 1, 'Hello-World').getNonexistentContents('notExistingMockFolder');

      const result = await service.getRepoContent('octocat', 'Hello-World', 'notExistingMockFolder');

      expect(result).toBe(null);
    });

    it('caches the results', async () => {
      // bacause of persist == false, the second call to service.getRepoContent() would cause Nock to throw an error if the cache wasn't used
      new GitHubNock('1', 'octocat', 1, 'Hello-World').getFile('README', undefined, undefined, false);
      await service.getRepoContent('octocat', 'Hello-World', 'README');

      await service.getRepoContent('octocat', 'Hello-World', 'README');
    });
  });

  it('returns issues in own interface', async () => {
    new GitHubNock('1', 'octocat', 1, 'Hello-World').getIssues().reply(200, getIssuesResponse);

    const response = await service.listIssues('octocat', 'Hello-World');
    expect(response).toMatchObject(getIssuesServiceResponse);
  });

  it('returns comments in own interface', async () => {
    new GitHubNock('1', 'octocat', 1, 'Hello-World').getRepo('/issues/1/comments').reply(200, getIssueCommentsResponse);

    const response = await service.listIssueComments('octocat', 'Hello-World', 1);
    expect(response).toMatchObject(getIssueCommentsServiceResponse);
  });

  it('returns commits in own interfa', async () => {
    new GitHubNock('1', 'octocat', 1, 'Hello-World').getRepo('/issues/1/comments').reply(200, getIssueCommentsResponse);

    const response = await service.listIssueComments('octocat', 'Hello-World', 1);
    expect(response).toMatchObject(getIssueCommentsServiceResponse);
  });

  it('returns pull files in own interface', async () => {
    new GitHubNock('1', 'octocat', 1, 'Hello-World').getRepo('/pulls/1/files').reply(200, getPullsFilesResponse);

    const response = await service.listPullRequestFiles('octocat', 'Hello-World', 1);
    expect(response).toMatchObject(getPullsFilesServiceResponse);
  });

  it('returns pull commits in own interface', async () => {
    new GitHubNock('1', 'octocat', 1, 'Hello-World').getRepo('/pulls/1/commits').reply(200, getPullCommitsResponse);

    const response = await service.listPullCommits('octocat', 'Hello-World', 1);
    expect(response).toMatchObject(getPullCommitsServiceResponse);
  });
});
