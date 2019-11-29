import nock from 'nock';
import { CollaborationInspector } from '../../inspectors/CollaborationInspector';
import { createTestContainer, TestContainerContext } from '../../inversify.config';
import { PracticeEvaluationResult } from '../../model';
import { getRepoCommitsServiceResponse } from '../../services/git/__MOCKS__/gitHubServiceMockFolder/getRepoCommitsServiceResponse.mock';
import { CorrectCommitMessagesPractice } from './CorrectCommitMessages';

describe('CorrectCommitMessages', () => {
  let practice: CorrectCommitMessagesPractice;
  let containerCtx: TestContainerContext;
  const MockedCollaborationInspector = <jest.Mock<CollaborationInspector>>(<unknown>CollaborationInspector);
  let mockCollaborationInspector: CollaborationInspector;

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

  it('return practicing if the commit messages are correct', async () => {
    mockCollaborationInspector.getRepoCommits = async () => {
      getRepoCommitsServiceResponse.items.forEach((item) => {
        item.message = 'fix: correct commit message';
      });
      return getRepoCommitsServiceResponse;
    };

    const evaluated = await practice.evaluate({
      ...containerCtx.practiceContext,
      collaborationInspector: mockCollaborationInspector,
    });
    expect(evaluated).toEqual(PracticeEvaluationResult.practicing);
  });

  it('return not practicing if the commit messages are incorrect', async () => {
    mockCollaborationInspector.getRepoCommits = async () => {
      getRepoCommitsServiceResponse.items.forEach((item) => {
        item.message = 'Incorrect commit message';
      });
      return getRepoCommitsServiceResponse;
    };

    const evaluated = await practice.evaluate({
      ...containerCtx.practiceContext,
      collaborationInspector: mockCollaborationInspector,
    });
    expect(evaluated).toEqual(PracticeEvaluationResult.notPracticing);
  });
});
