import { CollaborationInspector } from './CollaborationInspector';
import { getPullsServiceResponse } from '../services/git/__MOCKS__/gitHubServiceMockFolder/getPullsServiceResponse.mock';
import { getPullServiceResponse } from '../services/git/__MOCKS__/gitHubServiceMockFolder/getPullServiceResponse.mock';
import { getPullsFilesResponse } from '../services/git/__MOCKS__/gitHubClientMockFolder/getPullsFiles.mock';
import { getPullsFilesServiceResponse } from '../services/git/__MOCKS__/gitHubServiceMockFolder/getPullFilesServiceResponse.mock';
import { getPullCommitsResponse } from '../services/git/__MOCKS__/gitHubClientMockFolder/getPullsCommitsResponse.mock';
import { getPullCommitsServiceResponse } from '../services/git/__MOCKS__/gitHubServiceMockFolder/getPullCommitsServiceResponse.mock';
import nock from 'nock';
import { TestContainerContext } from '../inversify.config';
import { createTestContainer } from '../inversify.config';
import { GitHubNock } from '../../test/helpers/gitHubNock';

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
    new GitHubNock(1, 'octocat', 1, 'Hello-World').getPulls([
      {
        number: 1347,
        state: 'open',
        title: 'new-feature',
        body: 'Please pull these awesome changes',
        head: { ref: 'new-topic', repo: { id: 1296269, name: 'Hello-World', owner: { id: 1, login: 'octocat' } } },
        base: { ref: 'master', repo: { id: 1296269, name: 'Hello-World', owner: { id: 1, login: 'octocat' } } },
      },
    ]);

    const response = await inspector.getPullRequests('octocat', 'Hello-World');
    expect(response).toMatchObject(getPullsServiceResponse);
  });

  it('returns one pull request', async () => {
    new GitHubNock(1, 'octocat', 1, 'Hello-World').getPull(
      1,
      'closed',
      'Edited README via GitHub',
      '',
      { ref: 'patch-1', repo: { id: 1724195, name: 'Hello-World', owner: { id: 777449, login: 'unoju' } } },
      { ref: 'master', repo: { id: 1296269, name: 'Hello-World', owner: { id: 583231, login: 'octocat' } } },
    );

    const response = await inspector.getPullRequest('octocat', 'Hello-World', 1);
    expect(response).toMatchObject(getPullServiceResponse);
  });

  it('returns pull request files', async () => {
    new GitHubNock(1, 'octocat', 1, 'Hello-World').getRepo('/pulls/1/files').reply(200, getPullsFilesResponse);

    const response = await inspector.getPullRequestFiles('octocat', 'Hello-World', 1);
    expect(response).toMatchObject(getPullsFilesServiceResponse);
  });

  it('return pull request commits', async () => {
    new GitHubNock(1, 'octocat', 1, 'Hello-World').getRepo('/pulls/1/commits').reply(200, getPullCommitsResponse);

    const response = await inspector.getPullCommits('octocat', 'Hello-World', 1);
    expect(response).toMatchObject(getPullCommitsServiceResponse);
  });
});
