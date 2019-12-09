import { IssueTrackingInspector } from './IssueTrackingInspector';
import nock from 'nock';
import { TestContainerContext, createTestContainer } from '../inversify.config';
import { GitHubNock } from '../test/helpers/gitHubNock';
import {
  getIssuesResponse,
  getIssuesServiceResponse,
  getIssueCommentsResponse,
  getIssueCommentsServiceResponse,
  getIssueResponse,
  getIssueServiceResponse,
} from '../services/git/__MOCKS__/gitHubServiceMockFolder';

describe('Issue Tracking Inspector', () => {
  let inspector: IssueTrackingInspector;
  let containerCtx: TestContainerContext;

  beforeAll(async () => {
    containerCtx = createTestContainer();
    inspector = <IssueTrackingInspector>containerCtx.practiceContext.issueTrackingInspector;
  });

  beforeEach(() => {
    nock.cleanAll();
  });

  it('returns paginated issues', async () => {
    new GitHubNock('1', 'octocat', 1, 'Hello-World').getIssues().reply(200, getIssuesResponse);
    const response = await inspector.getIssues('octocat', 'Hello-World');
    expect(response).toMatchObject(getIssuesServiceResponse);
  });

  it('returns paginated issue comments', async () => {
    new GitHubNock('1', 'octocat', 1, 'Hello-World').getRepo('/issues/461030590/comments').reply(200, getIssueCommentsResponse);
    const response = await inspector.listIssueComments('octocat', 'Hello-World', 461030590);
    expect(response).toMatchObject(getIssueCommentsServiceResponse);
  });

  it('returns a single issue', async () => {
    new GitHubNock('1', 'octocat', 1, 'Hello-World').getIssues(1).reply(200, getIssueResponse);
    const response = await inspector.getIssue('octocat', 'Hello-World', 1);
    expect(response).toMatchObject(getIssueServiceResponse);
  });
});
