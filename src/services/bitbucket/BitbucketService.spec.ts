//import { BitbucketNock } from "../../../test/helpers/bibucketNock";
/* eslint-disable @typescript-eslint/camelcase */
// import { GitHubService } from './GitHubService';
// import { getPullsServiceResponse } from './__MOCKS__/gitHubServiceMockFolder/getPullsServiceResponse.mock';
// import { getPullsReviewsServiceResponse } from './__MOCKS__/gitHubServiceMockFolder/getPullsReviewsServiceResponse.mock';
// import { getCommitServiceResponse } from './__MOCKS__/gitHubServiceMockFolder/getCommitServiceResponse.mock';
// import { getContributorsServiceResponse } from './__MOCKS__/gitHubServiceMockFolder/getContributorsServiceResponse.mock';
// import { getContributorsStatsServiceResponse } from './__MOCKS__/gitHubServiceMockFolder/getContributorsStatsServiceResponse.mock';
// import {
//   getRepoContentServiceResponseDir,
//   getRepoContentServiceResponseFile,
// } from './__MOCKS__/gitHubServiceMockFolder/getRepoContentServiceResponse.mock';
// import { getIssuesServiceResponse } from './__MOCKS__/gitHubServiceMockFolder/getIssuesServiceResponse.mock';
// import { getPullRequestsReviewsResponse } from './__MOCKS__/gitHubServiceMockFolder/getPullRequestsReviewsResponse.mock';
// import { getCommitResponse } from './__MOCKS__/gitHubServiceMockFolder/getCommitResponse.mock';
// import { getContributorsStatsResponse } from './__MOCKS__/gitHubServiceMockFolder/getContributorsStatsResponse.mock';
// import { getIssuesResponse } from './__MOCKS__/gitHubServiceMockFolder/getIssuesResponse.mock';
// import { getIssueCommentsResponse } from './__MOCKS__/gitHubServiceMockFolder/getIssueCommentsResponse.mock';
// import { getIssueCommentsServiceResponse } from './__MOCKS__/gitHubServiceMockFolder/getIssueCommentsServiceResponse.mock';
import nock from 'nock';
import {
  getIssuesResponse,
  getPullCommits,
  getPullRequestResponse,
  /*BitbucketNock,*/ getPullRequestsResponse,
  getIssueResponse,
  getIssueCommentsResponse,
} from '../../../test/helpers/bibucketNock';
import { BitbucketService } from './BitbucketService';

// import { getPullsFilesResponse } from './__MOCKS__/gitHubServiceMockFolder/getPullsFiles.mock';
// import { getPullsFilesServiceResponse } from './__MOCKS__/gitHubServiceMockFolder/getPullFilesServiceResponse.mock';
// import { getPullCommitsResponse } from './__MOCKS__/gitHubServiceMockFolder/getPullsCommitsResponse.mock';
// import { getPullCommitsServiceResponse } from './__MOCKS__/gitHubServiceMockFolder/getPullCommitsServiceResponse.mock';
// import { BitbucketNock } from '../../../test/helpers/BitbucketNock';
// import { GitHubPullRequestState } from './IGitHubService';
// import { getRepoCommitsResponse } from './__MOCKS__/gitHubServiceMockFolder/getRepoCommitsResponse.mock';
// import { File } from './model';

describe('Bitbucket Service', () => {
  let service: BitbucketService;

  beforeEach(async () => {
    service = new BitbucketService({ uri: '.' });
    nock.cleanAll();
  });

  describe('#getPullRequests', () => {
    it('returns pull requests in own interface', async () => {
      // new BitbucketNock(1, 'atlassian', 1, 'bitbucketjs').getPulls([
      //   {
      //     number: 1347,
      //     state: 'undefined',
      //   },
      // ]);

      const response = await service.getPullRequests('atlassian', 'bitbucketjs');
      expect(response).toMatchObject(getPullRequestsResponse);

      // const bitbucketNock = nock('https://api.bitbucket.org/2.0');
      // bitbucketNock.get('/repositories/atlassian/bitbucketjs/pullrequests').reply(200, reply);
      // const response = await service.getPullRequests('atlassian', 'bitbucketjs');
      // console.log(response);
      // expect(reply).toEqual(response);
    });

    it('returns pull request in own interface', async () => {
      const response = await service.getPullRequest('pypy', 'pypy', 1);
      expect(response).toMatchObject(getPullRequestResponse);
    });

    it('returns pullrequest commits in own interface', async () => {
      const response = await service.getPullCommits('pypy', 'pypy', 622);
      expect(response).toMatchObject(getPullCommits);
    });

    it('returns issues in own interface', async () => {
      const response = await service.getIssues('pypy', 'pypy');
      expect(response).toMatchObject(getIssuesResponse);
    });

    it('returns issue in own interface', async () => {
      const response = await service.getIssue('pypy', 'pypy', 3086);
      expect(response).toMatchObject(getIssueResponse);
    });

    it('returns issue comments in own interface', async () => {
      const response = await service.getIssueComments('pypy', 'pypy', 3086);
      if (response.items !== undefined) {
        for (const item of response.items) {
          console.log(item.body);
        }
      }
      //expect(response).toMatchObject(getIssueCommentsResponse);
    });
  });
});
