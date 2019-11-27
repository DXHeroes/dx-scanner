import { createTestContainer, TestContainerContext } from '../../inversify.config';
import { PracticeEvaluationResult } from '../../model';
import nock from 'nock';
import { GitHubNock } from '../../../test/helpers/gitHubNock';
import { getRepoCommitsResponse } from '../../services/git/__MOCKS__/gitHubServiceMockFolder/getRepoCommitsResponse.mock';
import { CorrectCommitMessagesPractice } from './CorrectCommitMessages';
import { CollaborationInspector } from '../../inspectors/CollaborationInspector';
import { GitHubService } from '../../services/git/GitHubService';

describe('DoesPullRequests', () => {
  let practice: CorrectCommitMessagesPractice;
  let containerCtx: TestContainerContext;
  const MockedCollaborationInspector = <jest.Mock<CollaborationInspector>>(<unknown>CollaborationInspector);
  let mockCollaborationInspector: CollaborationInspector;
  const MockedGithubService = <jest.Mock<GitHubService>>(<unknown>GitHubService);

  beforeEach(async () => {
    nock.cleanAll();
  });

  beforeAll(() => {
    containerCtx = createTestContainer();
    containerCtx.container.bind('CorrectCommitMessagesPractice').to(CorrectCommitMessagesPractice);
    practice = containerCtx.container.get('CorrectCommitMessagesPractice');
    mockCollaborationInspector = new MockedCollaborationInspector();
  });

  afterEach(async () => {
    containerCtx.virtualFileSystemService.clearFileSystem();
    containerCtx.practiceContext.fileInspector!.purgeCache();
  });

  //   it('return practicing if the commit messages are correct', async () => {
  //     containerCtx.practiceContext.projectComponent.repositoryPath = 'https://github.com/octocat/Hello-World';
  //     new GitHubNock('1', 'octocat', 1, 'Hello-World').getCommits().reply(200, getRepoCommitsResponse);

  //     const evaluated = await practice.evaluate(containerCtx.practiceContext);
  //     expect(evaluated).toEqual(PracticeEvaluationResult.practicing);
  //   });

  it('return not practicing if the commit messages are incorrect', async () => {
    containerCtx.practiceContext.projectComponent.repositoryPath = 'https://github.com/octocat/Hello-World';
    new GitHubNock('1', 'octocat', 1, 'Hello-World').getCommits().reply(200, getRepoCommitsResponse);

    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.notPracticing);
  });
});
