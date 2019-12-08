import moment from 'moment';
import nock from 'nock';
import { CollaborationInspector } from '../../inspectors';
import { createTestContainer, TestContainerContext } from '../../inversify.config';
import { PracticeEvaluationResult } from '../../model';
import { BitbucketPullRequestState } from '../../services';
import { BitbucketNock } from '../../test/helpers/bitbucketNock';
import { TimeToSolvePractice } from './TimeToSolvePractice';

describe('TimeToSolvePractice', () => {
  let practice: TimeToSolvePractice;
  let containerCtx: TestContainerContext;
  let bitbucketNock: BitbucketNock;
  const MockedCollaborationInspector = <jest.Mock<CollaborationInspector>>(<unknown>CollaborationInspector);
  let mockCollaborationInspector: CollaborationInspector;

  beforeEach(async () => {
    nock.cleanAll();
    bitbucketNock = new BitbucketNock('pypy', 'pypy');
  });

  beforeAll(() => {
    const args = { uri: 'https://bitbucket.org/pypy/pypy' };
    containerCtx = createTestContainer(args);
    containerCtx.container.bind('TimeToSolvePractice').to(TimeToSolvePractice);
    practice = containerCtx.container.get('TimeToSolvePractice');
    mockCollaborationInspector = new MockedCollaborationInspector();
  });

  afterEach(async () => {
    containerCtx.virtualFileSystemService.clearFileSystem();
    containerCtx.practiceContext.fileInspector!.purgeCache();
  });

  it('returns practicing if there are open pullrequests updated or created less than 30 days from now', async () => {
    nock(bitbucketNock.url)
      .get('/users/pypy')
      .reply(200);
    bitbucketNock.getApiResponse('pullrequests', undefined, undefined, BitbucketPullRequestState.open);
    const args = { states: BitbucketPullRequestState.open, updatedAt: Date.now() - moment.duration(10, 'days').asMilliseconds() };
    mockCollaborationInspector.getPullRequests = async () => {
      return bitbucketNock.mockBitbucketPullRequestsResponse(args);
    };

    const evaluated = await practice.evaluate({
      ...containerCtx.practiceContext,
      collaborationInspector: mockCollaborationInspector,
    });

    expect(evaluated).toEqual(PracticeEvaluationResult.practicing);
  });

  it('returns practicing if there are open pullrequests updated or created more than 30 days from now', async () => {
    nock(bitbucketNock.url)
      .get('/users/pypy')
      .reply(200);
    bitbucketNock.getApiResponse('pullrequests', undefined, undefined, BitbucketPullRequestState.open);
    const args = { states: BitbucketPullRequestState.open, updatedAt: Date.now() - moment.duration(100, 'days').asMilliseconds() };
    mockCollaborationInspector.getPullRequests = async () => {
      return bitbucketNock.mockBitbucketPullRequestsResponse(args);
    };

    const evaluated = await practice.evaluate({
      ...containerCtx.practiceContext,
      collaborationInspector: mockCollaborationInspector,
    });

    expect(evaluated).toEqual(PracticeEvaluationResult.notPracticing);
  });

  it('returns practicing if there are no open pullrequest', async () => {
    mockCollaborationInspector.getPullRequests = async () => {
      return bitbucketNock.mockBitbucketPullRequestsResponse({});
    };

    const evaluated = await practice.evaluate({
      ...containerCtx.practiceContext,
      collaborationInspector: mockCollaborationInspector,
    });
    expect(evaluated).toEqual(PracticeEvaluationResult.practicing);
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
