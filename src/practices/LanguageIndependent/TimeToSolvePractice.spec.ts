import nock from 'nock';
import { PullRequestState } from '../../inspectors/ICollaborationInspector';
import { createTestContainer, TestContainerContext } from '../../inversify.config';
import { PracticeEvaluationResult } from '../../model';
import { GitHubNock } from '../../test/helpers/gitHubNock';
import { TimeToSolvePractice } from './TimeToSolvePractice';

describe('TimeToSolvePractice', () => {
  let practice: TimeToSolvePractice;
  let containerCtx: TestContainerContext;

  beforeEach(async () => {
    nock.cleanAll();
  });

  beforeAll(() => {
    containerCtx = createTestContainer();
    containerCtx.container.bind('TimeToSolvePractice').to(TimeToSolvePractice);
    practice = containerCtx.container.get('TimeToSolvePractice');
  });

  afterEach(async () => {
    containerCtx.virtualFileSystemService.clearFileSystem();
    containerCtx.practiceContext.fileInspector!.purgeCache();
  });

  it('', async () => {
    containerCtx.practiceContext.projectComponent.repositoryPath = 'https://github.com/octocat/Hello-World';
    new GitHubNock('1', 'octocat', 1296269, 'Hello-World').getPulls(
      [{ number: 1347, state: 'open', title: 'new-feature', body: 'Please pull these awesome changes', head: 'new-topic', base: 'master' }],
      PullRequestState.open,
    );

    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.practicing);
  });
});
