import { PullRequestState } from '../../inspectors';
import { argumentsProviderFactory } from '../../test/factories/ArgumentsProviderFactory';
import { gitLabPullRequestResponseFactory } from '../../test/factories/responses/gitLab/prResponseFactory';
import { GitLabNock } from '../../test/helpers/gitLabNock';
import { GitLabService } from './GitLabService';
import { GitLabPullRequestState } from './IGitLabService';
import util from 'util';
import { listPullRequestsResponse } from '../git/__MOCKS__/gitLabServiceMockFolder/listPullRequestsResponse';
import { getPullRequestResponse } from '../git/__MOCKS__/gitLabServiceMockFolder/getPullRequestResponse';

describe('GitLab Service', () => {
  let service: GitLabService;
  let gitLabNock: GitLabNock;

  beforeEach(async () => {
    service = new GitLabService(argumentsProviderFactory({ uri: 'https://gitlab.com/gitlab-org/gitlab' }));
    gitLabNock = new GitLabNock('gitlab-org', 'gitlab');
  });

  it('Returns list of merge requests in own interface', async () => {
    jest.setTimeout(100000);

    const mockPr = gitLabPullRequestResponseFactory();

    gitLabNock.getGroupInfo();
    gitLabNock.listPullRequestsResponse([mockPr], { filter: { state: GitLabPullRequestState.open } });

    const response = await service.listPullRequests('gitlab-org', 'gitlab', { filter: { state: PullRequestState.open } });
    expect(response).toMatchObject(listPullRequestsResponse());
  });

  it('Returns one pull request in own interface', async () => {
    jest.setTimeout(100000);

    const mockPr = gitLabPullRequestResponseFactory();

    gitLabNock.getPullRequestResponse(mockPr, 25985);
    gitLabNock.getGroupInfo();

    const response = await service.getPullRequest('gitlab-org', 'gitlab', 25985);
    expect(response).toMatchObject(getPullRequestResponse());
  });
});
