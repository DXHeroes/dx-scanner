import { createTestContainer, TestContainerContext } from '../../inversify.config';
import { PracticeEvaluationResult } from '../../model';
import { DoesPullRequests } from './DoesPullRequests';
import nock from 'nock';
import { GitHubNock } from '../../../test/helpers/gitHubNock';
import { getRepoCommitsResponse } from '../../services/git/__MOCKS__/gitHubServiceMockFolder/getRepoCommitsResponse.mock';

describe('DoesPullRequests', () => {
  let practice: DoesPullRequests;
  let containerCtx: TestContainerContext;

  beforeEach(async () => {
    nock.cleanAll();
  });

  beforeAll(() => {
    containerCtx = createTestContainer();
    containerCtx.container.bind('DoesPullRequests').to(DoesPullRequests);
    practice = containerCtx.container.get('DoesPullRequests');
  });

  afterEach(async () => {
    containerCtx.virtualFileSystemService.clearFileSystem();
    containerCtx.practiceContext.fileInspector!.purgeCache();
  });

  it('return practicing if there is at least one PR which is newer than last commit in master minus 30 days', async () => {
    containerCtx.practiceContext.projectComponent.repositoryPath = 'https://github.com/octocat/Hello-World';
    new GitHubNock('1', 'octocat', 1296269, 'Hello-World').getPulls([
      { number: 1347, state: 'open', title: 'new-feature', body: 'Please pull these awesome changes', head: 'new-topic', base: 'master' },
    ]);
    new GitHubNock('1', 'octocat', 1, 'Hello-World').getCommits().reply(200, getRepoCommitsResponse);

    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.practicing);
  });
});
