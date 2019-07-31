import { CollaborationInspector } from './CollaborationInspector';
import { GitHubService } from '../services/git/GitHubService';
import { GitHubClient } from '../services/git/GitHubClient';
import { getPullsServiceResponse } from '../services/git/__MOCKS__/gitHubServiceMockFolder/getPullsServiceResponse.mock';
import { getPullsRequestsResponse } from '../services/git/__MOCKS__/gitHubClientMockFolder/getPullsRequestsResponse.mock';
import { getPullServiceResponse } from '../services/git/__MOCKS__/gitHubServiceMockFolder/getPullServiceResponse.mock';
import { getPullsFilesResponse } from '../services/git/__MOCKS__/gitHubClientMockFolder/getPullsFiles.mock';
import { getPullsFilesServiceResponse } from '../services/git/__MOCKS__/gitHubServiceMockFolder/getPullFilesServiceResponse.mock';
import { getPullCommitsResponse } from '../services/git/__MOCKS__/gitHubClientMockFolder/getPullsCommitsResponse.mock';
import { getPullCommitsServiceResponse } from '../services/git/__MOCKS__/gitHubServiceMockFolder/getPullCommitsServiceResponse.mock';
import { getPullRequestResponse } from '../services/git/__MOCKS__/gitHubServiceMockFolder/getPullRequestsResponse.mock';
import nock from 'nock';
import { TestContainerContext } from '../inversify.config';
import { createTestContainer } from '../inversify.config';

describe('Collaboration Inspector', () => {
  let inspector: CollaborationInspector;
  const gitHubNock = nock('https://api.github.com');
  let containerCtx: TestContainerContext;

  beforeAll(async () => {
    containerCtx = createTestContainer();
    inspector = <CollaborationInspector>containerCtx.practiceContext.collaborationInspector;
  });

  it('returns paginated pull requests', async () => {
    gitHubNock.get('/repos/octocat/Hello-World/pulls').reply(200, getPullsRequestsResponse);

    const response = await inspector.getPullRequests('octocat', 'Hello-World');
    expect(response).toMatchObject(getPullsServiceResponse);
  });

  it('returns one pull request', async () => {
    gitHubNock.get('/repos/octocat/Hello-World/pulls/1').reply(200, getPullRequestResponse);

    const response = await inspector.getPullRequest('octocat', 'Hello-World', 1);
    expect(response).toMatchObject(getPullServiceResponse);
  });

  it('returns pull request files', async () => {
    gitHubNock.get('/repos/octocat/Hello-World/pulls/1/files').reply(200, getPullsFilesResponse);

    const response = await inspector.getPullRequestFiles('octocat', 'Hello-World', 1);
    expect(response).toMatchObject(getPullsFilesServiceResponse);
  });

  it('return pull request commits', async () => {
    gitHubNock.get('/repos/octocat/Hello-World/pulls/1/commits').reply(200, getPullCommitsResponse);

    const response = await inspector.getPullCommits('octocat', 'Hello-World', 1);
    expect(response).toMatchObject(getPullCommitsServiceResponse);
  });
});
