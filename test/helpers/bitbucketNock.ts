/* eslint-disable @typescript-eslint/camelcase */
import nock from 'nock';
import qs from 'qs';
import { BitbucketCommit } from '../../src/services/bitbucket/BitbucketService';
import { BitbucketPullRequestState } from '../../src/services/git/IVCSService';
import { Paginated } from '../../src/inspectors/common/Paginated';
import { getPullRequestResponse } from '../../src/services/git/__MOCKS__/bitbucketServiceMockFolder/getPullRequestResponse';
import { PullRequest } from '../../src/services/git/model';
import _ from 'lodash';

export class BitbucketNock {
  user: string;
  repoName: string;
  url: string;

  constructor(user: string, repoName: string) {
    (this.user = user), (this.repoName = repoName);
    this.url = 'https://api.bitbucket.org/2.0';
  }

  getApiResponse(
    resource: string,
    id?: number | string,
    value?: string,
    state?: BitbucketPullRequestState | BitbucketPullRequestState[],
  ): nock.Scope {
    let url = `${this.url}/repositories/${this.user}/${this.repoName}/${resource}`;
    let response;

    let params = {};
    const persist = true;

    if (state === undefined) {
      state = BitbucketPullRequestState.open;
    }

    if (value !== undefined) {
      switch (value) {
        case 'comments':
          url = url.concat(`/${id}/${value}`);
          response = new IssueCommentsMock().issueComments;
          break;
        case 'commits':
          url = url.concat(`/${id}/${value}`);
          response = new CommitsMock().commits;
          break;
      }
    } else {
      switch (resource) {
        case 'pullrequests':
          if (id !== undefined) {
            url = url.concat(`/${id}`);
            response = new PullRequestMock(<BitbucketPullRequestState>state).pullRequest;
          } else {
            if (state === BitbucketPullRequestState.open) {
              const pullRequest = new PullRequestMock(state).pullRequest;
              response = new PullRequestsMock([pullRequest]).pullrequests;
            } else {
              const stateForUri = qs.stringify({ state: state }, { addQueryPrefix: true, indices: false, arrayFormat: 'repeat' });
              url = url.concat(`${stateForUri}`);
              params = { state: state };

              if (typeof state !== 'string') {
                const pullRequests: Bitbucket.Schema.Pullrequest[] = [];
                state.forEach((state) => {
                  pullRequests.push(new PullRequestMock(state).pullRequest);
                });

                response = new PullRequestsMock(pullRequests).pullrequests;
              } else {
                const pullRequest = new PullRequestMock(<BitbucketPullRequestState>state).pullRequest;
                response = new PullRequestsMock([pullRequest]).pullrequests;
              }
            }
          }
          break;
        case 'issues':
          if (id !== undefined) {
            url = url.concat(`/${id}`);
            response = new IssueMock().issue;
          } else {
            response = new IssuesMock().issues;
          }
          break;
        case 'commits':
          response = new RepoCommitsMock().repoCommits;
          break;
        case 'commit':
          url = url.concat(`/${id}`);
          response = new RepoCommitMock().repoCommit;
          break;
        default:
          throw Error('You passed wrong value or id');
      }
    }

    return BitbucketNock.get(url, params, persist).reply(200, response);
  }

  private static get(url: string, params: nock.DataMatcherMap, persist = true): nock.Interceptor {
    const urlObj = new URL(url);

    const scope = nock(urlObj.origin);
    if (persist) {
      scope.persist();
    }

    const interceptor = scope.get(urlObj.pathname);
    if (Object.keys(params)) {
      interceptor.query(params);
    }
    return interceptor;
  }

  mockBitbucketPullRequestResponse(states: BitbucketPullRequestState | BitbucketPullRequestState[]): Paginated<PullRequest> {
    const pullRequests: PullRequest[] = [];

    const paginatedPullrequests: Paginated<PullRequest> = {
      items: [getPullRequestResponse],
      hasNextPage: true,
      hasPreviousPage: false,
      page: 1,
      perPage: typeof states === 'string' ? 1 : states.length,
      totalCount: typeof states === 'string' ? 1 : states.length,
    };

    if (typeof states !== 'string') {
      states.forEach((state) => {
        const pullrequest = _.cloneDeep(getPullRequestResponse);
        pullrequest.state = state;
        pullRequests.push(pullrequest);
      });
      paginatedPullrequests.items = pullRequests;
    } else {
      getPullRequestResponse.state = states;
      paginatedPullrequests.items = [getPullRequestResponse];
    }
    return paginatedPullrequests;
  }
}

export class IssuesMock {
  issues: Bitbucket.Schema.PaginatedIssues;
  constructor() {
    this.issues = {
      pagelen: 20,
      size: 3070,
      page: 1,
      next: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/issues?page=2',
      values: [new IssueMock().issue],
    };
  }
}

export class IssueMock {
  issue: Bitbucket.Schema.Issue;
  constructor() {
    this.issue = {
      priority: 'major',
      kind: 'bug',
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
      links: {
        attachments: {
          href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/issues/3086/attachments',
        },
        self: {
          href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/issues/3086',
        },
        watch: {
          href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/issues/3086/watch',
        },
        comments: {
          href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/issues/3086/comments',
        },
        html: {
          href: 'https://bitbucket.org/pypy/pypy/issues/3086/arm64-jit-lots-of-crashes',
        },
        vote: {
          href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/issues/3086/vote',
        },
      },
      reporter: {
        display_name: 'Stefano Rivera',
        uuid: '{dfa073eb-c602-4740-83ef-a8fe8ee03dfd}',
        links: {
          self: {
            href: 'https://api.bitbucket.org/2.0/users/%7Bdfa073eb-c602-4740-83ef-a8fe8ee03dfd%7D',
          },
          html: {
            href: 'https://bitbucket.org/%7Bdfa073eb-c602-4740-83ef-a8fe8ee03dfd%7D/',
          },
          avatar: {
            href:
              'https://secure.gravatar.com/avatar/0b25ad2bcea703792d5a7bfc521a47ca?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FSR-5.png',
          },
        },
        nickname: 'stefanor',
        type: 'user',
        account_id: '557058:efb9f360-846e-4950-afaa-c6a5da7e77b2',
      },
      title: 'arm64 JIT: Lots of crashes',
      votes: 0,
      watches: 2,
      content: {
        raw:
          'As mentioned on IRC over the last few days.\r\n\r\nWhen I translate a JIT pypy2.7 from the 7.2 release branch \\(or hg HEAD\\) under cPython on arm64, I get an interpreter with an unstable JIT. It constantly crashes, with some variant of:\r\n\r\n```\r\n$ pypy/goal/pypy-c lib_pypy/_sqlite3_build.py\r\nRPython traceback:\r\n  File "rpython_jit_metainterp_10.c", line 25430, in send_loop_to_backend\r\n  File "rpython_jit_backend_aarch64.c", line 1690, in AssemblerARM64_assemble_loop\r\n  File "rpython_jit_backend_aarch64.c", line 4551, in AssemblerARM64__assemble\r\n  File "rpython_jit_backend_aarch64.c", line 13381, in AssemblerARM64__walk_operations\r\n  File "rpython_jit_backend_aarch64.c", line 52643, in ResOpAssembler_emit_op_zero_array\r\nFatal RPython error: AssertionError\r\n```\r\n\r\n`--jit off` works as usual.\r\n\r\nI can’t reproduce this with the pre-built [pypy2.7-v7.2.0rc0-aarch64.tar.bz2](https://bitbucket.org/pypy/pypy/downloads/pypy2.7-v7.2.0rc0-aarch64.tar.bz2), and it can translate pypy2.7 to produce a working JIT. OS is Debian sid. Haven’t tried pypy3.6, yet.\r\n\r\nFull build log attached. No toolchain details in there, but it will be almost identical to [this build, without JIT](https://buildd.debian.org/status/fetch.php?pkg=pypy3&arch=arm64&ver=7.2.0%7Erc1%2Bdfsg-1&stamp=1570132096&raw=0).\r\n\r\nHardware: kvm guest on an APM [X-Gene 1](https://www.gigabyte.com/Server-Motherboard/MP30-AR1-rev-11#ov) \\(a Mustang, something like that\\)',
        markup: 'markdown',
        html:
          '<p>As mentioned on IRC over the last few days.</p>\n<p>When I translate a JIT pypy2.7 from the 7.2 release branch (or hg HEAD) under cPython on arm64, I get an interpreter with an unstable JIT. It constantly crashes, with some variant of:</p>\n<div class="codehilite"><pre><span></span>$ pypy/goal/pypy-c lib_pypy/_sqlite3_build.py\nRPython traceback:\n  File <span class="s2">&quot;rpython_jit_metainterp_10.c&quot;</span>, line <span class="m">25430</span>, in send_loop_to_backend\n  File <span class="s2">&quot;rpython_jit_backend_aarch64.c&quot;</span>, line <span class="m">1690</span>, in AssemblerARM64_assemble_loop\n  File <span class="s2">&quot;rpython_jit_backend_aarch64.c&quot;</span>, line <span class="m">4551</span>, in AssemblerARM64__assemble\n  File <span class="s2">&quot;rpython_jit_backend_aarch64.c&quot;</span>, line <span class="m">13381</span>, in AssemblerARM64__walk_operations\n  File <span class="s2">&quot;rpython_jit_backend_aarch64.c&quot;</span>, line <span class="m">52643</span>, in ResOpAssembler_emit_op_zero_array\nFatal RPython error: AssertionError\n</pre></div>\n\n\n<p><code>--jit off</code> works as usual.</p>\n<p>I can’t reproduce this with the pre-built <a data-is-external-link="true" href="https://bitbucket.org/pypy/pypy/downloads/pypy2.7-v7.2.0rc0-aarch64.tar.bz2" rel="nofollow">pypy2.7-v7.2.0rc0-aarch64.tar.bz2</a>, and it can translate pypy2.7 to produce a working JIT. OS is Debian sid. Haven’t tried pypy3.6, yet.</p>\n<p>Full build log attached. No toolchain details in there, but it will be almost identical to <a data-is-external-link="true" href="https://buildd.debian.org/status/fetch.php?pkg=pypy3&amp;arch=arm64&amp;ver=7.2.0%7Erc1%2Bdfsg-1&amp;stamp=1570132096&amp;raw=0" rel="nofollow">this build, without JIT</a>.</p>\n<p>Hardware: kvm guest on an APM <a data-is-external-link="true" href="https://www.gigabyte.com/Server-Motherboard/MP30-AR1-rev-11#ov" rel="nofollow">X-Gene 1</a> (a Mustang, something like that)</p>',
      },
      assignee: {
        display_name: 'Maciej Fijalkowski',
        uuid: '{99b67766-d1ba-42c6-a80e-543f7318428b}',
        links: {
          self: {
            href: 'https://api.bitbucket.org/2.0/users/%7B99b67766-d1ba-42c6-a80e-543f7318428b%7D',
          },
          html: {
            href: 'https://bitbucket.org/%7B99b67766-d1ba-42c6-a80e-543f7318428b%7D/',
          },
          avatar: {
            href:
              'https://secure.gravatar.com/avatar/bfc96d2a02d9113edb992eb96c205c5a?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FMF-0.png',
          },
        },
        nickname: 'fijal',
        type: 'user',
        account_id: '557058:4805a215-8388-4152-9c83-043e10a4435a',
      },
      state: 'new',
      created_on: '2019-10-06T19:52:53.940697+00:00',
      updated_on: '2019-10-15T15:47:34.904758+00:00',
      type: 'issue',
      id: 3086,
    };
  }
}

export class PullRequestsMock {
  pullrequests: Bitbucket.Schema.PaginatedPullrequests;

  constructor(pullRequests: (Bitbucket.Schema.Pullrequest & Bitbucket.Schema.Object)[]) {
    this.pullrequests = {
      page: 1,
      next: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests?page=2',
      pagelen: 10,
      size: 20,
      values: pullRequests,
    };
  }
}

export class PullRequestMock {
  pullRequest: Bitbucket.Schema.Pullrequest & Bitbucket.Schema.Object;
  state: BitbucketPullRequestState;
  constructor(state: BitbucketPullRequestState) {
    this.state = state;
    this.pullRequest = {
      description: 'Added a floor() ufunc to micronumpy',
      links: {
        decline: {
          href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/1/decline',
        },
        commits: {
          href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/1/commits',
        },
        self: {
          href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/1',
        },
        comments: {
          href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/1/comments',
        },
        merge: {
          href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/1/merge',
        },
        html: {
          href: 'https://bitbucket.org/pypy/pypy/pull-requests/1',
        },
        activity: {
          href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/1/activity',
        },
        diff: {
          href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/diff/None?from_pullrequest_id=1',
        },
        approve: {
          href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/1/approve',
        },
      },
      title: 'floor ufunc for micronumpy',
      close_source_branch: false,
      reviewers: [],
      id: 1,
      destination: {
        commit: undefined,
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
      created_on: '2011-06-22T19:44:39.555192+00:00',
      summary: {
        raw: 'Added a floor() ufunc to micronumpy',
        markup: 'markdown',
        html: '<p>Added a floor() ufunc to micronumpy</p>',
      },
      source: {
        commit: {
          hash: '0f45e3d5961f',
        },
        repository: {
          links: {
            self: {
              href: 'https://api.bitbucket.org/2.0/repositories/landtuna/pypy',
            },
            html: {
              href: 'https://bitbucket.org/landtuna/pypy',
            },
            avatar: {
              href: 'https://bytebucket.org/ravatar/%7Ba4ea93c2-1b22-45dd-9e1e-66da399dc087%7D?ts=default',
            },
          },
          type: 'repository',
          name: 'pypy',
          full_name: 'landtuna/pypy',
          uuid: '{a4ea93c2-1b22-45dd-9e1e-66da399dc087}',
        },
        branch: {
          name: '',
        },
      },
      comment_count: 0,
      state: this.state,
      task_count: 0,
      participants: [],
      reason: 'already merged',
      updated_on: '2011-06-23T13:52:30.230741+00:00',
      author: {
        display_name: 'Jim Hunziker',
        uuid: '{9d65d517-4898-47ac-9d2f-fd902d25d9f6}',
        links: {
          self: {
            href: 'https://api.bitbucket.org/2.0/users/%7B9d65d517-4898-47ac-9d2f-fd902d25d9f6%7D',
          },
          html: {
            href: 'https://bitbucket.org/%7B9d65d517-4898-47ac-9d2f-fd902d25d9f6%7D/',
          },
          avatar: {
            href: 'https://bitbucket.org/account/landtuna/avatar/',
          },
        },
        nickname: 'landtuna',
        type: 'user',
        account_id: null,
      },
      merge_commit: undefined,
      closed_by: {
        display_name: 'Maciej Fijalkowski',
        uuid: '{99b67766-d1ba-42c6-a80e-543f7318428b}',
        links: {
          self: {
            href: 'https://api.bitbucket.org/2.0/users/%7B99b67766-d1ba-42c6-a80e-543f7318428b%7D',
          },
          html: {
            href: 'https://bitbucket.org/%7B99b67766-d1ba-42c6-a80e-543f7318428b%7D/',
          },
          avatar: {
            href:
              'https://secure.gravatar.com/avatar/bfc96d2a02d9113edb992eb96c205c5a?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FMF-0.png',
          },
        },
        nickname: 'fijal',
        type: 'user',
        account_id: '557058:4805a215-8388-4152-9c83-043e10a4435a',
      },
      type: 'rendered',
      page: 1,
      next: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests?page=2',
    };
  }
}

export class CommitsMock {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  commits: any;
  constructor() {
    this.commits = {
      pagelen: 10,
      values: [
        {
          hash: 'f799951483319e5397d41019de50f8e07b01b04f',
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
          links: {
            self: {
              href: 'https://api.bitbucket.org/2.0/repositories/ashwinahuja/pypy/commit/f799951483319e5397d41019de50f8e07b01b04f',
            },
            comments: {
              href: 'https://api.bitbucket.org/2.0/repositories/ashwinahuja/pypy/commit/f799951483319e5397d41019de50f8e07b01b04f/comments',
            },
            patch: {
              href: 'https://api.bitbucket.org/2.0/repositories/ashwinahuja/pypy/patch/f799951483319e5397d41019de50f8e07b01b04f',
            },
            html: {
              href: 'https://bitbucket.org/ashwinahuja/pypy/commits/f799951483319e5397d41019de50f8e07b01b04f',
            },
            diff: {
              href: 'https://api.bitbucket.org/2.0/repositories/ashwinahuja/pypy/diff/f799951483319e5397d41019de50f8e07b01b04f',
            },
            approve: {
              href: 'https://api.bitbucket.org/2.0/repositories/ashwinahuja/pypy/commit/f799951483319e5397d41019de50f8e07b01b04f/approve',
            },
            statuses: {
              href: 'https://api.bitbucket.org/2.0/repositories/ashwinahuja/pypy/commit/f799951483319e5397d41019de50f8e07b01b04f/statuses',
            },
          },
          author: {
            raw: 'ashwinahuja',
            type: 'author',
          },
          summary: {
            raw: 'Remove the duplicated (unnecessary items)',
            markup: 'markdown',
            html: '<p>Remove the duplicated (unnecessary items)</p>',
            type: 'rendered',
          },
          parents: [
            {
              hash: '0e3d572c47c60df4760e541da6a05e5e305d6175',
              type: 'commit',
              links: {
                self: {
                  href: 'https://api.bitbucket.org/2.0/repositories/ashwinahuja/pypy/commit/0e3d572c47c60df4760e541da6a05e5e305d6175',
                },
                html: {
                  href: 'https://bitbucket.org/ashwinahuja/pypy/commits/0e3d572c47c60df4760e541da6a05e5e305d6175',
                },
              },
            },
          ],
          date: '2018-09-13T16:19:32+00:00',
          message: 'Remove the duplicated (unnecessary items)',
          type: 'commit',
        },
        {
          hash: '0e3d572c47c60df4760e541da6a05e5e305d6175',
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
          links: {
            self: {
              href: 'https://api.bitbucket.org/2.0/repositories/ashwinahuja/pypy/commit/0e3d572c47c60df4760e541da6a05e5e305d6175',
            },
            comments: {
              href: 'https://api.bitbucket.org/2.0/repositories/ashwinahuja/pypy/commit/0e3d572c47c60df4760e541da6a05e5e305d6175/comments',
            },
            patch: {
              href: 'https://api.bitbucket.org/2.0/repositories/ashwinahuja/pypy/patch/0e3d572c47c60df4760e541da6a05e5e305d6175',
            },
            html: {
              href: 'https://bitbucket.org/ashwinahuja/pypy/commits/0e3d572c47c60df4760e541da6a05e5e305d6175',
            },
            diff: {
              href: 'https://api.bitbucket.org/2.0/repositories/ashwinahuja/pypy/diff/0e3d572c47c60df4760e541da6a05e5e305d6175',
            },
            approve: {
              href: 'https://api.bitbucket.org/2.0/repositories/ashwinahuja/pypy/commit/0e3d572c47c60df4760e541da6a05e5e305d6175/approve',
            },
            statuses: {
              href: 'https://api.bitbucket.org/2.0/repositories/ashwinahuja/pypy/commit/0e3d572c47c60df4760e541da6a05e5e305d6175/statuses',
            },
          },
          author: {
            raw: 'ashwinahuja',
            type: 'author',
          },
          summary: {
            raw: 'Making datetime objects more compatible with old C extensions written for CPython',
            markup: 'markdown',
            html: '<p>Making datetime objects more compatible with old C extensions written for CPython</p>',
            type: 'rendered',
          },
          parents: [
            {
              hash: '4cbeaa8bf545332c36ae277019772aa432693e4c',
              type: 'commit',
              links: {
                self: {
                  href: 'https://api.bitbucket.org/2.0/repositories/ashwinahuja/pypy/commit/4cbeaa8bf545332c36ae277019772aa432693e4c',
                },
                html: {
                  href: 'https://bitbucket.org/ashwinahuja/pypy/commits/4cbeaa8bf545332c36ae277019772aa432693e4c',
                },
              },
            },
          ],
          date: '2018-09-13T16:14:59+00:00',
          message: 'Making datetime objects more compatible with old C extensions written for CPython',
          type: 'commit',
        },
      ],
      page: 1,
    };
  }
}

export class IssueCommentMock {
  issueComment: Bitbucket.Schema.IssueComment;
  constructor() {
    this.issueComment = {
      links: {
        self: {
          href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/issues/3086/comments/54230712',
        },
        html: {
          href: 'https://bitbucket.org/pypy/pypy/issues/3086#comment-54230712',
        },
      },
      issue: {
        links: {
          self: {
            href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/issues/3086',
          },
        },
        type: 'issue',
        id: 3086,
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
        title: 'arm64 JIT: Lots of crashes',
      },
      content: {
        raw: undefined,
        markup: 'markdown',
        html: '',
      },
      created_on: '2019-10-07T06:12:23.627201+00:00',
      user: {
        display_name: 'Stefano Rivera',
        uuid: '{dfa073eb-c602-4740-83ef-a8fe8ee03dfd}',
        links: {
          self: {
            href: 'https://api.bitbucket.org/2.0/users/%7Bdfa073eb-c602-4740-83ef-a8fe8ee03dfd%7D',
          },
          html: {
            href: 'https://bitbucket.org/%7Bdfa073eb-c602-4740-83ef-a8fe8ee03dfd%7D/',
          },
          avatar: {
            href:
              'https://secure.gravatar.com/avatar/0b25ad2bcea703792d5a7bfc521a47ca?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FSR-5.png',
          },
        },
        nickname: 'stefanor',
        type: 'user',
        account_id: '557058:efb9f360-846e-4950-afaa-c6a5da7e77b2',
      },
      updated_on: undefined,
      type: 'issue_comment',
      id: 54230712,
    };
  }
}

export class IssueCommentsMock {
  issueComments: Bitbucket.Schema.PaginatedIssueComments;
  constructor() {
    this.issueComments = {
      pagelen: 20,
      values: [new IssueCommentMock().issueComment],
      page: 1,
      size: 14,
    };
  }
}

export class RepoCommitMock {
  repoCommit: Bitbucket.Schema.Commit;
  constructor() {
    this.repoCommit = {
      rendered: {
        message: {
          raw:
            'This checkin might win the prize for the highest amount of XXXs/lines of code:\nit needs a deep review, please :)\n\nFix W_ExtensionFunction_call_varargs to use the updated calling convention,\nand implement ctx_Arg_Parse.',
          markup: 'markdown',
          html:
            '<p>This checkin might win the prize for the highest amount of XXXs/lines of code:<br />\nit needs a deep review, please :)</p>\n<p>Fix W_ExtensionFunction_call_varargs to use the updated calling convention,<br />\nand implement ctx_Arg_Parse.</p>',
          type: 'rendered',
        },
      },
      hash: 'f9c2cfcfaafa644dcc286ce2fc8b3386d46c11df',
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
      links: {
        self: {
          href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/commit/f9c2cfcfaafa644dcc286ce2fc8b3386d46c11df',
        },
        comments: {
          href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/commit/f9c2cfcfaafa644dcc286ce2fc8b3386d46c11df/comments',
        },
        patch: {
          href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/patch/f9c2cfcfaafa644dcc286ce2fc8b3386d46c11df',
        },
        html: {
          href: 'https://bitbucket.org/pypy/pypy/commits/f9c2cfcfaafa644dcc286ce2fc8b3386d46c11df',
        },
        diff: {
          href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/diff/f9c2cfcfaafa644dcc286ce2fc8b3386d46c11df',
        },
        approve: {
          href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/commit/f9c2cfcfaafa644dcc286ce2fc8b3386d46c11df/approve',
        },
        statuses: {
          href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/commit/f9c2cfcfaafa644dcc286ce2fc8b3386d46c11df/statuses',
        },
      },
      author: {
        raw: 'Antonio Cuni <anto.cuni@gmail.com>',
        type: 'author',
        user: {
          display_name: 'Antonio Cuni',
          uuid: '{2ba51dad-da92-44d7-96b9-9d7b6eb196cb}',
          links: {
            self: {
              href: 'https://api.bitbucket.org/2.0/users/%7B2ba51dad-da92-44d7-96b9-9d7b6eb196cb%7D',
            },
            html: {
              href: 'https://bitbucket.org/%7B2ba51dad-da92-44d7-96b9-9d7b6eb196cb%7D/',
            },
            avatar: {
              href:
                'https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/557058:136fd9cc-4f8c-4548-8dbc-dd50a6d749d9/8cc41205-88c2-4279-b475-27189150a116/128',
            },
          },
          nickname: 'antocuni',
          type: 'user',
          account_id: '557058:136fd9cc-4f8c-4548-8dbc-dd50a6d749d9',
        },
      },
      summary: {
        raw:
          'This checkin might win the prize for the highest amount of XXXs/lines of code:\nit needs a deep review, please :)\n\nFix W_ExtensionFunction_call_varargs to use the updated calling convention,\nand implement ctx_Arg_Parse.',
        markup: 'markdown',
        html:
          '<p>This checkin might win the prize for the highest amount of XXXs/lines of code:<br />\nit needs a deep review, please :)</p>\n<p>Fix W_ExtensionFunction_call_varargs to use the updated calling convention,<br />\nand implement ctx_Arg_Parse.</p>',
      },
      parents: [
        {
          hash: '5c9a3fd99fc743f49aaad30952397ab34ad4f40b',
          type: 'commit',
          links: {
            self: {
              href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/commit/5c9a3fd99fc743f49aaad30952397ab34ad4f40b',
            },
            html: {
              href: 'https://bitbucket.org/pypy/pypy/commits/5c9a3fd99fc743f49aaad30952397ab34ad4f40b',
            },
          },
        },
      ],
      date: '2019-11-19T10:48:09+00:00',
      message:
        'This checkin might win the prize for the highest amount of XXXs/lines of code:\nit needs a deep review, please :)\n\nFix W_ExtensionFunction_call_varargs to use the updated calling convention,\nand implement ctx_Arg_Parse.',
      type: 'commit',
    };
  }
}

export class RepoCommitsMock {
  repoCommits: BitbucketCommit;
  constructor() {
    this.repoCommits = {
      values: [new RepoCommitMock().repoCommit],
      pagelen: 20,
      page: 1,
      size: 14,
      next: '',
      previous: '',
    };
  }
}
