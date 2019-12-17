import { createTestContainer, TestContainerContext } from '../../inversify.config';
import { PracticeEvaluationResult } from '../../model';
import { DoesPullRequestsPractice } from './DoesPullRequests';
import nock from 'nock';
import { GitHubNock } from '../../test/helpers/gitHubNock';
import { getRepoCommitsResponse } from '../../services/git/__MOCKS__/gitHubServiceMockFolder/getRepoCommitsResponse.mock';
import { PullRequestState } from '../../inspectors/ICollaborationInspector';
import { FatPullRequestsPractice } from './FatPullRequestsPractice';

describe('FatPullRequestsPractice', () => {
  let practice: FatPullRequestsPractice;
  let containerCtx: TestContainerContext;

  beforeEach(async () => {
    nock.cleanAll();
  });

  beforeAll(() => {
    containerCtx = createTestContainer();
    containerCtx.container.bind('FatPullRequestsPractice').to(FatPullRequestsPractice);
    practice = containerCtx.container.get('FatPullRequestsPractice');
  });

  afterEach(async () => {
    containerCtx.virtualFileSystemService.clearFileSystem();
    containerCtx.practiceContext.fileInspector!.purgeCache();
  });

  it('return practicing if there is not fat PR which is not older than 30 days than the newest PR', async () => {
    containerCtx.practiceContext.projectComponent.repositoryPath = 'https://github.com/octocat/Hello-World';
    const params = {
      number: 1347,
      state: 'open',
      title: 'new-feature',
      body: 'Please pull these awesome changes',
      head: 'new-topic',
      base: 'master',
      lines: { additions: 1, deletions: 1 },
    };

    new GitHubNock('1', 'octocat', 1296269, 'Hello-World').getPulls({ pulls: [params], queryState: PullRequestState.all });
    new GitHubNock('1', 'octocat', 1296269, 'Hello-World').getPull(
      1,
      params.state,
      params.title,
      params.body,
      params.head,
      params.base,
      undefined,
      undefined,
      undefined,
      params.lines,
    );

    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.practicing);
  });

  it('return not practicing if there is at least one fat PR which is not older than 30 days than the newest PR', async () => {
    containerCtx.practiceContext.projectComponent.repositoryPath = 'https://github.com/octocat/Hello-World';
    const params = {
      number: 1347,
      state: 'open',
      title: 'new-feature',
      body: 'Please pull these awesome changes',
      head: 'new-topic',
      base: 'master',
      lines: { additions: 1000, deletions: 500 },
    };

    new GitHubNock('1', 'octocat', 1296269, 'Hello-World').getPulls({ pulls: [params], queryState: PullRequestState.all });
    new GitHubNock('1', 'octocat', 1296269, 'Hello-World').getPull(
      1,
      params.state,
      params.title,
      params.body,
      params.head,
      params.base,
      undefined,
      undefined,
      undefined,
      params.lines,
    );

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
