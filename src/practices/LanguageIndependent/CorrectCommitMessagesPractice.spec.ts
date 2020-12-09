import { CollaborationInspector } from '../../inspectors/CollaborationInspector';
import { createTestContainer, TestContainerContext } from '../../inversify.config';
import { PracticeEvaluationResult } from '../../model';
import { getRepoCommitsServiceResponse } from '../../services/git/__MOCKS__/gitHubServiceMockFolder/getRepoCommitsServiceResponse.mock';
import { CorrectCommitMessagesPractice } from './CorrectCommitMessagesPractice';
import { Paginated } from '../../inspectors/common/Paginated';
import { Commit } from '../../services/git/model';
import _ from 'lodash';
import { listRepoCommits } from '../../services/git/__MOCKS__/gitLabServiceMockFolder/listRepoCommitsResponse';

describe('CorrectCommitMessagesPractice', () => {
  let practice: CorrectCommitMessagesPractice;
  let containerCtx: TestContainerContext;
  const MockedCollaborationInspector = <jest.Mock<CollaborationInspector>>(<unknown>CollaborationInspector);
  let mockCollaborationInspector: CollaborationInspector;

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

  it('commit message without scope', async () => {
    mockCollaborationInspector.listRepoCommits = async () => {
      return changeRepoCommitsMessages('fix: correct commit message');
    };

    const evaluated = await practice.evaluate({
      ...containerCtx.practiceContext,
      collaborationInspector: mockCollaborationInspector,
    });
    expect(evaluated).toEqual(PracticeEvaluationResult.practicing);
  });

  it('commit message with scope', async () => {
    mockCollaborationInspector.listRepoCommits = async () => {
      return changeRepoCommitsMessages('fix(something): correct commit message');
    };

    const evaluated = await practice.evaluate({
      ...containerCtx.practiceContext,
      collaborationInspector: mockCollaborationInspector,
    });
    expect(evaluated).toEqual(PracticeEvaluationResult.practicing);
  });

  it('commit message with scope, body and signature', async () => {
    const cMsg = `fix(something): correct commit message\n\nCo-Authored-By: Prokop Simek <prokopsimek@users.noreply.github.com>`;

    mockCollaborationInspector.listRepoCommits = async () => {
      return changeRepoCommitsMessages(cMsg);
    };

    const evaluated = await practice.evaluate({
      ...containerCtx.practiceContext,
      collaborationInspector: mockCollaborationInspector,
    });
    expect(evaluated).toEqual(PracticeEvaluationResult.practicing);
  });

  it('returns not practicing if more than 20% of commit messages are incorrect', async () => {
    mockCollaborationInspector.listRepoCommits = async () => {
      return listRepoCommits([
        changeRepoCommitsMessages('fix(something): correct commit message').items[0],
        ...changeRepoCommitsMessages('foo: some wrong message').items,
      ]);
    };

    const evaluated = await practice.evaluate({
      ...containerCtx.practiceContext,
      collaborationInspector: mockCollaborationInspector,
    });
    expect(evaluated).toEqual(PracticeEvaluationResult.notPracticing);
  });

  it('the commit message has wrong type and is too long', async () => {
    mockCollaborationInspector.listRepoCommits = async () => {
      return changeRepoCommitsMessages('foo: some message some message some message some message some message some message');
    };

    const evaluated = await practice.evaluate({
      ...containerCtx.practiceContext,
      collaborationInspector: mockCollaborationInspector,
    });
    expect(evaluated).toEqual(PracticeEvaluationResult.notPracticing);
  });

  it('returns unknown if there is no collaborationInspector', async () => {
    const evaluated = await practice.evaluate({ ...containerCtx.practiceContext, collaborationInspector: undefined });
    expect(evaluated).toEqual(PracticeEvaluationResult.unknown);
  });

  it('returns always true, as it is always applicable', async () => {
    const response = await practice.isApplicable();
    expect(response).toBe(true);
  });

  const changeRepoCommitsMessages = (message: string) => {
    const paginatedRepoCommits: Paginated<Commit> = {
      items: getRepoCommitsServiceResponse.items,
      hasNextPage: true,
      hasPreviousPage: false,
      page: 1,
      perPage: getRepoCommitsServiceResponse.items.length,
      totalCount: getRepoCommitsServiceResponse.items.length,
    };
    if (getRepoCommitsServiceResponse.items.length > 1) {
      const repoCommits: Commit[] = _.cloneDeep(getRepoCommitsServiceResponse.items);
      repoCommits.forEach((repoCommit) => {
        repoCommit.message = message;
        repoCommits.push(repoCommit);
      });

      paginatedRepoCommits.items = repoCommits;
    } else {
      getRepoCommitsServiceResponse.items[0].message = message;
    }
    return paginatedRepoCommits;
  };
});
