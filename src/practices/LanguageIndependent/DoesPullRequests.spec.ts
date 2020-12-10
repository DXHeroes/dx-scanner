import nock from 'nock';
import { createTestContainer, TestContainerContext } from '../../inversify.config';
import { PracticeEvaluationResult } from '../../model';
import { getRepoCommitsResponse } from '../../services/git/__MOCKS__/gitHubServiceMockFolder/getRepoCommitsResponse.mock';
import { gqlPullsResponse } from '../../services/git/__MOCKS__/gitHubServiceMockFolder/gqlPullsResponse.mock';
import { GitHubNock } from '../../test/helpers/gitHubNock';
import { DoesPullRequestsPractice } from './DoesPullRequests';
import { generateSearchQuery, listPullRequestsQuery } from '../../services/git/gqlQueries/listPullRequests';
import { GitHubGqlPullRequestState } from '../../services';

describe('DoesPullRequests', () => {
  let practice: DoesPullRequestsPractice;
  let containerCtx: TestContainerContext;

  beforeAll(() => {
    containerCtx = createTestContainer();
    containerCtx.container.bind('DoesPullRequests').to(DoesPullRequestsPractice);
    practice = containerCtx.container.get('DoesPullRequests');
  });

  afterEach(async () => {
    containerCtx.virtualFileSystemService.clearFileSystem();
    containerCtx.practiceContext.fileInspector!.purgeCache();
    containerCtx.practiceContext.collaborationInspector?.purgeCache();
  });

  it('return practicing if there is at least one PR which is newer than last commit in master minus 30 days', async () => {
    containerCtx.practiceContext.projectComponent.repositoryPath = 'https://github.com/octocat/Hello-World';
    const lastMonth = new Date();
    lastMonth.setMonth(new Date().getMonth() - 1);
    const searchQuery = generateSearchQuery('octocat', 'Hello-World', lastMonth, GitHubGqlPullRequestState.all);

    const queryBody = {
      query: listPullRequestsQuery(searchQuery),
      variables: {
        count: 100,
      },
    };

    nock('https://api.github.com')
      .post('/graphql', queryBody)
      .reply(
        200,
        gqlPullsResponse({
          data: {
            search: { edges: [{ node: { createdAt: '2011-01-13T04:42:41Z', updatedAt: '2011-01-13T04:42:41Z' } }] },
          },
        }),
      );
    new GitHubNock('1', 'octocat', 1, 'Hello-World').getCommits().reply(200, getRepoCommitsResponse);

    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.practicing);
    expect(practice.data.statistics?.pullRequests).toBeDefined();
  });

  it('return practicing if there is at least one PR which is newer than last commit in master minus 30 days, author can be null', async () => {
    containerCtx.practiceContext.projectComponent.repositoryPath = 'https://github.com/octocat/Hello-World';
    const lastMonth = new Date();
    lastMonth.setMonth(new Date().getMonth() - 1);
    const searchQuery = generateSearchQuery('octocat', 'Hello-World', lastMonth, GitHubGqlPullRequestState.all);

    const queryBody = {
      query: listPullRequestsQuery(searchQuery),
      variables: {
        count: 100,
      },
    };

    nock('https://api.github.com')
      .post('/graphql', queryBody)
      .reply(
        200,
        gqlPullsResponse({
          data: {
            search: {
              edges: [{ node: { author: null, createdAt: '2011-01-13T04:42:41Z', updatedAt: '2011-01-13T04:42:41Z' } }],
            },
          },
        }),
      );
    new GitHubNock('1', 'octocat', 1, 'Hello-World').getCommits().reply(200, getRepoCommitsResponse);

    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.practicing);
    expect(practice.data.statistics?.pullRequests).toBeDefined();
  });

  it('return notPracticing if there is no PR which is newer than last commit in master minus 30 days', async () => {
    containerCtx.practiceContext.projectComponent.repositoryPath = 'https://github.com/octocat/Hello-World';
    const lastMonth = new Date();
    lastMonth.setMonth(new Date().getMonth() - 1);
    const searchQuery = generateSearchQuery('octocat', 'Hello-World', lastMonth, GitHubGqlPullRequestState.all);

    const queryBody = {
      query: listPullRequestsQuery(searchQuery),
      variables: {
        count: 100,
      },
    };

    nock('https://api.github.com')
      .post('/graphql', queryBody)
      .reply(
        200,
        gqlPullsResponse({
          data: {
            search: { edges: [{ node: { createdAt: '2010-01-13T04:42:41Z', updatedAt: '2010-01-13T04:42:41Z' } }] },
          },
        }),
      );

    new GitHubNock('1', 'octocat', 1, 'Hello-World').getCommits().reply(200, getRepoCommitsResponse);

    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.notPracticing);
  });

  it('return notPracticing if there is PR older than 30 days than the last commit in master', async () => {
    containerCtx.practiceContext.projectComponent.repositoryPath = 'https://github.com/octocat/Hello-World';
    const lastMonth = new Date();
    lastMonth.setMonth(new Date().getMonth() - 1);
    const searchQuery = generateSearchQuery('octocat', 'Hello-World', lastMonth, GitHubGqlPullRequestState.all);

    const queryBody = {
      query: listPullRequestsQuery(searchQuery),
      variables: {
        count: 100,
      },
    };

    nock('https://api.github.com')
      .post('/graphql', queryBody)
      .reply(
        200,
        gqlPullsResponse({
          data: {
            search: { edges: [{ node: { createdAt: '2010-01-13T04:42:41Z', updatedAt: '2010-01-13T04:42:41Z' } }] },
          },
        }),
      );
    new GitHubNock('1', 'octocat', 1, 'Hello-World').getCommits().reply(200, getRepoCommitsResponse);

    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.notPracticing);
  });

  it('return true as it is always applicable', async () => {
    const applicable = await practice.isApplicable();
    expect(applicable).toEqual(true);
  });

  it('return unknown if there is no collaborationInspector', async () => {
    containerCtx.practiceContext.collaborationInspector = undefined;

    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.unknown);
  });
});
