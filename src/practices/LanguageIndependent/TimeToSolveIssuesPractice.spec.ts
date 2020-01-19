import moment from 'moment';
import nock from 'nock';
import { IssueTrackingInspector } from '../../inspectors';
import { createTestContainer, TestContainerContext } from '../../inversify.config';
import { PracticeEvaluationResult } from '../../model';
import { BitbucketPullRequestState, BitbucketService } from '../../services';
import { getIssuesResponse } from '../../services/git/__MOCKS__/bitbucketServiceMockFolder/getIssuesResponse';
import { Types } from '../../types';
import { TimeToSolveIssuesPractice } from './TimeToSolveIssuesPractice';
import { getIssueResponse } from '../../services/git/__MOCKS__/bitbucketServiceMockFolder';

describe('TimeToSolveIssuesPractice', () => {
  let practice: TimeToSolveIssuesPractice;
  let containerCtx: TestContainerContext;
  const MockedIssueTrackingInspector = <jest.Mock<IssueTrackingInspector>>(<unknown>IssueTrackingInspector);
  let mockIssueTrackingInspector: IssueTrackingInspector;

  beforeEach(async () => {
    nock.cleanAll();
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
    mockIssueTrackingInspector.getIssues = async () => {
      return getIssuesResponse([
        getIssueResponse({
          state: BitbucketPullRequestState.open,
          updatedAt: moment()
            .subtract(7, 'd')
            .format('YYYY-MM-DDTHH:mm:ss.SSSSSSZ'),
        }),
      ]);
    };

    const evaluated = await practice.evaluate({
      ...containerCtx.practiceContext,
      issueTrackingInspector: mockIssueTrackingInspector,
    });

    expect(evaluated).toEqual(PracticeEvaluationResult.practicing);
  });

  it('returns practicing if there are open issues updated or created more than 60 days from now', async () => {
    mockIssueTrackingInspector.getIssues = async () => {
      return getIssuesResponse([
        getIssueResponse({
          state: 'new',
          updatedAt: moment()
            .subtract(61, 'd')
            .format('YYYY-MM-DDTHH:mm:ss.SSSSSSZ'),
        }),
      ]);
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
