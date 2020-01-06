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
import { Types } from '../types';
import { BitbucketService } from '../services';
import { PullRequestState } from './ICollaborationInspector';
import { TIMEOUT } from 'dns';

describe('Collaboration Inspector', () => {
  let inspector: CollaborationInspector;
  let containerCtx: TestContainerContext;

  beforeAll(async () => {
    containerCtx = createTestContainer();
    inspector = <CollaborationInspector>containerCtx.practiceContext.collaborationInspector;
    // containerCtx.container.rebind(Types.IContentRepositoryBrowser).to(BitbucketService);

  });

  beforeEach(() => {
    inspector = <CollaborationInspector>containerCtx.practiceContext.collaborationInspector;
    nock.cleanAll();
  });

  it('returns paginated pull requests', async () => {
    new GitHubNock('1', 'octocat', 1296269, 'Hello-World').getPulls({
      pulls: [
        { number: 1347, state: 'open', title: 'new-feature', body: 'Please pull these awesome changes', head: 'new-topic', base: 'master' },
      ],
    });

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

  it.only('returns max number of pull requests', async () => {
    //const response = await inspector.getAllPullRequests('octocat', 'Hello-World');
    containerCtx.container.rebind(Types.IContentRepositoryBrowser).to(BitbucketService);
    const collaborationInspector = containerCtx.container.get<CollaborationInspector>(Types.ICollaborationInspector);

    const response = await collaborationInspector.getPullRequests('pypy', 'pypy', {
     maxNumberOfPullRequests: 1,
      
      // filter: { state: PullRequestState.open },
    });

    console.log(response);
    expect(response).toEqual('');




  }, 20000);
});
