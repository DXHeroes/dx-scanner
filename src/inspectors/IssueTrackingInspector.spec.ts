import { IssueTrackingInspector } from './IssueTrackingInspector';
import { getIssuesResponse } from '../services/git/__MOCKS__/gitHubClientMockFolder/getIssuesResponse.mock';
import { getIssuesServiceResponse } from '../services/git/__MOCKS__/gitHubServiceMockFolder/getIssuesServiceResponse.mock';
import { getIssueCommentsServiceResponse } from '../services/git/__MOCKS__/gitHubServiceMockFolder/getIssueCommentsServiceResponse.mock';
import { getIssueCommentsResponse } from '../services/git/__MOCKS__/gitHubClientMockFolder/getIssueCommentsResponse.mock';
import { getIssueResponse } from '../services/git/__MOCKS__/gitHubClientMockFolder/getIssueResponse.mock';
import { getIssueServiceResponse } from '../services/git/__MOCKS__/gitHubServiceMockFolder/getIssueServiceResponse.mock';
import nock from 'nock';
import { TestContainerContext, createTestContainer } from '../inversify.config';

describe('Issue Tracking Inspector', () => {
  let inspector: IssueTrackingInspector;
  const gitHubNock = nock('https://api.github.com');
  let containerCtx: TestContainerContext;

  beforeAll(async () => {
    containerCtx = createTestContainer();
    inspector = <IssueTrackingInspector>containerCtx.practiceContext.issueTrackingInspector;
  });

  it('returns paginated issues', async () => {
    gitHubNock.get('/repos/octocat/Hello-World/issues').reply(200, getIssuesResponse);
    const response = await inspector.getIssues('octocat', 'Hello-World');
    expect(response).toMatchObject(getIssuesServiceResponse);
  });

  it('returns paginated issue comments', async () => {
    gitHubNock.get('/repos/octocat/Hello-World/issues/461030590/comments').reply(200, getIssueCommentsResponse);
    const response = await inspector.listIssueComments('octocat', 'Hello-World', 461030590);
    expect(response).toMatchObject(getIssueCommentsServiceResponse);
  });

  it('returns a single issue', async () => {
    gitHubNock.get('/repos/octocat/Hello-World/issues/1').reply(200, getIssueResponse);
    const response = await inspector.getIssue('octocat', 'Hello-World', 1);
    expect(response).toMatchObject(getIssueServiceResponse);
  });
});
