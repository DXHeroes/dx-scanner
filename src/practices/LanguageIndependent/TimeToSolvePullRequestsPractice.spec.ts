import moment from 'moment';
import nock from 'nock';
import { CollaborationInspector } from '../../inspectors';
import { createTestContainer, TestContainerContext } from '../../inversify.config';
import { PracticeEvaluationResult } from '../../model';
import { BitbucketPullRequestState, BitbucketService } from '../../services';
import { BitbucketNock } from '../../test/helpers/bitbucketNock';
import { TimeToSolvePullRequestsPractice } from './TimeToSolvePullRequestsPractice';
import { Types } from '../../types';
import { getPullRequestsResponse } from '../../services/git/__MOCKS__/bitbucketServiceMockFolder/getPullRequestsResponse';
import { getPullRequestResponse } from '../../services/git/__MOCKS__/bitbucketServiceMockFolder';

describe('TimeToSolvePullRequestsPractice', () => {
  let practice: TimeToSolvePullRequestsPractice;
  let containerCtx: TestContainerContext;
  let bitbucketNock: BitbucketNock;
  const MockedCollaborationInspector = <jest.Mock<CollaborationInspector>>(<unknown>CollaborationInspector);
  let mockCollaborationInspector: CollaborationInspector;

  beforeEach(async () => {
    nock.cleanAll();
    bitbucketNock = new BitbucketNock('pypy', 'pypy');
  });

  beforeAll(() => {
    containerCtx = createTestContainer();
    containerCtx.container.bind('TimeToSolvePractice').to(TimeToSolvePullRequestsPractice);
    containerCtx.container.rebind(Types.IContentRepositoryBrowser).to(BitbucketService);
    practice = containerCtx.container.get('TimeToSolvePractice');
    mockCollaborationInspector = new MockedCollaborationInspector();
  });

  afterEach(async () => {
    containerCtx.virtualFileSystemService.clearFileSystem();
    containerCtx.practiceContext.fileInspector!.purgeCache();
  });

  it('returns practicing if there are open pullrequests updated or created less than 10 days from now', async () => {
    mockCollaborationInspector.getPullRequests = async () => {
      return getPullRequestsResponse([
        getPullRequestResponse({
          state: BitbucketPullRequestState.open,
          updatedAt: moment()
            .subtract(7, 'd')
            .format('YYYY-MM-DDTHH:mm:ss.SSSSSSZ'),
        }),
      ]);
    };

    const evaluated = await practice.evaluate({
      ...containerCtx.practiceContext,
      collaborationInspector: mockCollaborationInspector,
    });

    expect(evaluated).toEqual(PracticeEvaluationResult.practicing);
  });

  it('returns practicing if there are open pullrequests updated or created more than 100 days from now', async () => {
    mockCollaborationInspector.getPullRequests = async () => {
      return getPullRequestsResponse([
        getPullRequestResponse({
          state: BitbucketPullRequestState.open,
          updatedAt: moment()
            .subtract(100, 'd')
            .format('YYYY-MM-DDTHH:mm:ss.SSSSSSZ'),
        }),
      ]);
    };

    const evaluated = await practice.evaluate({
      ...containerCtx.practiceContext,
      collaborationInspector: mockCollaborationInspector,
    });

    expect(evaluated).toEqual(PracticeEvaluationResult.notPracticing);
  });

  it('returns always true, as it is always applicable', async () => {
    const response = await practice.isApplicable();
    expect(response).toBe(true);
  });

  it('returns unknown if there is no collaborationInspector', async () => {
    const evaluated = await practice.evaluate({ ...containerCtx.practiceContext, collaborationInspector: undefined });
    expect(evaluated).toEqual(PracticeEvaluationResult.unknown);
  });
});
