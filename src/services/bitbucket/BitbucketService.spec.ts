//import { BitbucketNock } from "../../../test/helpers/bibucketNock";
import { BitbucketService } from './BitbucketService';

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
import { BitbucketNock } from '../../../test/helpers/bibucketNock';
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
      const reply = {
        pagelen: 10,
        size: 18,
        values: [
          {
            description:
              "Encountered lots of problems in an old C extension I was trying to get working with PyPy, to do with missing things inside datetime.h \\(and cpyext\\_datetime.h\\).\r\n\r\nIdea is to bring everything a bit closer to: [https://github.com/python/cpython/blob/master/Include/datetime.h](https://github.com/python/cpython/blob/master/Include/datetime.h)\r\n\r\nIncluded in this is 'long hashcode' in:  \r\n\tPyDateTime\\_Delta  \r\n\tPyDateTime\\_Time  \r\n\tPyDateTime\\_DateTime  \r\n\tPyDateTime\\_Date\r\n\r\nAlso added 'unsigned char fold' \\(\\+ new constructors that let this be used\\) to:  \r\n\tPyDateTime\\_Time  \r\n\tPyDateTime\\_DateTime\r\n\r\nAnd: 'unsigned char data\\[...\\]' to:  \r\n\tPyDateTime\\_Time  \r\n\tPyDateTime\\_Date  \r\n\tPyDateTime\\_DateTime\r\n\r\nFinally, added the objects:  \r\n\t\\_PyDateTime\\_BaseTime  \r\n\t\\_PyDateTime\\_BaseDateTime\r\n\r\nAlso brought across DATETIME\\_API\\_MAGIC which is a part of CPython and I found I had a reliance on \\(therefore others might have the same thing\\)",
            links: {
              decline: {
                href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/622/decline',
              },
              diffstat: {
                href:
                  'https://api.bitbucket.org/2.0/repositories/pypy/pypy/diffstat/ashwinahuja/pypy:f79995148331%0D5fa60afb5e51?from_pullrequest_id=622',
              },
              commits: {
                href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/622/commits',
              },
              self: {
                href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/622',
              },
              comments: {
                href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/622/comments',
              },
              merge: {
                href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/622/merge',
              },
              html: {
                href: 'https://bitbucket.org/pypy/pypy/pull-requests/622',
              },
              activity: {
                href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/622/activity',
              },
              diff: {
                href:
                  'https://api.bitbucket.org/2.0/repositories/pypy/pypy/diff/ashwinahuja/pypy:f79995148331%0D5fa60afb5e51?from_pullrequest_id=622',
              },
              approve: {
                href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/622/approve',
              },
              statuses: {
                href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/622/statuses',
              },
            },
            title: 'Make more compatible with old C extensions using the PyDateTime_... objects',
            close_source_branch: false,
            type: 'pullrequest',
            id: 622,
            destination: {
              commit: {
                hash: '5fa60afb5e51',
                type: 'commit',
                links: {
                  self: {
                    href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/commit/5fa60afb5e51',
                  },
                  html: {
                    href: 'https://bitbucket.org/pypy/pypy/commits/5fa60afb5e51',
                  },
                },
              },
              repository: {
                links: {
                  self: {
                    href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy',
                  },
                  html: {
                    href: 'https://bitbucket.org/pypy/pypy',
                  },
                  avatar: {
                    href: 'https://bytebucket.org/ravatar/%7B54220cd1-b139-4188-9455-1e13e663f1ac%7D?ts=105930',
                  },
                },
                type: 'repository',
                name: 'pypy',
                full_name: 'pypy/pypy',
                uuid: '{54220cd1-b139-4188-9455-1e13e663f1ac}',
              },
              branch: {
                name: 'default',
              },
            },
            created_on: '2018-09-13T16:43:59.014478+00:00',
            summary: {
              raw:
                "Encountered lots of problems in an old C extension I was trying to get working with PyPy, to do with missing things inside datetime.h \\(and cpyext\\_datetime.h\\).\r\n\r\nIdea is to bring everything a bit closer to: [https://github.com/python/cpython/blob/master/Include/datetime.h](https://github.com/python/cpython/blob/master/Include/datetime.h)\r\n\r\nIncluded in this is 'long hashcode' in:  \r\n\tPyDateTime\\_Delta  \r\n\tPyDateTime\\_Time  \r\n\tPyDateTime\\_DateTime  \r\n\tPyDateTime\\_Date\r\n\r\nAlso added 'unsigned char fold' \\(\\+ new constructors that let this be used\\) to:  \r\n\tPyDateTime\\_Time  \r\n\tPyDateTime\\_DateTime\r\n\r\nAnd: 'unsigned char data\\[...\\]' to:  \r\n\tPyDateTime\\_Time  \r\n\tPyDateTime\\_Date  \r\n\tPyDateTime\\_DateTime\r\n\r\nFinally, added the objects:  \r\n\t\\_PyDateTime\\_BaseTime  \r\n\t\\_PyDateTime\\_BaseDateTime\r\n\r\nAlso brought across DATETIME\\_API\\_MAGIC which is a part of CPython and I found I had a reliance on \\(therefore others might have the same thing\\)",
              markup: 'markdown',
              html:
                '<p>Encountered lots of problems in an old C extension I was trying to get working with PyPy, to do with missing things inside datetime.h (and cpyext_datetime.h).</p>\n<p>Idea is to bring everything a bit closer to: <a data-is-external-link="true" href="https://github.com/python/cpython/blob/master/Include/datetime.h" rel="nofollow">https://github.com/python/cpython/blob/master/Include/datetime.h</a></p>\n<p>Included in this is \'long hashcode\' in:<br />\n    PyDateTime_Delta<br />\n    PyDateTime_Time<br />\n    PyDateTime_DateTime<br />\n    PyDateTime_Date</p>\n<p>Also added \'unsigned char fold\' (+ new constructors that let this be used) to:<br />\n    PyDateTime_Time<br />\n    PyDateTime_DateTime</p>\n<p>And: \'unsigned char data[...]\' to:<br />\n    PyDateTime_Time<br />\n    PyDateTime_Date<br />\n    PyDateTime_DateTime</p>\n<p>Finally, added the objects:<br />\n    _PyDateTime_BaseTime<br />\n    _PyDateTime_BaseDateTime</p>\n<p>Also brought across DATETIME_API_MAGIC which is a part of CPython and I found I had a reliance on (therefore others might have the same thing)</p>',
              type: 'rendered',
            },
            source: {
              commit: {
                hash: 'f79995148331',
                type: 'commit',
                links: {
                  self: {
                    href: 'https://api.bitbucket.org/2.0/repositories/ashwinahuja/pypy/commit/f79995148331',
                  },
                  html: {
                    href: 'https://bitbucket.org/ashwinahuja/pypy/commits/f79995148331',
                  },
                },
              },
              repository: {
                links: {
                  self: {
                    href: 'https://api.bitbucket.org/2.0/repositories/ashwinahuja/pypy',
                  },
                  html: {
                    href: 'https://bitbucket.org/ashwinahuja/pypy',
                  },
                  avatar: {
                    href: 'https://bytebucket.org/ravatar/%7Bed2b5d25-be07-4808-b0dd-c5d4633e4a57%7D?ts=python',
                  },
                },
                type: 'repository',
                name: 'pypy',
                full_name: 'ashwinahuja/pypy',
                uuid: '{ed2b5d25-be07-4808-b0dd-c5d4633e4a57}',
              },
              branch: {
                name: 'default',
              },
            },
            comment_count: 3,
            state: 'OPEN',
            task_count: 0,
            reason: '',
            updated_on: '2019-09-22T07:28:06.932156+00:00',
            author: {
              display_name: 'Ashwin Ahuja',
              uuid: '{f1f005b4-8963-4824-a447-3cdaebfd80a0}',
              links: {
                self: {
                  href: 'https://api.bitbucket.org/2.0/users/%7Bf1f005b4-8963-4824-a447-3cdaebfd80a0%7D',
                },
                html: {
                  href: 'https://bitbucket.org/%7Bf1f005b4-8963-4824-a447-3cdaebfd80a0%7D/',
                },
                avatar: {
                  href:
                    'https://secure.gravatar.com/avatar/b2161a145da2091ef7d2d874f2a25c37?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FAA-2.png',
                },
              },
              nickname: 'ashwinahuja',
              type: 'user',
              account_id: '557058:30c16884-172c-4aed-8bcd-52d8b81dd0af',
            },
            merge_commit: null,
            closed_by: null,
          },
        ],
      };

      //new BitbucketNock(1, 'pypy', 1, 'pypy').getPulls([{ number: 1347, state: 'open', title: 'new-feature', body: 'Please pull these awesome changes', head: 'new-topic', base: 'master' }])
      const bitbucketNock = nock('https://api.bitbucket.org/2.0');
      bitbucketNock.get('/repositories/pypy/pypy/pullrequests').reply(200, reply);
      const response = await service.getPullRequests('pypy', 'pypy');
      console.log(response);
      expect(reply).toEqual(response.data);
    });
  });
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
