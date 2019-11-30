import { CollaborationInspector } from './CollaborationInspector';
import nock from 'nock';
import { TestContainerContext } from '../inversify.config';
import { createTestContainer } from '../inversify.config';
import { GitHubNock } from '../test/helpers/gitHubNock';
import {
  getPullsServiceResponse,
  getPullServiceResponse,
  getPullsFilesResponse,
  getPullsFilesServiceResponse,
  getPullCommitsResponse,
  getPullCommitsServiceResponse,
} from '../services/git/__MOCKS__/gitHubServiceMockFolder';

describe('Collaboration Inspector', () => {
  let inspector: CollaborationInspector;
  let containerCtx: TestContainerContext;

  beforeAll(async () => {
    containerCtx = createTestContainer();
    inspector = <CollaborationInspector>containerCtx.practiceContext.collaborationInspector;
  });

  beforeEach(() => {
    nock.cleanAll();
  });

  it('returns paginated pull requests', async () => {
    new GitHubNock('1', 'octocat', 1296269, 'Hello-World').getPulls([
      { number: 1347, state: 'open', title: 'new-feature', body: 'Please pull these awesome changes', head: 'new-topic', base: 'master' },
    ]);

    const response = await inspector.getPullRequests('octocat', 'Hello-World');
    expect(response).toMatchObject(getPullsServiceResponse);
  });

  it('returns one pull request', async () => {
    new GitHubNock('583231', 'octocat', 1296269, 'Hello-World').getPull(1, 'closed', 'Edited README via GitHub', '', 'patch-1', 'master');

    const response = await inspector.getPullRequest('octocat', 'Hello-World', 1);
    expect(response).toMatchObject(getPullServiceResponse);
  });

  it('returns pull request files', async () => {
    new GitHubNock('1', 'octocat', 1, 'Hello-World').getRepo('/pulls/1/files').reply(200, getPullsFilesResponse);

    const response = await inspector.getPullRequestFiles('octocat', 'Hello-World', 1);
    expect(response).toMatchObject(getPullsFilesServiceResponse);
  });

  it('return pull request commits', async () => {
    new GitHubNock('1', 'octocat', 1, 'Hello-World').getRepo('/pulls/1/commits').reply(200, getPullCommitsResponse);

    const response = await inspector.getPullCommits('octocat', 'Hello-World', 1);
    expect(response).toMatchObject(getPullCommitsServiceResponse);
  });
});
