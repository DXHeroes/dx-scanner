import { createTestContainer, TestContainerContext } from '../../inversify.config';
import { PracticeEvaluationResult } from '../../model';
import { DoesPullRequestsPractice } from './DoesPullRequests';
import nock from 'nock';
import { GitHubNock } from '../../../test/helpers/gitHubNock';
import { getRepoCommitsResponse } from '../../services/git/__MOCKS__/gitHubServiceMockFolder/getRepoCommitsResponse.mock';
import { PullRequestState } from '../../inspectors/ICollaborationInspector';

describe('DoesPullRequests', () => {
  let practice: DoesPullRequestsPractice;
  let containerCtx: TestContainerContext;

  beforeEach(async () => {
    nock.cleanAll();
  });

  beforeAll(() => {
    containerCtx = createTestContainer();
    containerCtx.container.bind('DoesPullRequests').to(DoesPullRequestsPractice);
    practice = containerCtx.container.get('DoesPullRequests');
  });

  afterEach(async () => {
    containerCtx.virtualFileSystemService.clearFileSystem();
    containerCtx.practiceContext.fileInspector!.purgeCache();
  });

  it('return practicing if there is at least one PR which is newer than last commit in master minus 30 days', async () => {
    containerCtx.practiceContext.projectComponent.repositoryPath = 'https://github.com/octocat/Hello-World';
    new GitHubNock('1', 'octocat', 1296269, 'Hello-World').getPulls(
      [{ number: 1347, state: 'open', title: 'new-feature', body: 'Please pull these awesome changes', head: 'new-topic', base: 'master' }],
      PullRequestState.all,
    );
    new GitHubNock('1', 'octocat', 1, 'Hello-World').getCommits().reply(200, getRepoCommitsResponse);

    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.practicing);
  });

  it('return notPracticing if there is no PR which is newer than last commit in master minus 30 days', async () => {
    containerCtx.practiceContext.projectComponent.repositoryPath = 'https://github.com/octocat/Hello-World';
    new GitHubNock('1', 'octocat', 1296269, 'Hello-World').getPulls([], PullRequestState.all);
    new GitHubNock('1', 'octocat', 1, 'Hello-World').getCommits().reply(200, getRepoCommitsResponse);

    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.notPracticing);
  });

  it('return notPracticing if there is PR older than 30 days than the last commit in master', async () => {
    containerCtx.practiceContext.projectComponent.repositoryPath = 'https://github.com/octocat/Hello-World';
    new GitHubNock('1', 'octocat', 1296269, 'Hello-World').getPulls(
      [
        {
          number: 1348,
          state: 'opened',
          title: 'new-feature',
          body: '',
          head: 'new-topic',
          base: 'master',
          // eslint-disable-next-line @typescript-eslint/camelcase
          created_at: '2000-03-06T23:06:50Z',
        },
      ],
      PullRequestState.all,
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
