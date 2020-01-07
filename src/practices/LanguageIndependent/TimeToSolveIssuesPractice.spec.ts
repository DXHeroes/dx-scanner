import moment from 'moment';
import nock from 'nock';
import { IssueTrackingInspector, Paginated } from '../../inspectors';
import { createTestContainer, TestContainerContext } from '../../inversify.config';
import { PracticeEvaluationResult } from '../../model';
import { BitbucketPullRequestState, BitbucketService } from '../../services';
import { Issue } from '../../services/git/model';
import { BitbucketNock } from '../../test/helpers/bitbucketNock';
import { Types } from '../../types';
import { TimeToSolveIssuesPractice } from './TimeToSolveIssuesPractice';

describe('TimeToSolveIssuesPractice', () => {
  let practice: TimeToSolveIssuesPractice;
  let containerCtx: TestContainerContext;
  let bitbucketNock: BitbucketNock;
  const MockedIssueTrackingInspector = <jest.Mock<IssueTrackingInspector>>(<unknown>IssueTrackingInspector);
  let mockIssueTrackingInspector: IssueTrackingInspector;

  beforeEach(async () => {
    nock.cleanAll();
    bitbucketNock = new BitbucketNock('pypy', 'pypy');
  });

  beforeAll(() => {
    containerCtx = createTestContainer();
    containerCtx.container.bind('TimeToSolveIssuesPractice').to(TimeToSolveIssuesPractice);
    containerCtx.container.rebind(Types.IContentRepositoryBrowser).to(BitbucketService);
    practice = containerCtx.container.get('TimeToSolveIssuesPractice');
    mockIssueTrackingInspector = new MockedIssueTrackingInspector();
  });

  afterEach(async () => {
    containerCtx.virtualFileSystemService.clearFileSystem();
    containerCtx.practiceContext.fileInspector!.purgeCache();
  });

  it('returns practicing if there are open issues updated or created less than 60 days from now', async () => {
    bitbucketNock.getOwnerId();
    bitbucketNock.getApiResponse({ resource: 'pullrequests', state: BitbucketPullRequestState.open });
    const args = { states: BitbucketPullRequestState.open, updatedAt: Date.now() - moment.duration(10, 'days').asMilliseconds() };

    mockIssueTrackingInspector.getIssues = async () => {
      return <Paginated<Issue>>bitbucketNock.mockBitbucketIssuesOrPullRequestsResponse(args);
    };

    const evaluated = await practice.evaluate({
      ...containerCtx.practiceContext,
      issueTrackingInspector: mockIssueTrackingInspector,
    });

    expect(evaluated).toEqual(PracticeEvaluationResult.practicing);
  });

  it('returns practicing if there are open pullrequests updated or created more than 60 days from now', async () => {
    bitbucketNock.getOwnerId();
    bitbucketNock.getApiResponse({ resource: 'pullrequests', state: BitbucketPullRequestState.open });
    const args = { states: BitbucketPullRequestState.open, updatedAt: Date.now() - moment.duration(100, 'days').asMilliseconds() };
    mockIssueTrackingInspector.getIssues = async () => {
      return <Paginated<Issue>>bitbucketNock.mockBitbucketIssuesOrPullRequestsResponse(args);
    };

    const evaluated = await practice.evaluate({
      ...containerCtx.practiceContext,
      issueTrackingInspector: mockIssueTrackingInspector,
    });

    expect(evaluated).toEqual(PracticeEvaluationResult.notPracticing);
  });

  it('returns always true, as it is always applicable', async () => {
    const response = await practice.isApplicable();
    expect(response).toBe(true);
  });

  it('returns unknown if there is no issueTrackingInspector', async () => {
    const evaluated = await practice.evaluate({ ...containerCtx.practiceContext, issueTrackingInspector: undefined });
    expect(evaluated).toEqual(PracticeEvaluationResult.unknown);
  });
});
