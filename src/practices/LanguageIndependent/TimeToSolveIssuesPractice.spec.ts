import moment from 'moment';
import { IssueTrackingInspector } from '../../inspectors';
import { createTestContainer, TestContainerContext } from '../../inversify.config';
import { PracticeEvaluationResult } from '../../model';
import { BitbucketService } from '../../services';
import { getIssuesResponse } from '../../services/git/__MOCKS__/bitbucketServiceMockFolder/getIssuesResponse';
import { Types } from '../../types';
import { TimeToSolveIssuesPractice } from './TimeToSolveIssuesPractice';
import { getIssueResponse } from '../../services/git/__MOCKS__/bitbucketServiceMockFolder';
import { BitbucketPullRequestState } from '../../services/bitbucket/IBitbucketService';

describe('TimeToSolveIssuesPractice', () => {
  let practice: TimeToSolveIssuesPractice;
  let containerCtx: TestContainerContext;
  const MockedIssueTrackingInspector = <jest.Mock<IssueTrackingInspector>>(<unknown>IssueTrackingInspector);
  let mockIssueTrackingInspector: IssueTrackingInspector;

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
    mockIssueTrackingInspector.listIssues = async () => {
      return getIssuesResponse([
        getIssueResponse({
          state: BitbucketPullRequestState.open,
          updatedAt: moment().subtract(7, 'd').format('YYYY-MM-DDTHH:mm:ss.SSSSSSZ'),
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
    mockIssueTrackingInspector.listIssues = async () => {
      return getIssuesResponse([
        getIssueResponse({
          state: 'new',
          updatedAt: moment().subtract(61, 'd').format('YYYY-MM-DDTHH:mm:ss.SSSSSSZ'),
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

  it('throw error if there is no issueTrackingInspector', async () => {
    await expect(practice.evaluate({ ...containerCtx.practiceContext, issueTrackingInspector: undefined })).rejects.toThrow(
      'You probably provided bad acess token to your repository or did not provided at all.',
    );
  });
});
