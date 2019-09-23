//import { BitbucketNock } from "../../../test/helpers/bibucketNock";
import { BitbucketService } from "./BitbucketService";

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
// import { getPullsFilesResponse } from './__MOCKS__/gitHubServiceMockFolder/getPullsFiles.mock';
// import { getPullsFilesServiceResponse } from './__MOCKS__/gitHubServiceMockFolder/getPullFilesServiceResponse.mock';
// import { getPullCommitsResponse } from './__MOCKS__/gitHubServiceMockFolder/getPullsCommitsResponse.mock';
// import { getPullCommitsServiceResponse } from './__MOCKS__/gitHubServiceMockFolder/getPullCommitsServiceResponse.mock';
// import { BitbucketNock } from '../../../test/helpers/BitbucketNock';
// import { GitHubPullRequestState } from './IGitHubService';
// import { getRepoCommitsResponse } from './__MOCKS__/gitHubServiceMockFolder/getRepoCommitsResponse.mock';
// import { File } from './model';

describe('GitHub Service', () => {
    let service: BitbucketService;

    beforeEach(async () => {
        service = new BitbucketService({ uri: '.' });
        nock.cleanAll();
    });

    describe('#getPullRequests', () => {
        it('', async () => {
            const response = await service.getPullRequests('pypy', 'pypy');
            console.log(response);
        })
    })
    // it('purges the cache', async () => {
    //   new BitbucketNock(1, 'octocat', 1, 'Hello-World').getFile('README', 'before', undefined, false);
    //   await service.getRepoContent('octocat', 'Hello-World', 'README');

    //   service.purgeCache();

    //   new BitbucketNock(1, 'octocat', 1, 'Hello-World').getFile('README', 'after');
    //   const response = await service.getRepoContent('octocat', 'Hello-World', 'README');
    //   expect(((response as unknown) as File).content).toEqual('YWZ0ZXI=');
    // });

    //     it('returns pulls in own interface', async () => {
    //       new BitbucketNock(1, 'octocat', 1296269, 'Hello-World').getPulls([
    //         { number: 1347, state: 'open', title: 'new-feature', body: 'Please pull these awesome changes', head: 'new-topic', base: 'master' },
    //       ]);

    //       const response = await service.getPullRequests('octocat', 'Hello-World');
    //       expect(response).toMatchObject(getPullsServiceResponse);
    //     });

    //     it('returns open pulls by default', async () => {
    //       new BitbucketNock(1, 'octocat', 1296269, 'Hello-World').getPulls([
    //         { number: 1347, state: 'open', title: 'new-feature', body: 'Please pull these awesome changes', head: 'new-topic', base: 'master' },
    //       ]);

    //       const response = await service.getPullRequests('octocat', 'Hello-World');
    //       expect(response.items.map((item) => item.state)).toMatchObject(['open']);
    //     });

    //     it('returns open pulls', async () => {
    //       new BitbucketNock(1, 'octocat', 1296269, 'Hello-World').getPulls(
    //         [{ number: 1347, state: 'open', title: 'new-feature', body: '', head: 'new-topic', base: 'master' }],
    //         'open',
    //       );

    //       const response = await service.getPullRequests('octocat', 'Hello-World', { filter: { state: GitHubPullRequestState.open } });
    //       expect(response.items.map((item) => item.state)).toMatchObject(['open']);
    //     });

    //     it('returns closed pulls', async () => {
    //       new BitbucketNock(1, 'octocat', 1296269, 'Hello-World').getPulls(
    //         [{ number: 1347, state: 'closed', title: 'new-feature', body: '', head: 'new-topic', base: 'master' }],
    //         'closed',
    //       );

    //       const response = await service.getPullRequests('octocat', 'Hello-World', { filter: { state: GitHubPullRequestState.closed } });
    //       expect(response.items.map((item) => item.state)).toMatchObject(['closed']);
    //     });

    //     it('returns all pulls', async () => {
    //       new BitbucketNock(1, 'octocat', 1296269, 'Hello-World').getPulls(
    //         [
    //           { number: 1347, state: 'open', title: 'new-feature', body: '', head: 'new-topic', base: 'master' },
    //           { number: 1348, state: 'closed', title: 'new-feature', body: '', head: 'new-topic', base: 'master' },
    //         ],
    //         'all',
    //       );

    //       const response = await service.getPullRequests('octocat', 'Hello-World', { filter: { state: GitHubPullRequestState.all } });
    //       expect(response.items.map((item) => item.state)).toMatchObject(['open', 'closed']);
    //     });
    //   });

    //   it('returns pull request reviews in own interface', async () => {
    //     new BitbucketNock(1, 'octocat', 1, 'Hello-World').getRepo('/pulls/1/reviews').reply(200, getPullRequestsReviewsResponse);

    //     const response = await service.getPullRequestReviews('octocat', 'Hello-World', 1);
    //     expect(response).toMatchObject(getPullsReviewsServiceResponse);
    //   });

    //   it('returns commits in own interface', async () => {
    //     new BitbucketNock(1, 'octocat', 1, 'Hello-World').getCommits().reply(200, getRepoCommitsResponse);
    //     const response = await service.getRepoCommits('octocat', 'Hello-World');

    //     expect(response.data).toMatchObject(getRepoCommitsResponse);
    //   });

    //   it('returns commits in own interface', async () => {
    //     new BitbucketNock(1, 'octocat', 1, 'Hello-World').getGitCommits('762941318ee16e59dabbacb1b4049eec22f0d303').reply(200, getCommitResponse);

    //     const response = await service.getCommit('octocat', 'Hello-World', '762941318ee16e59dabbacb1b4049eec22f0d303');
    //     expect(response).toMatchObject(getCommitServiceResponse);
    //   });

    //   it('returns contributors in own interface', async () => {
    //     new BitbucketNock(1, 'octocat', 1, 'Hello-World').getContributors([{ id: 251370, login: 'Spaceghost' }, { id: 583231, login: 'octocat' }]);

    //     const response = await service.getContributors('octocat', 'Hello-World');
    //     expect(response).toMatchObject(getContributorsServiceResponse);
    //   });

    //   it('returns contributor stats in own interface', async () => {
    //     new BitbucketNock(1, 'octocat', 1, 'Hello-World').getRepo('/stats/contributors').reply(200, getContributorsStatsResponse);

    //     const response = await service.getContributorsStats('octocat', 'Hello-World');
    //     expect(response).toMatchObject(getContributorsStatsServiceResponse);
    //   });

    //   describe('#getRepoContent', () => {
    //     it('returns files in own interface', async () => {
    //       new BitbucketNock(1, 'octocat', 1, 'Hello-World').getFile('README', 'Hello World!\n', '980a0d5f19a64b4b30a87d4206aade58726b60e3');

    //       const response = await service.getRepoContent('octocat', 'Hello-World', 'README');
    //       expect(response).toMatchObject(getRepoContentServiceResponseFile);
    //     });

    //     it('returns directories in own interface', async () => {
    //       new BitbucketNock(1, 'octocat', 1, 'Hello-World').getDirectory('mockFolder', ['mockFile.ts'], []);

    //       const response = await service.getRepoContent('octocat', 'Hello-World', 'mockFolder');
    //       expect(response).toMatchObject(getRepoContentServiceResponseDir);
    //     });

    //     it("returns null if the path doesn't exists", async () => {
    //       new BitbucketNock(1, 'octocat', 1, 'Hello-World').getNonexistentContents('notExistingMockFolder');

    //       const result = await service.getRepoContent('octocat', 'Hello-World', 'notExistingMockFolder');

    //       expect(result).toBe(null);
    //     });

    //     it('caches the results', async () => {
    //       // bacause of persist == false, the second call to service.getRepoContent() would cause Nock to throw an error if the cache wasn't used
    //       new BitbucketNock(1, 'octocat', 1, 'Hello-World').getFile('README', undefined, undefined, false);
    //       await service.getRepoContent('octocat', 'Hello-World', 'README');

    //       await service.getRepoContent('octocat', 'Hello-World', 'README');
    //     });
    //   });

    //   it('returns issues in own interface', async () => {
    //     new BitbucketNock(1, 'octocat', 1, 'Hello-World').getIssues().reply(200, getIssuesResponse);

    //     const response = await service.getIssues('octocat', 'Hello-World');
    //     expect(response).toMatchObject(getIssuesServiceResponse);
    //   });

    //   it('returns comments in own interface', async () => {
    //     new BitbucketNock(1, 'octocat', 1, 'Hello-World').getRepo('/issues/1/comments').reply(200, getIssueCommentsResponse);

    //     const response = await service.getIssueComments('octocat', 'Hello-World', 1);
    //     expect(response).toMatchObject(getIssueCommentsServiceResponse);
    //   });

    //   it('returns commits in own interfa', async () => {
    //     new BitbucketNock(1, 'octocat', 1, 'Hello-World').getRepo('/issues/1/comments').reply(200, getIssueCommentsResponse);

    //     const response = await service.getIssueComments('octocat', 'Hello-World', 1);
    //     expect(response).toMatchObject(getIssueCommentsServiceResponse);
    //   });

    //   it('returns pull files in own interface', async () => {
    //     new BitbucketNock(1, 'octocat', 1, 'Hello-World').getRepo('/pulls/1/files').reply(200, getPullsFilesResponse);

    //     const response = await service.getPullRequestFiles('octocat', 'Hello-World', 1);
    //     expect(response).toMatchObject(getPullsFilesServiceResponse);
    //   });

    //   it('returns pull commits in own interface', async () => {
    //     new BitbucketNock(1, 'octocat', 1, 'Hello-World').getRepo('/pulls/1/commits').reply(200, getPullCommitsResponse);

    //     const response = await service.getPullCommits('octocat', 'Hello-World', 1);
    //     expect(response).toMatchObject(getPullCommitsServiceResponse);
    //   });
});
