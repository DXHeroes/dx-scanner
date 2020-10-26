import { CollaborationInspector } from './CollaborationInspector';
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
import { BitbucketNock } from '../test/helpers/bitbucketNock';
import { PullRequestState } from '.';
import { bitbucketPullRequestResponseFactory } from '../test/factories/responses/bitbucket/prResponseFactory';
import { BitbucketPullRequestState } from '../services/bitbucket/IBitbucketService';
import nock from 'nock';
import { listPullRequestsParamas } from '../services/git/gqlQueries/listPullRequests';
import { gqlPullsResponse } from '../services/git/__MOCKS__/gitHubServiceMockFolder/gqlPullsResponse.mock';

describe('Collaboration Inspector', () => {
  let inspector: CollaborationInspector;
  let containerCtx: TestContainerContext;
  let bitbucketNock: BitbucketNock;

  beforeAll(async () => {
    containerCtx = createTestContainer();
  });

  beforeEach(async () => {
    inspector = <CollaborationInspector>containerCtx.practiceContext.collaborationInspector;
  });

  it('returns paginated pull requests', async () => {
    const pagination = { perPage: 1 };
    const queryBody = {
      query: listPullRequestsParamas,
      variables: {
        owner: 'octocat',
        repo: 'Hello-World',
        count: 1,
        states: ['OPEN', 'MERGED', 'CLOSED'],
      },
    };

    nock('https://api.github.com').post('/graphql', queryBody).reply(200, gqlPullsResponse());

    const response = await inspector.listPullRequests('octocat', 'Hello-World', { pagination });
    expect(response).toMatchObject(getPullsServiceResponse);
  });

  it('returns one pull request', async () => {
    new GitHubNock('583231', 'octocat', 1296269, 'Hello-World').getPull(1, 'closed', 'Edited README via GitHub', '', 'patch-1', 'master');

    const response = await inspector.getPullRequest('octocat', 'Hello-World', 1);
    expect(response).toMatchObject(getPullServiceResponse);
  });

  it('returns pull request files', async () => {
    new GitHubNock('1', 'octocat', 1, 'Hello-World').getRepo('/pulls/1/files').reply(200, getPullsFilesResponse);

    const response = await inspector.listPullRequestFiles('octocat', 'Hello-World', 1);
    expect(response).toMatchObject(getPullsFilesServiceResponse);
  });

  it('return pull request commits', async () => {
    new GitHubNock('1', 'octocat', 1, 'Hello-World').getRepo('/pulls/1/commits').reply(200, getPullCommitsResponse);

    const response = await inspector.listPullCommits('octocat', 'Hello-World', 1);
    expect(response).toMatchObject(getPullCommitsServiceResponse);
  });

  it('returns max number of pull requests', async () => {
    bitbucketNock = new BitbucketNock('pypy', 'pypy');
    containerCtx.container.rebind(Types.IContentRepositoryBrowser).to(BitbucketService);
    const collaborationInspector = containerCtx.container.get<CollaborationInspector>(Types.ICollaborationInspector);
    const mockPr = bitbucketPullRequestResponseFactory({
      state: BitbucketPullRequestState.closed,
    });

    bitbucketNock.getOwnerId();
    bitbucketNock.listPullRequestsResponse([mockPr], {
      pagination: { page: 1, perPage: 5 },
      filter: { state: BitbucketPullRequestState.closed },
    });

    const response = await collaborationInspector.listPullRequests('pypy', 'pypy', {
      pagination: { page: 1, perPage: 5 },
      filter: { state: PullRequestState.closed },
    });

    expect(response.items).toHaveLength(1);
    expect(response.items[0].state).toEqual(BitbucketPullRequestState.closed);
  });

  it('returns pulls diff stat in own interface', async () => {
    bitbucketNock = new BitbucketNock('pypy', 'pypy');
    containerCtx.container.rebind(Types.IContentRepositoryBrowser).to(BitbucketService);
    const collaborationInspector = containerCtx.container.get<CollaborationInspector>(Types.ICollaborationInspector);
    bitbucketNock.getPRsAdditionsAndDeletions(622);

    const response = await collaborationInspector.getPullsDiffStat('pypy', 'pypy', 622);
    expect(response).toMatchObject({ additions: 2, deletions: 1, changes: 3 });
  });
});
