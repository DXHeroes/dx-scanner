/* eslint-disable @typescript-eslint/camelcase */
import nock from 'nock';
import * as nodePath from 'path';

export class BitbucketNock {
  getPullRequests(pulls: { user: string; repoName: string }) {
    const response = new PullRequests().pullrequests;

    const url = `https://api.bitbucket.org/2.0/repositories/${pulls.user}/${pulls.repoName}/pullrequests`;
    const params = {};
    const persist = true;

    return BitbucketNock.get(url, params, persist).reply(200, response);
  }

  getPullRequest(pull: { user: string; repoName: string; pullRequestId: number }) {
    const response = new PullRequest().pullRequest;

    const url = `https://api.bitbucket.org/2.0/repositories/${pull.user}/${pull.repoName}/pullrequests/${pull.pullRequestId}`;
    const params = {};
    const persist = true;

    return BitbucketNock.get(url, params, persist).reply(200, response);
  }

  getPullCommits(pull: { user: string; repoName: string; pullRequestId: number }) {
    const response = new Commits().commits;

    const url = `https://api.bitbucket.org/2.0/repositories/${pull.user}/${pull.repoName}/pullrequests/${pull.pullRequestId}/commits`;
    const params = {};
    const persist = true;

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
}

export class PullRequests {
  pullrequests: Bitbucket.Schema.PaginatedPullrequests;

  constructor() {
    this.pullrequests = {
      page: 1,
      next: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests?page=2',
      pagelen: 10,
      size: 20,
      values: [new PullRequest().pullRequest],
    };
  }
}

export class PullRequest {
  pullRequest: Bitbucket.Schema.Pullrequest & Bitbucket.Schema.Object;
  constructor() {
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
      state: 'DECLINED',
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

export class Commits {
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

export const getPullRequestsResponse = {
  items: [
    {
      user: {
        id: '{9d65d517-4898-47ac-9d2f-fd902d25d9f6}',
        login: 'landtuna',
        url: 'https://bitbucket.org/%7B9d65d517-4898-47ac-9d2f-fd902d25d9f6%7D/',
      },
      url: undefined,
      body: 'Added a floor() ufunc to micronumpy',
      createdAt: '2011-06-22T19:44:39.555192+00:00',
      updatedAt: '2011-06-23T13:52:30.230741+00:00',
      closedAt: undefined,
      mergedAt: undefined,
      state: 'DECLINED',
      id: 1,
      base: { repo: { url: 'https://bitbucket.org/pypy/pypy', name: 'pypy', id: '{54220cd1-b139-4188-9455-1e13e663f1ac}', owner: 'pypy' } },
    },
  ],
  totalCount: 1,
  hasNextPage: true,
  hasPreviousPage: false,
  page: 1,
  perPage: 1,
};

export const getPullRequestResponse = {
  user: { id: '{9d65d517-4898-47ac-9d2f-fd902d25d9f6}', login: 'landtuna', url: undefined },
  url: 'https://bitbucket.org/pypy/pypy/pull-requests/1',
  body: 'Added a floor() ufunc to micronumpy',
  createdAt: '2011-06-22T19:44:39.555192+00:00',
  updatedAt: '2011-06-23T13:52:30.230741+00:00',
  closedAt: undefined,
  mergedAt: undefined,
  state: 'DECLINED',
  id: 1,
  base: {
    repo: {
      url: 'https://bitbucket.org/pypy/pypy',
      name: 'pypy',
      id: '{54220cd1-b139-4188-9455-1e13e663f1ac}',
      owner: {
        login: 'landtuna',
        id: '{9d65d517-4898-47ac-9d2f-fd902d25d9f6}',
        url: 'https://bitbucket.org/%7B9d65d517-4898-47ac-9d2f-fd902d25d9f6%7D/',
      },
    },
  },
};

export const getPullCommits = {
  items: [
    {
      sha: undefined,
      commit: {
        url: 'https://bitbucket.org/ashwinahuja/pypy/commits/f799951483319e5397d41019de50f8e07b01b04f',
        message: 'Remove the duplicated (unnecessary items)',
        author: { name: 'ashwinahuja', email: undefined, date: '2018-09-13T16:19:32+00:00' },
        tree: {
          sha: 'f799951483319e5397d41019de50f8e07b01b04f',
          url: 'https://bitbucket.org/ashwinahuja/pypy/commits/f799951483319e5397d41019de50f8e07b01b04f',
        },
        verified: undefined,
      },
    },
    {
      sha: undefined,
      commit: {
        url: 'https://bitbucket.org/ashwinahuja/pypy/commits/0e3d572c47c60df4760e541da6a05e5e305d6175',
        message: 'Making datetime objects more compatible with old C extensions written for CPython',
        author: { name: 'ashwinahuja', email: undefined, date: '2018-09-13T16:14:59+00:00' },
        tree: {
          sha: '0e3d572c47c60df4760e541da6a05e5e305d6175',
          url: 'https://bitbucket.org/ashwinahuja/pypy/commits/0e3d572c47c60df4760e541da6a05e5e305d6175',
        },
        verified: undefined,
      },
    },
  ],
  totalCount: 2,
  hasNextPage: false,
  hasPreviousPage: false,
  page: 1,
  perPage: 2,
};

export const getIssuesResponse = {
  items: [
    {
      user: {
        id: '{dfa073eb-c602-4740-83ef-a8fe8ee03dfd}',
        login: 'stefanor',
        url: 'https://bitbucket.org/%7Bdfa073eb-c602-4740-83ef-a8fe8ee03dfd%7D/',
      },
      url: 'https://bitbucket.org/pypy/pypy',
      body:
        'As mentioned on IRC over the last few days.\r\n\r\nWhen I translate a JIT pypy2.7 from the 7.2 release branch \\(or hg HEAD\\) under cPython on arm64, I get an interpreter with an unstable JIT. It constantly crashes, with some variant of:\r\n\r\n```\r\n$ pypy/goal/pypy-c lib_pypy/_sqlite3_build.py\r\nRPython traceback:\r\n  File "rpython_jit_metainterp_10.c", line 25430, in send_loop_to_backend\r\n  File "rpython_jit_backend_aarch64.c", line 1690, in AssemblerARM64_assemble_loop\r\n  File "rpython_jit_backend_aarch64.c", line 4551, in AssemblerARM64__assemble\r\n  File "rpython_jit_backend_aarch64.c", line 13381, in AssemblerARM64__walk_operations\r\n  File "rpython_jit_backend_aarch64.c", line 52643, in ResOpAssembler_emit_op_zero_array\r\nFatal RPython error: AssertionError\r\n```\r\n\r\n`--jit off` works as usual.\r\n\r\nI can’t reproduce this with the pre-built [pypy2.7-v7.2.0rc0-aarch64.tar.bz2](https://bitbucket.org/pypy/pypy/downloads/pypy2.7-v7.2.0rc0-aarch64.tar.bz2), and it can translate pypy2.7 to produce a working JIT. OS is Debian sid. Haven’t tried pypy3.6, yet.\r\n\r\nFull build log attached. No toolchain details in there, but it will be almost identical to [this build, without JIT](https://buildd.debian.org/status/fetch.php?pkg=pypy3&arch=arm64&ver=7.2.0%7Erc1%2Bdfsg-1&stamp=1570132096&raw=0).\r\n\r\nHardware: kvm guest on an APM [X-Gene 1](https://www.gigabyte.com/Server-Motherboard/MP30-AR1-rev-11#ov) \\(a Mustang, something like that\\)',
      createdAt: '2019-10-06T19:52:53.940697+00:00',
      updatedAt: '2019-10-08T10:51:06.164238+00:00',
      closedAt: undefined,
      state: 'new',
      id: '{54220cd1-b139-4188-9455-1e13e663f1ac}',
    },
    {
      user: {
        id: '{dbfa14d1-1407-4365-931a-3cbd28328ddd}',
        login: 'Crusader Ky (crusaderky)',
        url: 'https://bitbucket.org/%7Bdbfa14d1-1407-4365-931a-3cbd28328ddd%7D/',
      },
      url: 'https://bitbucket.org/pypy/pypy',
      body:
        'pypy3.6-v7.1.1-linux64\r\n\r\n‌\r\n\r\nI have a base class that defines \\_\\_init\\_subclass\\_\\_ and invokes object.\\_\\_new\\_\\_\\(cls\\) inside it.\r\n\r\nIf a subclass inherits from it and also from any of the classes from collections.abc, pypy falls over:\r\n\r\n‌\r\n\r\n```python\r\nfrom collections.abc import Hashable\r\n\r\n\r\nclass C:\r\n    def __init_subclass__(cls):\r\n        object.__new__(cls)\r\n\r\n\r\nclass D(Hashable, C):\r\n    def __hash__(self):\r\n        return 123\r\n```\r\n\r\nOutput:\r\n\r\n‌\r\n\r\n```\r\nTraceback (most recent call last):\r\n  File "t1.py", line 9, in <module>\r\n    class D(Hashable, C):\r\n  File "pypy3.6-v7.1.1-linux64/lib-python/3/abc.py", line 133, in __new__\r\n    cls = super().__new__(mcls, name, bases, namespace)\r\n  File "t1.py", line 6, in __init_subclass__\r\n    object.__new__(cls)\r\nAttributeError: __abstractmethods__\r\n```\r\n\r\n‌\r\n\r\nOriginal code, which shows the purpose of this pattern:\r\n\r\n[https://github.com/pydata/xarray/blob/4254b4af33843f711459e5242018cd1d678ad3a0/xarray/core/common.py#L186-L208](https://github.com/pydata/xarray/blob/4254b4af33843f711459e5242018cd1d678ad3a0/xarray/core/common.py#L186-L208)\r\n\r\n‌',
      createdAt: '2019-10-07T21:14:37.385376+00:00',
      updatedAt: '2019-10-08T08:17:07.484073+00:00',
      closedAt: undefined,
      state: 'resolved',
      id: '{54220cd1-b139-4188-9455-1e13e663f1ac}',
    },
    {
      user: {
        id: '{0bf76802-9745-4251-a11c-ae0c40dcc641}',
        login: 'rlamy',
        url: 'https://bitbucket.org/%7B0bf76802-9745-4251-a11c-ae0c40dcc641%7D/',
      },
      url: 'https://bitbucket.org/pypy/pypy',
      body:
        '`pypy/module/sys/test/test_sysmodule.py::AppTestAppSysTests::()::test_getfilesystemencoding` is failing on my machine, though not on buildbot.',
      createdAt: '2019-10-02T19:28:13.669492+00:00',
      updatedAt: '2019-10-03T06:25:54.112598+00:00',
      closedAt: undefined,
      state: 'new',
      id: '{54220cd1-b139-4188-9455-1e13e663f1ac}',
    },
    {
      user: {
        id: '{1c7872c7-e965-4d00-9496-7087889e5b24}',
        login: 'fish2000',
        url: 'https://bitbucket.org/%7B1c7872c7-e965-4d00-9496-7087889e5b24%7D/',
      },
      url: 'https://bitbucket.org/pypy/pypy',
      body:
        'I produced this fairly minimal example:\r\n\r\n‌\r\n\r\n```python\r\n# -*- encoding: utf-8 -*-\r\nfrom __future__ import print_function\r\n\r\nimport abc\r\n\r\nclass Metabase(abc.ABCMeta):\r\n    \r\n    def __new__(metacls, name, bases, attributes, **kwargs):\r\n        # Call up:\r\n        return super(Metabase, metacls).__new__(metacls, name,\r\n                                                         bases,\r\n                                                         attributes,\r\n                                                       **kwargs)\r\n\r\nclass Metaclass(Metabase):\r\n    \r\n    def __new__(metacls, name, bases, attributes, metakeyword="meta", **kwargs):\r\n        # Stow metaclass keyword in attributes:\r\n        if \'metakeyword\' not in attributes:\r\n            attributes[\'metakeyword\'] = metakeyword\r\n        \r\n        # Remove metaclass’ keyword and call up:\r\n        return super(Metaclass, metacls).__new__(metacls, name,\r\n                                                          bases,\r\n                                                          attributes,\r\n                                                        **kwargs)\r\n\r\nclass Mixin(abc.ABC, metaclass=Metabase):\r\n    \r\n    @classmethod\r\n    def __init_subclass__(cls, mixinkeyword="mixin", **kwargs):\r\n        # Remove mixins’ keyword and call up:\r\n        super(Mixin, cls).__init_subclass__(**kwargs)\r\n        \r\n        # Stow mixin keyword on subclass:\r\n        cls.mixinkeyword = mixinkeyword\r\n\r\nclass Base(Mixin, metaclass=Metaclass):\r\n    pass\r\n\r\nclass Derived(Base, mixinkeyword="derived-mixin",\r\n                    metakeyword="derived-meta"):\r\n    pass\r\n\r\ndef test():\r\n    d = Derived()\r\n    print(d)\r\n    print(d.mixinkeyword)\r\n    print(d.metakeyword)\r\n\r\nif __name__ == \'__main__\':\r\n    test()\r\n```\r\n\r\n‌\r\n\r\n… if this is run with `python3 class-kwargs.py` :grinning: \r\n\r\n… if this is run with `pypy3 class-kwargs.py` :sob: \r\n\r\n‌\r\n\r\n```python\r\nTraceback (most recent call last):\r\n  File ".script-bin/class-kwargs.py", line 43, in <module>\r\n    metakeyword="derived-meta"):\r\n  File ".script-bin/class-kwargs.py", line 27, in __new__\r\n    **kwargs)\r\n  File ".script-bin/class-kwargs.py", line 14, in __new__\r\n    **kwargs)\r\nTypeError: __new__() got an unexpected keyword argument \'mixinkeyword\'\r\n```\r\n\r\n‌\r\n\r\n… the output of `python3 --version` is `Python 3.7.4`\r\n\r\n… the output of `pypy3 --version` is:\r\n\r\n```plaintext\r\nPython 3.6.1 (784b254d669919c872a505b807db8462b6140973, Sep 04 2019, 12:08:51)\r\n[PyPy 7.1.1-beta0 with GCC 4.2.1 Compatible Apple LLVM 10.0.1 (clang-1001.0.46.4)]\r\n```\r\n\r\nThere were, as far as I have been able to see looking through the docs, no major changes made to the way `__init_subclass__(…)` or metaclass keyword arguments worked between Python 3.6.1 and Python 3.7.\r\n\r\nThe `class-kwargs.py` script is attached here.',
      createdAt: '2019-09-17T03:08:11.791725+00:00',
      updatedAt: '2019-10-02T20:52:01.613993+00:00',
      closedAt: undefined,
      state: 'new',
      id: '{54220cd1-b139-4188-9455-1e13e663f1ac}',
    },
    {
      user: {
        id: '{dfa073eb-c602-4740-83ef-a8fe8ee03dfd}',
        login: 'stefanor',
        url: 'https://bitbucket.org/%7Bdfa073eb-c602-4740-83ef-a8fe8ee03dfd%7D/',
      },
      url: 'https://bitbucket.org/pypy/pypy',
      body:
        'PyPy 2.7 7.2.0rc0 fails to build RevDB with this:\r\n\r\n```\r\ngcc -O3 -pthread -fomit-frame-pointer -Wall -Wno-unused -Wno-address -fdebug-prefix-map=/<<BUILDDIR>>/pypy-7.2.0~rc0+dfsg=. -Wformat -Werror=format-security -DPYPY_USING_BOEHM_GC -DPYPY_BOEHM_WITH_HEADER -DPy_BUILD_CORE -DPy_BUILD_CORE -DPy_BUILD_CORE -DPy_BUILD_CORE -o pypy_module_time.o -c pypy_module_time.c -I"/<<BUILDDIR>>/pypy-7.2.0~rc0+dfsg/rpython"/translator/c -I"/<<BUILDDIR>>/pypy-7.2.0~rc0+dfsg/rpython"/translator/revdb -I"/<<BUILDDIR>>/pypy-7.2.0~rc0+dfsg/rpython"/../pypy/module/cpyext/include -I"/<<BUILDDIR>>/pypy-7.2.0~rc0+dfsg/rpython"/../pypy/module/cpyext/parse -I"/<<BUILDDIR>>/pypy-7.2.0~rc0+dfsg/rpython"/../build-tmp/usession-debian-0 -I"/<<BUILDDIR>>/pypy-7.2.0~rc0+dfsg/rpython"/../pypy/module/_cffi_backend/src -I"/<<BUILDDIR>>/pypy-7.2.0~rc0+dfsg/rpython"/rlib/rjitlog/src -I"/<<BUILDDIR>>/pypy-7.2.0~rc0+dfsg/rpython"/../pypy/module/_multibytecodec -I"/<<BUILDDIR>>/pypy-7.2.0~rc0+dfsg/rpython"/../pypy/module/operator\r\npypy_module_sys.c: In function \'pypy_g_setrecursionlimit\':\r\npypy_module_sys.c:956:2: warning: implicit declaration of function \'OP_GC_INCREASE_ROOT_STACK_\r\nDEPTH\' [-Wimplicit-function-declaration]\r\n  956 |  OP_GC_INCREASE_ROOT_STACK_DEPTH(l_v414508, /* nothing */);\r\n      |  ^~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\r\npypy_module_sys.c:956:58: error: expected expression before \')\' token\r\n  956 |  OP_GC_INCREASE_ROOT_STACK_DEPTH(l_v414508, /* nothing */);\r\n      |                                                          ^\r\n```\r\n\r\n‌',
      createdAt: '2019-10-02T12:35:02.373075+00:00',
      updatedAt: '2019-10-02T13:57:52.013431+00:00',
      closedAt: undefined,
      state: 'resolved',
      id: '{54220cd1-b139-4188-9455-1e13e663f1ac}',
    },
    {
      user: {
        id: '{d2a7a9ea-021e-45fc-9712-a34d8834d6bf}',
        login: 'lesshaste',
        url: 'https://bitbucket.org/%7Bd2a7a9ea-021e-45fc-9712-a34d8834d6bf%7D/',
      },
      url: 'https://bitbucket.org/pypy/pypy',
      body:
        'Python 3.6.1 \\(7.1.1\\+dfsg-1~ppa1~ubuntu16.04, Aug 09 2019, 16:05:52\\)  \r\n\\[PyPy 7.1.1 with GCC 5.4.0 20160609\r\n\r\nPython 2.7.13 \\(7.1.1\\+dfsg-1~ppa1~ubuntu16.04, Aug 09 2019, 13:41:07\\)  \r\n\\[PyPy 7.1.1 with GCC 5.4.0 20160609\\]\r\n\r\nThe following code causes both pypy 3.6.1 and 2.7.13 to segfault.\r\n\r\n```python\r\nfrom math import factorial\r\nimport resource, sys\r\nresource.setrlimit(resource.RLIMIT_STACK, (2**29,-1))\r\nsys.setrecursionlimit(10**6)\r\ndef c(n, k):\r\n    if k < 0:\r\n        return 0\r\n    k = min(k, n*(n-1)/2)\r\n    if (n, k) in ct:\r\n        return ct[(n, k)]\r\n    ct[(n, k)] = c(n, k-1) + c(n-1, k) - c(n-1, k-n)\r\n    return ct[(n, k)]\r\n\r\n\r\nn = 200\r\nct = {(0, 0): 1}\r\nprint(c(n,int(n*(n-1)/4))/factorial(n))\r\n```\r\n\r\nThe same code runs quickly and without error in python version 2 and 3. On IRC @Dejan reports that the code runs without fault using pypy 3.7 on the same machine/OS where it fails for pypy 3.6.',
      createdAt: '2019-10-02T11:06:31.399580+00:00',
      updatedAt: '2019-10-02T13:41:02.111203+00:00',
      closedAt: undefined,
      state: 'resolved',
      id: '{54220cd1-b139-4188-9455-1e13e663f1ac}',
    },
    {
      user: {
        id: '{eb327c54-cadd-4fce-9edd-f8fe047a9b93}',
        login: 'paugier',
        url: 'https://bitbucket.org/%7Beb327c54-cadd-4fce-9edd-f8fe047a9b93%7D/',
      },
      url: 'https://bitbucket.org/pypy/pypy',
      body:
        'As explained here [https://bitbucket.org/blog/sunsetting-mercurial-support-in-bitbucket](https://bitbucket.org/blog/sunsetting-mercurial-support-in-bitbucket), **Mercurial features and repositories will be officially removed from Bitbucket and its API on June 1, 2020.**\r\n\r\nI guess you thought about what to do for PyPy repository and PyPy development.\r\n\r\nI am also a Mercurial user and I am facing the same problem for some repositories. Thus, I am very interested to know what you plan to do.\r\n\r\nIn particular, I am looking for a good forge for the Transonic project \\([https://transonic.readthedocs.io](https://transonic.readthedocs.io)\\), which by the way is compatible with PyPy3.6 \\(currently only the nightly builds\\) and could help a wider adoption of PyPy3 for projects using the Python scientific stack \\(just by accelerating the numerical kernels using Numpy and let PyPy accelerate pure Python code\\).\r\n\r\nI follow the Heptapod project [https://heptapod.net/](https://heptapod.net/) \\(a friendly fork of GitLab to bring very good Mercurial support\\). It seems to me that it starts to be nearly production ready and that it would nicely fit your workflow with Mercurial. \r\n\r\nOf course, it would be very convenient if a common instance \\(free to use for simple users until a certain point\\) could be setup \\(something somehow similar to Github, but with Mercurial support\\). Even for PyPy, it would be good in terms of visibility.\r\n\r\nI also heard that your repository would have to be fixed to be able to use Heptapod.\r\n\r\nWhat is the current status of these issues for PyPy? Have you already decided what to do?\r\n\r\n‌',
      createdAt: '2019-09-30T14:26:36.693081+00:00',
      updatedAt: '2019-09-30T16:51:48.908502+00:00',
      closedAt: undefined,
      state: 'new',
      id: '{54220cd1-b139-4188-9455-1e13e663f1ac}',
    },
    {
      user: {
        id: '{294cc968-484d-4486-ba59-a002cc168c16}',
        login: 'Sasquatch',
        url: 'https://bitbucket.org/%7B294cc968-484d-4486-ba59-a002cc168c16%7D/',
      },
      url: 'https://bitbucket.org/pypy/pypy',
      body:
        'I am trying to get matplotlib working on my machine with pypy, but it seems tkinter is causing problems. I installed pypy from the nightly builds as recommend from here [https://stackoverflow.com/questions/56826170/value-error-invalid-argument-with-pypy-when-importing-pandas-and-plotly](https://stackoverflow.com/questions/56826170/value-error-invalid-argument-with-pypy-when-importing-pandas-and-plotly) When I import tkinter however, I get: \r\n\r\n‌\r\n\r\n```python\r\n>>>> import tkinter\r\nTraceback (most recent call last):\r\n  File "<stdin>", line 1, in <module>\r\n  File "C:\\pypy-c-jit-96765-24757bd09ed9-win32\\lib-python\\3\\tkinter\\__init__.py"\r\n, line 36, in <module>\r\n    import _tkinter # If this fails your Python may not be configured for Tk\r\n  File "C:\\pypy-c-jit-96765-24757bd09ed9-win32\\lib_pypy\\_tkinter\\__init__.py", l\r\nine 55, in <module>\r\n    tklib.Tcl_FindExecutable(os.fsencode(sys.executable))\r\n  File "C:\\pypy-c-jit-96765-24757bd09ed9-win32\\lib-python\\3\\os.py", line 800, in\r\n fsencode\r\n    return filename.encode(encoding, errors)\r\nUnicodeEncodeError: \'mbcs\' codec can\'t encode characters in position 0--1: mbcs\r\nencoding does not support errors=\'surrogateescape\'\r\n```\r\n\r\nAnd thus:\r\n\r\n```\r\n>>>> import matplotlib.pyplot\r\nTraceback (most recent call last):\r\n  File "<stdin>", line 1, in <module>\r\n  File "C:\\pypy-c-jit-96765-24757bd09ed9-win32\\site-packages\\matplotlib\\pyplot.p\r\ny", line 2355, in <module>\r\n    switch_backend(rcParams["backend"])\r\n  File "C:\\pypy-c-jit-96765-24757bd09ed9-win32\\site-packages\\matplotlib\\pyplot.p\r\ny", line 221, in switch_backend\r\n    backend_mod = importlib.import_module(backend_name)\r\n  File "C:\\pypy-c-jit-96765-24757bd09ed9-win32\\lib-python\\3\\importlib\\__init__.p\r\ny", line 126, in import_module\r\n    return _bootstrap._gcd_import(name[level:], package, level)\r\n  File "<frozen importlib._bootstrap>", line 979, in _gcd_import\r\n  File "<frozen importlib._bootstrap>", line 962, in _find_and_load\r\n  File "<frozen importlib._bootstrap>", line 951, in _find_and_load_unlocked\r\n  File "<frozen importlib._bootstrap>", line 656, in _load_unlocked\r\n  File "<builtin>/frozen importlib._bootstrap_external", line 691, in exec_modul\r\ne\r\n  File "<frozen importlib._bootstrap>", line 206, in _call_with_frames_removed\r\n  File "C:\\pypy-c-jit-96765-24757bd09ed9-win32\\site-packages\\matplotlib\\backends\r\n\\backend_tkagg.py", line 1, in <module>\r\n    from . import _backend_tk\r\n  File "C:\\pypy-c-jit-96765-24757bd09ed9-win32\\site-packages\\matplotlib\\backends\r\n\\_backend_tk.py", line 6, in <module>\r\n    import tkinter as tk\r\n  File "C:\\pypy-c-jit-96765-24757bd09ed9-win32\\lib-python\\3\\tkinter\\__init__.py"\r\n, line 36, in <module>\r\n    import _tkinter # If this fails your Python may not be configured for Tk\r\n  File "C:\\pypy-c-jit-96765-24757bd09ed9-win32\\lib_pypy\\_tkinter\\__init__.py", l\r\nine 55, in <module>\r\n    tklib.Tcl_FindExecutable(os.fsencode(sys.executable))\r\n  File "C:\\pypy-c-jit-96765-24757bd09ed9-win32\\lib-python\\3\\os.py", line 800, in\r\n fsencode\r\n    return filename.encode(encoding, errors)\r\nUnicodeEncodeError: \'mbcs\' codec can\'t encode characters in position 0--1: mbcs\r\nencoding does not support errors=\'surrogateescape\'\r\n```',
      createdAt: '2019-07-03T12:54:07.730528+00:00',
      updatedAt: '2019-09-26T03:44:20.184650+00:00',
      closedAt: undefined,
      state: 'new',
      id: '{54220cd1-b139-4188-9455-1e13e663f1ac}',
    },
    {
      user: {
        id: '{7b6aba1c-1c03-4f45-b6da-713d37fe0e9f}',
        login: 'nulano',
        url: 'https://bitbucket.org/%7B7b6aba1c-1c03-4f45-b6da-713d37fe0e9f%7D/',
      },
      url: 'https://bitbucket.org/pypy/pypy',
      body:
        'Running recent nightly of pypy3.6 \\(`pypy-c-jit-97573-3035e3be6a6d-win32`\\) on Windows with active codepage 65001 gives the following error:\r\n\r\n‌\r\n\r\n```\r\nC:\\pypy-c-jit-97573-3035e3be6a6d-win32>chcp 65001\r\nActive code page: 65001\r\n\r\nC:\\pypy-c-jit-97573-3035e3be6a6d-win32>pypy3\r\ndebug: OperationError:\r\ndebug:  operror-type: LookupError\r\ndebug:  operror-value: cp65001 encoding is only available on Windows\r\n\r\nC:\\pypy-c-jit-97573-3035e3be6a6d-win32>\r\n```\r\n\r\nFound with Pillow tests on GitHub Actions: https://github.com/nulano/Pillow/runs/234636672#step:16:1340\r\n\r\nThe same issue was closed in 2013 as “will fix for pypy3.3”: https://bitbucket.org/pypy/pypy/issues/1613/utf-8-encoding-problem-with-powershell-on\r\n\r\nIs there any update on this?',
      createdAt: '2019-09-25T06:55:52.241789+00:00',
      updatedAt: '2019-09-25T06:55:52.241789+00:00',
      closedAt: undefined,
      state: 'new',
      id: '{54220cd1-b139-4188-9455-1e13e663f1ac}',
    },
    {
      user: {
        id: '{0bf76802-9745-4251-a11c-ae0c40dcc641}',
        login: 'rlamy',
        url: 'https://bitbucket.org/%7B0bf76802-9745-4251-a11c-ae0c40dcc641%7D/',
      },
      url: 'https://bitbucket.org/pypy/pypy',
      body:
        'See [test\\_f\\_lineno\\_set\\_4\\(\\) in apptest\\_pyframe.py](https://bitbucket.org/pypy/pypy/src/013d6f1424147ce704f90a871caf4e3a079a5352/pypy/interpreter/test/apptest_pyframe.py#lines-168). The core issue is that POP\\_BLOCK/END\\_FINALLY opcodes can disappear if they happen to be in dead code, i.e. if there is an unconditional return in the block they end. In such a case, PyFrame.fset\\_f\\_lineno considers the bytecode invalid and raises a SystemError.',
      createdAt: '2019-08-31T22:03:05.385002+00:00',
      updatedAt: '2019-09-24T15:57:58.889093+00:00',
      closedAt: undefined,
      state: 'resolved',
      id: '{54220cd1-b139-4188-9455-1e13e663f1ac}',
    },
    {
      user: {
        id: '{7b6aba1c-1c03-4f45-b6da-713d37fe0e9f}',
        login: 'nulano',
        url: 'https://bitbucket.org/%7B7b6aba1c-1c03-4f45-b6da-713d37fe0e9f%7D/',
      },
      url: 'https://bitbucket.org/pypy/pypy',
      body:
        'I’m trying to build Pillow on PyPy3.6 using latest nightly `pypy-c-jit-97573-3035e3be6a6d-win32`.\r\n\r\nI’m running into a SystemError:\r\n\r\n```\r\nE   SystemError: unexpected internal exception (please report a bug): <OutOfRange object at 0x566ed0c>; internal traceback was dumped to stderr\r\n\r\nc:\\pypy-c-jit-97573-3035e3be6a6d-win32\\lib-python\\3\\_strptime.py:95: SystemError\r\n---------------------------- Captured stderr call -----------------------------\r\nRPython traceback:\r\n  File "pypy_interpreter.c", line 46473, in BuiltinCode1_fastcall_1\r\n  File "implement_2.c", line 2303, in fastfunc_descr_lower_1_1\r\n  File "pypy_objspace_std_7.c", line 38028, in _lower_unicode\r\n  File "rpython_rlib.c", line 17550, in _nonascii_unichr_as_utf8_append\r\n```\r\n\r\nThis issue happens every time when running all Pillow tests, but running the failing test individually doesn’t reproduce this issue.\r\n\r\nFull log: [https://ci.appveyor.com/project/nulano/pillow/builds/27570685/job/3a9a5k889njigrkb#L8823](https://ci.appveyor.com/project/nulano/pillow/builds/27570685/job/3a9a5k889njigrkb#L8823)',
      createdAt: '2019-09-21T23:15:45.555748+00:00',
      updatedAt: '2019-09-24T05:40:04.531832+00:00',
      closedAt: undefined,
      state: 'resolved',
      id: '{54220cd1-b139-4188-9455-1e13e663f1ac}',
    },
    {
      user: {
        id: '{35f00383-2f5a-4b73-be04-8ffbffdd2c3d}',
        login: 'Mukesh D',
        url: 'https://bitbucket.org/%7B35f00383-2f5a-4b73-be04-8ffbffdd2c3d%7D/',
      },
      url: 'https://bitbucket.org/pypy/pypy',
      body:
        'P**lease help me solve any of the following cases: Any help would be greatly appreciated.**\r\n\r\nI’m trying to install pypy3 on Windows and Linux. However, getting error in both the cases\r\n\r\n‌\r\n\r\n```\r\nUIM;UIM_LS]SQL Error: cannot commit transaction - SQL statements in progress\r\nProcess Process-1:\r\nTraceback (most recent call last):\r\n  File "/opt/pypy_3.5_src_build/lib-python/3/multiprocessing/process.py", line 249, in _bootstrap\r\n    self.run()\r\n  File "/opt/pypy_3.5_src_build/lib-python/3/multiprocessing/process.py", line 93, in run\r\n    self._target(*self._args, **self._kwargs)\r\n  File "/home/ubuntu/8.12/log/logging.py", line 46, in sqlite_worker\r\n    stream.create_index()\r\n  File "/home/ubuntu/8.12/log/handler.py", line 148, in create_index\r\n    \'\'\'CREATE INDEX index_name ON sql_table(ID)\'\'\'\r\n  File "/opt/pypy_3.5_src_build/lib_pypy/_sqlite3.py", line 770, in wrapper\r\n    return func(self, *args, **kwargs)\r\n  File "/opt/pypy_3.5_src_build/lib_pypy/_sqlite3.py", line 949, in execute\r\n    return self.__execute(False, sql, [params])\r\n  File "/opt/pypy_3.5_src_build/lib_pypy/_sqlite3.py", line 890, in __execute\r\n    self.__connection.commit()\r\n  File "/opt/pypy_3.5_src_build/lib_pypy/_sqlite3.py", line 475, in commit\r\n    raise self._get_exception(ret)\r\n_sqlite3.OperationalError: cannot commit transaction - SQL statements in progress\r\n```\r\n\r\n‌\r\n\r\n**Case 1 Linux : CentOS/Ubuntu - Can not compile from pypy source:**\r\n\r\nSince pypy3.6 ./path/bin/pypy3 my\\_python\\_file.py is running into errors. I’m trying to build from source code. I checked out from pypy repo and did following steps with `hg update pypy 3.6`\r\n\r\nRunninginto Memory Errors on both Pypy 3.6 beta and nightly build . i tried to build from pypy source however getting following error in command\r\n\r\n`which pypy`  \r\n`/usr/bin/pypy`\r\n\r\n‌\r\n\r\n```\r\n‌\r\n1:~/pypy/pypy/pypy/goal$ pypy ../../rpython/bin/rpython -Ojit targetpypystandalone\r\n[translation:info] 2.7.13 (5.10.0+dfsg-3build2, Feb 06 2018, 18:37:50)\r\n[PyPy 5.10.0 with GCC 7.3.0]\r\n[platform:msg] Set platform with \'host\' cc=None, using cc=\'gcc\', version=\'Unknown\'\r\n[translation:info] Translating target as defined by targetpypystandalone\r\n```\r\n\r\n> `File "/home/ubuntu/pypy/pypy/rpython/translator/goal/translate.py", line 318, in main`\r\n>\r\n> `drv.proceed(goals)`\r\n>\r\n> `File "/home/ubuntu/pypy/pypy/rpython/translator/driver.py", line 554, in proceed`\r\n>\r\n> `result = self._execute(goals, task_skip = self._maybe_skip())`\r\n>\r\n> `File "/home/ubuntu/pypy/pypy/rpython/translator/tool/taskengine.py", line 114, in _execute`\r\n>\r\n> `res = self._do(goal, taskcallable, *args, **kwds)`\r\n>\r\n> `File "/home/ubuntu/pypy/pypy/rpython/translator/driver.py", line 278, in _do`\r\n>\r\n> `res = func()`\r\n>\r\n> `File "/home/ubuntu/pypy/pypy/rpython/translator/driver.py", line 521, in task_compile_c`\r\n>\r\n> `cbuilder.compile(**kwds)`\r\n>\r\n> `File "/home/ubuntu/pypy/pypy/rpython/translator/c/genc.py", line 362, in compile`\r\n>\r\n> `extra_opts)`\r\n>\r\n> `File "/home/ubuntu/pypy/pypy/rpython/translator/platform/posix.py", line 242, in execute_makefile`\r\n>\r\n> `self._handle_error(returncode, stdout, stderr, path.join(\'make\'))`\r\n>\r\n> `File "/home/ubuntu/pypy/pypy/rpython/translator/platform/__init__.py", line 155, in _handle_error`\r\n>\r\n> `raise CompilationError(stdout, stderr)`\r\n>\r\n> `[translation:ERROR] CompilationError: CompilationError(err="""`\r\n>\r\n> `cc1: out of memory allocating 65536 bytes after a total of 2088960 bytes`\r\n>\r\n> `virtual memory exhausted: Cannot allocate memory`\r\n>\r\n> `make: *** [testing_1.o] Error 1`\r\n>\r\n> `make: *** Waiting for unfinished jobs....`\r\n>\r\n> `make: *** [data_pypy_goal.o] Error 1`\r\n>\r\n> `""")`\r\n>\r\n> \\[Timer\\] Timings:  \r\n> \\[Timer\\] annotate --- 376.5 s  \r\n> \\[Timer\\] rtype\\_lltype --- 568.4 s  \r\n> \\[Timer\\] pyjitpl\\_lltype --- 340.1 s  \r\n> \\[Timer\\] ===========================================  \r\n> \\[Timer\\] Total: --- 1285.1 s  \r\n> \\[translation:info\\] Error:  \r\n> File "/home/ubuntu/pypy/pypy/rpython/translator/goal/translate.py", line 318, in main  \r\n> drv.proceed\\(goals\\)  \r\n> File "/home/ubuntu/pypy/pypy/rpython/translator/driver.py", line 554, in proceed  \r\n> result = self.\\_execute\\(goals, task\\_skip = self.\\_maybe\\_skip\\(\\)\\)  \r\n> File "/home/ubuntu/pypy/pypy/rpython/translator/tool/taskengine.py", line 114, in \\_execute  \r\n> res = self.\\_do\\(goal, taskcallable, \\*args, \\*\\*kwds\\)  \r\n> File "/home/ubuntu/pypy/pypy/rpython/translator/driver.py", line 278, in \\_do  \r\n> res = func\\(\\)  \r\n> File "/home/ubuntu/pypy/pypy/rpython/translator/driver.py", line 361, in task\\_pyjitpl\\_lltype  \r\n> backend\\_name=self.config.translation.jit\\_backend, inline=True\\)  \r\n> File "/home/ubuntu/pypy/pypy/rpython/jit/metainterp/warmspot.py", line 72, in apply\\_jit  \r\n> warmrunnerdesc.finish\\(\\)  \r\n> File "/home/ubuntu/pypy/pypy/rpython/jit/metainterp/warmspot.py", line 297, in finish  \r\n> self.annhelper.finish\\(\\)  \r\n> File "/home/ubuntu/pypy/pypy/rpython/rtyper/annlowlevel.py", line 218, in finish  \r\n> self.finish\\_annotate\\(\\)  \r\n> File "/home/ubuntu/pypy/pypy/rpython/rtyper/annlowlevel.py", line 238, in finish\\_annotate  \r\n> ann.complete\\_helpers\\(\\)  \r\n> File "/home/ubuntu/pypy/pypy/rpython/annotator/annrpython.py", line 118, in complete\\_helpers  \r\n> self.simplify\\(block\\_subset=self.added\\_blocks\\)  \r\n> File "/home/ubuntu/pypy/pypy/rpython/annotator/annrpython.py", line 360, in simplify  \r\n> extra\\_passes=extra\\_passes\\)  \r\n> File "/home/ubuntu/pypy/pypy/rpython/translator/transform.py", line 269, in transform\\_graph  \r\n> transform\\_dead\\_op\\_vars\\(ann, block\\_subset\\)  \r\n> File "/home/ubuntu/pypy/pypy/rpython/translator/transform.py", line 142, in transform\\_dead\\_op\\_vars  \r\n> transform\\_dead\\_op\\_vars\\_in\\_blocks\\(block\\_subset, self.translator.graphs\\)  \r\n> File "/home/ubuntu/pypy/pypy/rpython/translator/simplify.py", line 480, in transform\\_dead\\_op\\_vars\\_in\\_blocks  \r\n> flow\\_read\\_var\\_backward\\(set\\(read\\_vars\\)\\)  \r\n> File "/home/ubuntu/pypy/pypy/rpython/translator/simplify.py", line 475, in flow\\_read\\_var\\_backward  \r\n> for prevvar in dependencies\\[var\\]:  \r\n> **\\[translation:ERROR\\] MemoryError**  \r\n> **\\[translation\\] start debugger...**\r\n>\r\n> /home/ubuntu/pypy/pypy/rpytho\r\n>\r\n> ‌\r\n>\r\n> n/translator/simplify.py\\(475\\)flow\\_read\\_var\\_backward\\(\\)  \r\n> -> for prevvar in dependencies\\[var\\]:\r\n\r\n**Case 2: Windows 64 bit , Python 3.6 , pypy3.5-v7.0.0-win32**\r\n\r\n‌\r\n\r\n```python\r\npypy3 C:\\LAA\\8.12\\LAATranslator.py\r\n```\r\n\r\n> _**Error : Traceback \\(most recent call last\\):**_\r\n>\r\n> File "C:\\\\LAF\\\\8.12\\\\[interface.py](http://interface.py)", line 9, in **init**  \r\n> self.\\_\\_child, self.\\_\\_parent = Pipe\\(duplex=duplex\\)  \r\n> File "C:\\\\Users\\\\\\\\Downloads\\\\pypy3.5-v7.0.0-win32\\\\pypy3.5-v7.0.0-win32\\\\lib-python\\\\3\\\\multiprocessing\\\\[context.py](http://context.py)", line 61, in Pipe  \r\n> return Pipe\\(duplex\\)  \r\n> File "C:\\\\Users\\\\\\\\Downloads\\\\pypy3.5-v7.0.0-win32\\\\pypy3.5-v7.0.0-win32\\\\lib-python\\\\3\\\\multiprocessing\\\\[connection.py](http://connection.py)", line 552, in Pipe  \r\n> \\_, err = overlapped.GetOverlappedResult\\(True\\)  \r\n> File "C:\\\\Users\\\\\\\\Downloads\\\\pypy3.5-v7.0.0-win32\\\\pypy3.5-v7.0.0-win32\\\\lib\\_pypy\\_winapi.py", line 113, in GetOverlappedResult  \r\n> if self.completed and self.read\\_buffer:  \r\n> AttributeError: \'Overlapped\' object has no attribute \'read\\_buffer\'\r\n\r\n‌\r\n\r\n---\r\n\r\n‌\r\n\r\n‌\r\n\r\n---\r\n\r\n> ‌\r\n\r\n‌',
      createdAt: '2019-09-19T21:32:46.857683+00:00',
      updatedAt: '2019-09-23T17:28:13.268113+00:00',
      closedAt: undefined,
      state: 'new',
      id: '{54220cd1-b139-4188-9455-1e13e663f1ac}',
    },
    {
      user: {
        id: '{35f00383-2f5a-4b73-be04-8ffbffdd2c3d}',
        login: 'Mukesh D',
        url: 'https://bitbucket.org/%7B35f00383-2f5a-4b73-be04-8ffbffdd2c3d%7D/',
      },
      url: 'https://bitbucket.org/pypy/pypy',
      body:
        'P**lease help me solve the following cases: Any help would be greatly appreciated.**\r\n\r\nI’m trying to install pypy3 on Windows and Linux. However, getting SQL error . In normal python run everything runs fine. I’m using /pypy-c-jit-97558-b2dd9b388196-linux64   nightly build since i was getting more time date errors in official release \r\n\r\n‌\r\n\r\n```\r\nUIM;UIM_LS]SQL Error: cannot commit transaction - SQL statements in progress\r\nProcess Process-1:\r\nTraceback (most recent call last):\r\n  File "/opt/pypy_3.5_src_build/lib-python/3/multiprocessing/process.py", line 249, in _bootstrap\r\n    self.run()\r\n  File "/opt/pypy_3.5_src_build/lib-python/3/multiprocessing/process.py", line 93, in run\r\n    self._target(*self._args, **self._kwargs)\r\n  File "/home/ubuntu/8.12/log/logging.py", line 46, in sqlite_worker\r\n    stream.create_index()\r\n  File "/home/ubuntu/8.12/log/handler.py", line 148, in create_index\r\n    \'\'\'CREATE INDEX index_name ON sql_table(ID)\'\'\'\r\n  File "/opt/pypy_3.5_src_build/lib_pypy/_sqlite3.py", line 770, in wrapper\r\n    return func(self, *args, **kwargs)\r\n  File "/opt/pypy_3.5_src_build/lib_pypy/_sqlite3.py", line 949, in execute\r\n    return self.__execute(False, sql, [params])\r\n  File "/opt/pypy_3.5_src_build/lib_pypy/_sqlite3.py", line 890, in __execute\r\n    self.__connection.commit()\r\n  File "/opt/pypy_3.5_src_build/lib_pypy/_sqlite3.py", line 475, in commit\r\n    raise self._get_exception(ret)\r\n_sqlite3.OperationalError: cannot commit transaction - SQL statements in progress\r\n```\r\n\r\n‌',
      createdAt: '2019-09-22T23:05:13.678931+00:00',
      updatedAt: '2019-09-22T23:06:30.838599+00:00',
      closedAt: undefined,
      state: 'new',
      id: '{54220cd1-b139-4188-9455-1e13e663f1ac}',
    },
    {
      user: {
        id: '{6e5c1483-d502-4c38-a234-a61a7326682a}',
        login: 'ned',
        url: 'https://bitbucket.org/%7B6e5c1483-d502-4c38-a234-a61a7326682a%7D/',
      },
      url: 'https://bitbucket.org/pypy/pypy',
      body:
        'When creating a nested list, the settrace trace function is called with a “call” event.  \r\n\r\nThe list looks like:\r\n\r\n```\r\ndata = [\r\n    [ 0 ],\r\n    [ 1 ],\r\n    [ 2 ],\r\n    [ 3 ],\r\n    [ 4 ],\r\n    [ 5 ],\r\n    [ 6 ],\r\n    [ 7 ],\r\n    [ 8 ],\r\n    [ 9 ],\r\n]\r\n```\r\n\r\nWith PyPy 3.x, the call event is on line 1.\r\n\r\nWith PyPy 2.x, the location of the call event depends on the length of the list.  If the list is short \\(10 elements\\), the call event is on line 2, or if the list were more deeply nested, it would be whatever line had the first integer. If the list is long \\(2000 elements\\), the call event is on line 1.\r\n\r\nIt seems wrong that the length of the list would change the call event.\r\n\r\nCode to demonstrate the problem:\r\n\r\n```\r\n$ cat make_file.py\r\nimport sys\r\n\r\nnum = int(sys.argv[1])\r\n\r\nprint("data = [")\r\nfor i in range(num):\r\n    print("    [ {} ],".format(i))\r\nprint("]")\r\nprint("print(len(data))")\r\n\r\n$ python make_file.py 10 > short.py\r\n\r\n$ python make_file.py 2000 > long.py\r\n\r\n$ cat run.py\r\nimport os\r\nimport sys\r\n\r\nprint(sys.version)\r\n\r\nblacklist = ["frozen", "_structseq", "utf_8"]\r\n\r\ndef trace(frame, event, arg):\r\n    if event == \'call\':\r\n        fname = os.path.basename(frame.f_code.co_filename)\r\n        noise = any(bword in fname for bword in blacklist)\r\n        if not noise:\r\n            print("Call {}:{}".format(fname, frame.f_lineno))\r\n    return trace\r\n\r\nsys.settrace(trace)\r\nprint("short:")\r\nimport short\r\nprint("long:")\r\nimport long\r\n\r\n$ pypy2 run.py\r\n2.7.13 (8cdda8b8cdb8, Apr 14 2019, 14:06:58)\r\n[PyPy 7.1.1 with GCC 4.2.1 Compatible Apple LLVM 10.0.0 (clang-1000.11.45.5)]\r\nshort:\r\nCall short.py:2\r\n10\r\nlong:\r\nCall long.py:1\r\n2000\r\nCall app_main.py:96\r\n\r\n$ pypy3 run.py\r\n3.6.1 (784b254d6699, Apr 14 2019, 10:22:55)\r\n[PyPy 7.1.1-beta0 with GCC 4.2.1 Compatible Apple LLVM 10.0.0 (clang-1000.11.45.5)]\r\nshort:\r\nCall short.py:1\r\n10\r\nlong:\r\nCall long.py:1\r\n2000\r\nCall app_main.py:100\r\n\r\n$ cat short.py\r\ndata = [\r\n    [ 0 ],\r\n    [ 1 ],\r\n    [ 2 ],\r\n    [ 3 ],\r\n    [ 4 ],\r\n    [ 5 ],\r\n    [ 6 ],\r\n    [ 7 ],\r\n    [ 8 ],\r\n    [ 9 ],\r\n]\r\nprint(len(data))\r\n\r\n$\r\n```\r\n\r\n‌',
      createdAt: '2019-09-19T09:46:46.750855+00:00',
      updatedAt: '2019-09-21T16:03:44.379898+00:00',
      closedAt: undefined,
      state: 'new',
      id: '{54220cd1-b139-4188-9455-1e13e663f1ac}',
    },
    {
      user: {
        id: '{97743e0b-c5cc-4eb7-8f39-0025d103717e}',
        login: 'Fabio Zadrozny',
        url: 'https://bitbucket.org/%7B97743e0b-c5cc-4eb7-8f39-0025d103717e%7D/',
      },
      url: 'https://bitbucket.org/pypy/pypy',
      body:
        'I hope the output from the console is enough to show the error \\(I get this by just unzipping pypy and running the commands below\\).\r\n\r\n```\r\nc:\\bin\\pypy3.6-v7.1.1-win32\\pypy3.exe\r\nPython 3.6.1 (784b254d6699, Apr 16 2019, 12:10:48)\r\n[PyPy 7.1.1-beta0 with MSC v.1910 32 bit] on win32\r\n> from pathlib import Path\r\n> Path().resolve()\r\nTraceback (most recent call last):\r\n  File "<stdin>", line 1, in <module>\r\n  File "c:\\bin\\pypy3.6-v7.1.1-win32\\lib-python\\3\\pathlib.py", line 1122, in resolve\r\n    s = self._flavour.resolve(self, strict=strict)\r\n  File "c:\\bin\\pypy3.6-v7.1.1-win32\\lib-python\\3\\pathlib.py", line 192, in resolve\r\n    s = self._ext_to_normal(_getfinalpathname(s))\r\nRuntimeError\r\n> exit()\r\n```',
      createdAt: '2019-08-29T19:11:51.474764+00:00',
      updatedAt: '2019-09-21T15:46:16.598260+00:00',
      closedAt: undefined,
      state: 'resolved',
      id: '{54220cd1-b139-4188-9455-1e13e663f1ac}',
    },
    {
      user: {
        id: '{97743e0b-c5cc-4eb7-8f39-0025d103717e}',
        login: 'Fabio Zadrozny',
        url: 'https://bitbucket.org/%7B97743e0b-c5cc-4eb7-8f39-0025d103717e%7D/',
      },
      url: 'https://bitbucket.org/pypy/pypy',
      body:
        "I’m not sure if this is the same as: [https://bitbucket.org/pypy/pypy/issues/3067/error-getting-locals-for-frame-from-a](https://bitbucket.org/pypy/pypy/issues/3067/error-getting-locals-for-frame-from-a) \\(internally it may be, but the way to reproduce is very different and this is much more critical to the debugger, so, I’m doing a new report\\).\r\n\r\nJust to give some background, without being able to set the frame tracing from a different thread, the `pydevd` debugger is not able to change breakpoints \\(in `pydevd` the frame is checked to see if it has a breakpoint and if it has it's traced, if it doesn't have a breakpoint it runs untraced -- now, if a user adds a breakpoint later on, `pydevd` will set `frame.f_trace` for the frames that were previously untraced so that the breakpoints are re-evaluated, but this is not working on `pypy` due to this bug\\).\r\n\r\nI guess the debugger could workaround by disabling this optimization, but this is such a huge performance boost in most real-world cases when debugging \\(where there are breakpoints only in a few places\\) that it'd be really nice if `PyPy` could properly support that.\r\n\r\nI'm attaching a test-case which shows the issue \\(this works in `CPython` but doesn't work in `PyPy`\\).",
      createdAt: '2019-09-03T12:46:27.392733+00:00',
      updatedAt: '2019-09-21T15:45:52.697365+00:00',
      closedAt: undefined,
      state: 'new',
      id: '{54220cd1-b139-4188-9455-1e13e663f1ac}',
    },
    {
      user: {
        id: '{569cc8ea-0d9e-41cb-94a4-19ea517324df}',
        login: 'asottile',
        url: 'https://bitbucket.org/%7B569cc8ea-0d9e-41cb-94a4-19ea517324df%7D/',
      },
      url: 'https://bitbucket.org/pypy/pypy',
      body:
        "### sample script\r\n\r\n```python\r\nimport os\r\nimport pathlib\r\n\r\nopen('a', 'a+').close()\r\nos.replace('a', pathlib.Path('b'))\r\n```\r\n\r\n### pypy output\r\n\r\n```console\r\n$ ./pypy3.6-v7.1.0-linux64/bin/pypy3 --version\r\nPython 3.6.1 (de061d87e39c, Mar 24 2019, 22:18:07)\r\n[PyPy 7.1.0-beta0 with GCC 6.2.0 20160901]\r\n$ ./pypy3.6-v7.1.0-linux64/bin/pypy3 x.py \r\nTraceback (most recent call last):\r\n  File \"x.py\", line 5, in <module>\r\n    os.replace('a', pathlib.Path('b'))\r\nTypeError: 'PosixPath' does not support the buffer interface\r\n```\r\n\r\n### cpython output\r\n\r\n```console\r\n$ python3.6 --version --version\r\nPython 3.6.7 (default, Oct 22 2018, 11:32:17) \r\n[GCC 8.2.0]\r\n$ python3.6 x.py \r\n$\r\n```\r\n\r\n### misc\r\n\r\nthis was noticed while attempting to use https://github.com/ambv/black using pypy3.6\r\n\r\n### guess\r\n\r\nmy guess is this hasn't been updated from the changes in python3.6 as the error message matches exactly what is happening on pypy3.5:\r\n\r\n```\r\n$ pypy3 --version\r\nPython 3.5.3 (fdd60ed87e94, Apr 24 2018, 06:10:04)\r\n[PyPy 6.0.0 with GCC 6.2.0 20160901]\r\n$ pypy3 x.py \r\nTraceback (most recent call last):\r\n  File \"x.py\", line 5, in <module>\r\n    os.replace('a', pathlib.Path('b'))\r\nTypeError: 'PosixPath' does not support the buffer interface\r\n\r\n$ python3.5 --version --version\r\nPython 3.5.7\r\n$ python3.5 x.py \r\nTraceback (most recent call last):\r\n  File \"x.py\", line 5, in <module>\r\n    os.replace('a', pathlib.Path('b'))\r\nTypeError: replace: illegal type for dst parameter\r\n```",
      createdAt: '2019-03-31T19:33:56.119563+00:00',
      updatedAt: '2019-09-19T10:17:42.047874+00:00',
      closedAt: undefined,
      state: 'resolved',
      id: '{54220cd1-b139-4188-9455-1e13e663f1ac}',
    },
    {
      user: {
        id: '{285c6c37-a8ed-4aad-8bd2-661a0814309d}',
        login: 'cfbolz',
        url: 'https://bitbucket.org/%7B285c6c37-a8ed-4aad-8bd2-661a0814309d%7D/',
      },
      url: 'https://bitbucket.org/pypy/pypy',
      body:
        'On shutdown, CPython will carefully do stuff to free memory and call remaining finalizers. PyPy doesn’t, it just flushes buffers and closes files. That’s not documented in `cpython_differences.rst` and it should be.',
      createdAt: '2019-09-19T10:09:01.166150+00:00',
      updatedAt: '2019-09-19T10:09:01.166150+00:00',
      closedAt: undefined,
      state: 'new',
      id: '{54220cd1-b139-4188-9455-1e13e663f1ac}',
    },
    {
      user: {
        id: '{c60c3a57-bc0e-4cd2-9a9e-c64cd68e10b4}',
        login: 'njs',
        url: 'https://bitbucket.org/%7Bc60c3a57-bc0e-4cd2-9a9e-c64cd68e10b4%7D/',
      },
      url: 'https://bitbucket.org/pypy/pypy',
      body:
        'With pypy 5.8, `ldd pypy` shows that it\'s linked to `libbz2`, `libcrypto`, `libffi`, `libncurses`, ... Likewise for pypy3 5.8 and `ldd pypy3.5`.\r\n\r\nYou would not think so, but it turns out that this is a big problem for distributing wheels.\r\n\r\nThe issue is that the way ELF works, any libraries that show up in `ldd $TOPLEVELBINARY` effectively get LD_PRELOADed into any extension modules that you load later. So, for example, if some wheel distributes its own version of openssl, then any symbols that show up in both their copy of openssl and pypy\'s copy of openssl will get shadowed and hello segfaults.\r\n\r\nThe cryptography project recently ran into this with uwsgi: https://github.com/pyca/cryptography/issues/3804#issuecomment-317401627\r\n\r\nFortunately this has not been a big deal so far because, uh... nobody distributes pypy wheels. But in the future maybe this is something that should be supported :-). And while in theory it would be nice if this could be fixed on the wheel side, [this is not trivial](https://github.com/pypa/auditwheel/issues/79).\r\n\r\nThe obvious solution would be to switch things around so that the top-level pypy executable does `dlopen("libpypy-c.so", RTLD_LOCAL)` to start the interpreter, instead of linking against it with `-lpypy-c`. Then the symbols from `libpypy-c.so` and everything it links to would be confined to an ELF local namespace, and would stop polluting the namespace of random extension modules.\r\n\r\nHowever... there is a problem, which is that cpyext extension modules need *some* way to get at the C API symbols, and I assume cffi extension modules need access to some pypy symbols as well.\r\n\r\nThis is... tricky, given how rpython wants to mush everything together into one giant .so, and ELF makes it difficult to only expose *some* symbols from a binary like this. Some options:\r\n\r\n* when using libcrypto or whatever from rpython, use `dlopen("libcrypto", RTLD_LOCAL)` instead of `-lcrypto`. I guess this could be done systematically in rffi?\r\n* provide a special `libcpyext` that uses `dlopen` to fetch the symbols from `libpypy-c.so` and then manually re-exports them?',
      createdAt: '2017-07-25T05:05:33.138427+00:00',
      updatedAt: '2019-09-19T08:50:21.993156+00:00',
      closedAt: undefined,
      state: 'new',
      id: '{54220cd1-b139-4188-9455-1e13e663f1ac}',
    },
    {
      user: {
        id: '{0bf76802-9745-4251-a11c-ae0c40dcc641}',
        login: 'rlamy',
        url: 'https://bitbucket.org/%7B0bf76802-9745-4251-a11c-ae0c40dcc641%7D/',
      },
      url: 'https://bitbucket.org/pypy/pypy',
      body:
        "Comparing CPython3.5.2 with current pypy3 (py3.5 branch), the following attributes are missing from `dir(posix)`:\r\n```\r\n['CLD_CONTINUED', 'CLD_DUMPED', 'CLD_EXITED', 'CLD_TRAPPED', 'F_LOCK', 'F_TEST',\r\n'F_TLOCK', 'F_ULOCK', 'O_ACCMODE', 'O_PATH', 'O_TMPFILE', 'P_ALL', 'P_PGID', 'P_PID',\r\n'SCHED_IDLE', 'SCHED_RESET_ON_FORK', 'SEEK_DATA', 'SEEK_HOLE', 'WEXITED', 'WNOWAIT',\r\n'WSTOPPED', 'XATTR_CREATE', 'XATTR_REPLACE', 'XATTR_SIZE_MAX',\r\n'getgrouplist', 'getxattr', 'listxattr', 'lockf', 'readv', 'removexattr',\r\n'sched_getaffinity', 'sched_getparam', 'sched_getscheduler', 'sched_param',\r\n'sched_rr_get_interval', 'sched_setaffinity', 'sched_setparam', 'sched_setscheduler',\r\n'sched_yield', 'setxattr', 'times_result', 'waitid', 'waitid_result', 'writev']\r\n```\r\nEdit: list as of 29/10/2017",
      createdAt: '2016-08-23T16:38:12.337126+00:00',
      updatedAt: '2019-09-16T00:13:20.287321+00:00',
      closedAt: undefined,
      state: 'new',
      id: '{54220cd1-b139-4188-9455-1e13e663f1ac}',
    },
  ],
  totalCount: 20,
  hasNextPage: true,
  hasPreviousPage: false,
  page: 1,
  perPage: 20,
};

export const getIssueResponse = {
  id: '{54220cd1-b139-4188-9455-1e13e663f1ac}',
  user: { login: 'stefanor', id: '{dfa073eb-c602-4740-83ef-a8fe8ee03dfd}', url: undefined },
  url: 'https://bitbucket.org/pypy/pypy/issues/3086/arm64-jit-lots-of-crashes',
  body:
    'As mentioned on IRC over the last few days.\r\n\r\nWhen I translate a JIT pypy2.7 from the 7.2 release branch \\(or hg HEAD\\) under cPython on arm64, I get an interpreter with an unstable JIT. It constantly crashes, with some variant of:\r\n\r\n```\r\n$ pypy/goal/pypy-c lib_pypy/_sqlite3_build.py\r\nRPython traceback:\r\n  File "rpython_jit_metainterp_10.c", line 25430, in send_loop_to_backend\r\n  File "rpython_jit_backend_aarch64.c", line 1690, in AssemblerARM64_assemble_loop\r\n  File "rpython_jit_backend_aarch64.c", line 4551, in AssemblerARM64__assemble\r\n  File "rpython_jit_backend_aarch64.c", line 13381, in AssemblerARM64__walk_operations\r\n  File "rpython_jit_backend_aarch64.c", line 52643, in ResOpAssembler_emit_op_zero_array\r\nFatal RPython error: AssertionError\r\n```\r\n\r\n`--jit off` works as usual.\r\n\r\nI can’t reproduce this with the pre-built [pypy2.7-v7.2.0rc0-aarch64.tar.bz2](https://bitbucket.org/pypy/pypy/downloads/pypy2.7-v7.2.0rc0-aarch64.tar.bz2), and it can translate pypy2.7 to produce a working JIT. OS is Debian sid. Haven’t tried pypy3.6, yet.\r\n\r\nFull build log attached. No toolchain details in there, but it will be almost identical to [this build, without JIT](https://buildd.debian.org/status/fetch.php?pkg=pypy3&arch=arm64&ver=7.2.0%7Erc1%2Bdfsg-1&stamp=1570132096&raw=0).\r\n\r\nHardware: kvm guest on an APM [X-Gene 1](https://www.gigabyte.com/Server-Motherboard/MP30-AR1-rev-11#ov) \\(a Mustang, something like that\\)',
  createdAt: '2019-10-06T19:52:53.940697+00:00',
  updatedAt: '2019-10-08T10:51:06.164238+00:00',
  closedAt: undefined,
  state: 'new',
};

export const getIssueCommentsResponse = {
  items: [
    {
      user: {
        id: '{dfa073eb-c602-4740-83ef-a8fe8ee03dfd}',
        login: 'stefanor',
        url: 'https://bitbucket.org/%7Bdfa073eb-c602-4740-83ef-a8fe8ee03dfd%7D/',
      },
      url: 'https://bitbucket.org/pypy/pypy/issues/3086#comment-54226806',
      body: null,
      createdAt: '2019-10-06T19:56:03.753664+00:00',
      updatedAt: null,
      authorAssociation: undefined,
      id: 54226806,
    },
    {
      user: {
        id: '{dfa073eb-c602-4740-83ef-a8fe8ee03dfd}',
        login: 'stefanor',
        url: 'https://bitbucket.org/%7Bdfa073eb-c602-4740-83ef-a8fe8ee03dfd%7D/',
      },
      url: 'https://bitbucket.org/pypy/pypy/issues/3086#comment-54230712',
      body: null,
      createdAt: '2019-10-07T06:12:23.627201+00:00',
      updatedAt: null,
      authorAssociation: undefined,
      id: 54230712,
    },
    {
      user: {
        id: '{dfa073eb-c602-4740-83ef-a8fe8ee03dfd}',
        login: 'stefanor',
        url: 'https://bitbucket.org/%7Bdfa073eb-c602-4740-83ef-a8fe8ee03dfd%7D/',
      },
      url: 'https://bitbucket.org/pypy/pypy/issues/3086#comment-54232225',
      body: null,
      createdAt: '2019-10-07T08:02:12.649035+00:00',
      updatedAt: null,
      authorAssociation: undefined,
      id: 54232225,
    },
    {
      user: {
        id: '{267069e3-3102-46be-9577-3d3727467e9c}',
        login: 'mattip',
        url: 'https://bitbucket.org/%7B267069e3-3102-46be-9577-3d3727467e9c%7D/',
      },
      url: 'https://bitbucket.org/pypy/pypy/issues/3086#comment-54232521',
      body: `> Hardware: kvm guest on an APM X-Gene

      It could be that the kvm guest is hiding some subtle differences between the host \\(do you know which [hardware model](https://en.wikichip.org/wiki/apm/x-gene)?\\) and the guest that the build system misinterprets and then the JIT produces garbage.`,
      createdAt: '2019-10-07T08:16:01.378216+00:00',
      updatedAt: null,
      authorAssociation: undefined,
      id: 54232521,
    },
    {
      user: {
        id: '{dfa073eb-c602-4740-83ef-a8fe8ee03dfd}',
        login: 'stefanor',
        url: 'https://bitbucket.org/%7Bdfa073eb-c602-4740-83ef-a8fe8ee03dfd%7D/',
      },
      url: 'https://bitbucket.org/pypy/pypy/issues/3086#comment-54233403',
      body: null,
      createdAt: '2019-10-07T09:01:01.648723+00:00',
      updatedAt: null,
      authorAssociation: undefined,
      id: 54233403,
    },
    {
      user: {
        id: '{dfa073eb-c602-4740-83ef-a8fe8ee03dfd}',
        login: 'stefanor',
        url: 'https://bitbucket.org/%7Bdfa073eb-c602-4740-83ef-a8fe8ee03dfd%7D/',
      },
      url: 'https://bitbucket.org/pypy/pypy/issues/3086#comment-54234488',
      body: null,
      createdAt: '2019-10-07T10:03:57.174805+00:00',
      updatedAt: null,
      authorAssociation: undefined,
      id: 54234488,
    },
    {
      user: {
        id: '{dfa073eb-c602-4740-83ef-a8fe8ee03dfd}',
        login: 'stefanor',
        url: 'https://bitbucket.org/%7Bdfa073eb-c602-4740-83ef-a8fe8ee03dfd%7D/',
      },
      url: 'https://bitbucket.org/pypy/pypy/issues/3086#comment-54234576',
      body: null,
      createdAt: '2019-10-07T10:08:57.038446+00:00',
      updatedAt: null,
      authorAssociation: undefined,
      id: 54234576,
    },
    {
      user: {
        id: '{dfa073eb-c602-4740-83ef-a8fe8ee03dfd}',
        login: 'stefanor',
        url: 'https://bitbucket.org/%7Bdfa073eb-c602-4740-83ef-a8fe8ee03dfd%7D/',
      },
      url: 'https://bitbucket.org/pypy/pypy/issues/3086#comment-54253115',
      body: 'Seen this bug on pypy3.6 too',
      createdAt: '2019-10-08T10:48:35.339908+00:00',
      updatedAt: '2019-10-08T10:50:29.596747+00:00',
      authorAssociation: undefined,
      id: 54253115,
    },
    {
      user: {
        id: '{dfa073eb-c602-4740-83ef-a8fe8ee03dfd}',
        login: 'stefanor',
        url: 'https://bitbucket.org/%7Bdfa073eb-c602-4740-83ef-a8fe8ee03dfd%7D/',
      },
      url: 'https://bitbucket.org/pypy/pypy/issues/3086#comment-54253137',
      body: 'And seen when translating with a non-JIT pypy2.7 7.1.1',
      createdAt: '2019-10-08T10:51:06.140713+00:00',
      updatedAt: null,
      authorAssociation: undefined,
      id: 54253137,
    },
  ],
  totalCount: 9,
  hasNextPage: false,
  hasPreviousPage: false,
  page: 1,
  perPage: 9,
};

export const pypyResponse = {
  pagelen: 10,
  size: 20,
  values: [
    {
      description:
        "Cfr. [https://www.python.org/dev/peps/pep-0553/](https://www.python.org/dev/peps/pep-0553/) and [https://github.com/python/cpython/pull/3355/](https://github.com/python/cpython/pull/3355/)\r\n\r\n‌\r\n\r\nReplaced the proposed \\([https://www.python.org/dev/peps/pep-0553/#implementation](https://www.python.org/dev/peps/pep-0553/#implementation)\\)\r\n\r\n```python\r\ndef breakpoint(*args, **kws):\r\n    import sys\r\n    missing = object()\r\n    hook = getattr(sys, 'breakpointhook', missing)\r\n    if hook is missing:\r\n        raise RuntimeError('lost sys.breakpointhook')\r\n    return hook(*args, **kws)\r\n```\r\n\r\nby simpler\r\n\r\n```python\r\nimport sys\r\n\r\ndef breakpoint(*args, **kwargs):\r\n    if not hasattr(sys, 'breakpointhook'):\r\n        raise RuntimeError('lost sys.breakpointhook')\r\n    return sys.breakpointhook(*args, **kwargs)\r\n```\r\n\r\n‌\r\n\r\nTests are still missing, as they are not immediately straightforward to implement.",
      links: {
        decline: {
          href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/671/decline',
        },
        diffstat: {
          href:
            'https://api.bitbucket.org/2.0/repositories/pypy/pypy/diffstat/Yannick_Jadoul/pypy:075c2edf30ee%0Ddff15039dbab?from_pullrequest_id=671',
        },
        commits: {
          href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/671/commits',
        },
        self: {
          href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/671',
        },
        comments: {
          href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/671/comments',
        },
        merge: {
          href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/671/merge',
        },
        html: {
          href: 'https://bitbucket.org/pypy/pypy/pull-requests/671',
        },
        activity: {
          href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/671/activity',
        },
        diff: {
          href:
            'https://api.bitbucket.org/2.0/repositories/pypy/pypy/diff/Yannick_Jadoul/pypy:075c2edf30ee%0Ddff15039dbab?from_pullrequest_id=671',
        },
        approve: {
          href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/671/approve',
        },
        statuses: {
          href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/671/statuses',
        },
      },
      title: '[WIP] PEP 533 implementation',
      close_source_branch: false,
      type: 'pullrequest',
      id: 671,
      destination: {
        commit: {
          hash: 'dff15039dbab',
          type: 'commit',
          links: {
            self: {
              href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/commit/dff15039dbab',
            },
            html: {
              href: 'https://bitbucket.org/pypy/pypy/commits/dff15039dbab',
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
          name: 'py3.7',
        },
      },
      created_on: '2019-10-12T21:52:03.150669+00:00',
      summary: {
        raw:
          "Cfr. [https://www.python.org/dev/peps/pep-0553/](https://www.python.org/dev/peps/pep-0553/) and [https://github.com/python/cpython/pull/3355/](https://github.com/python/cpython/pull/3355/)\r\n\r\n‌\r\n\r\nReplaced the proposed \\([https://www.python.org/dev/peps/pep-0553/#implementation](https://www.python.org/dev/peps/pep-0553/#implementation)\\)\r\n\r\n```python\r\ndef breakpoint(*args, **kws):\r\n    import sys\r\n    missing = object()\r\n    hook = getattr(sys, 'breakpointhook', missing)\r\n    if hook is missing:\r\n        raise RuntimeError('lost sys.breakpointhook')\r\n    return hook(*args, **kws)\r\n```\r\n\r\nby simpler\r\n\r\n```python\r\nimport sys\r\n\r\ndef breakpoint(*args, **kwargs):\r\n    if not hasattr(sys, 'breakpointhook'):\r\n        raise RuntimeError('lost sys.breakpointhook')\r\n    return sys.breakpointhook(*args, **kwargs)\r\n```\r\n\r\n‌\r\n\r\nTests are still missing, as they are not immediately straightforward to implement.",
        markup: 'markdown',
        html:
          '<p>Cfr. <a data-is-external-link="true" href="https://www.python.org/dev/peps/pep-0553/" rel="nofollow">https://www.python.org/dev/peps/pep-0553/</a> and <a data-is-external-link="true" href="https://github.com/python/cpython/pull/3355/" rel="nofollow">https://github.com/python/cpython/pull/3355/</a></p>\n<p>‌</p>\n<p>Replaced the proposed (<a data-is-external-link="true" href="https://www.python.org/dev/peps/pep-0553/#implementation" rel="nofollow">https://www.python.org/dev/peps/pep-0553/#implementation</a>)</p>\n<div class="codehilite language-python"><pre><span></span><span class="k">def</span> <span class="nf">breakpoint</span><span class="p">(</span><span class="o">*</span><span class="n">args</span><span class="p">,</span> <span class="o">**</span><span class="n">kws</span><span class="p">):</span>\n    <span class="kn">import</span> <span class="nn">sys</span>\n    <span class="n">missing</span> <span class="o">=</span> <span class="nb">object</span><span class="p">()</span>\n    <span class="n">hook</span> <span class="o">=</span> <span class="nb">getattr</span><span class="p">(</span><span class="n">sys</span><span class="p">,</span> <span class="s1">&#39;breakpointhook&#39;</span><span class="p">,</span> <span class="n">missing</span><span class="p">)</span>\n    <span class="k">if</span> <span class="n">hook</span> <span class="ow">is</span> <span class="n">missing</span><span class="p">:</span>\n        <span class="k">raise</span> <span class="ne">RuntimeError</span><span class="p">(</span><span class="s1">&#39;lost sys.breakpointhook&#39;</span><span class="p">)</span>\n    <span class="k">return</span> <span class="n">hook</span><span class="p">(</span><span class="o">*</span><span class="n">args</span><span class="p">,</span> <span class="o">**</span><span class="n">kws</span><span class="p">)</span>\n</pre></div>\n\n\n<p>by simpler</p>\n<div class="codehilite language-python"><pre><span></span><span class="kn">import</span> <span class="nn">sys</span>\n\n<span class="k">def</span> <span class="nf">breakpoint</span><span class="p">(</span><span class="o">*</span><span class="n">args</span><span class="p">,</span> <span class="o">**</span><span class="n">kwargs</span><span class="p">):</span>\n    <span class="k">if</span> <span class="ow">not</span> <span class="nb">hasattr</span><span class="p">(</span><span class="n">sys</span><span class="p">,</span> <span class="s1">&#39;breakpointhook&#39;</span><span class="p">):</span>\n        <span class="k">raise</span> <span class="ne">RuntimeError</span><span class="p">(</span><span class="s1">&#39;lost sys.breakpointhook&#39;</span><span class="p">)</span>\n    <span class="k">return</span> <span class="n">sys</span><span class="o">.</span><span class="n">breakpointhook</span><span class="p">(</span><span class="o">*</span><span class="n">args</span><span class="p">,</span> <span class="o">**</span><span class="n">kwargs</span><span class="p">)</span>\n</pre></div>\n\n\n<p>‌</p>\n<p>Tests are still missing, as they are not immediately straightforward to implement.</p>',
        type: 'rendered',
      },
      source: {
        commit: {
          hash: '075c2edf30ee',
          type: 'commit',
          links: {
            self: {
              href: 'https://api.bitbucket.org/2.0/repositories/Yannick_Jadoul/pypy/commit/075c2edf30ee',
            },
            html: {
              href: 'https://bitbucket.org/Yannick_Jadoul/pypy/commits/075c2edf30ee',
            },
          },
        },
        repository: {
          links: {
            self: {
              href: 'https://api.bitbucket.org/2.0/repositories/Yannick_Jadoul/pypy',
            },
            html: {
              href: 'https://bitbucket.org/Yannick_Jadoul/pypy',
            },
            avatar: {
              href: 'https://bytebucket.org/ravatar/%7Be21192c5-da8c-4db6-9c21-9e167283a334%7D?ts=python',
            },
          },
          type: 'repository',
          name: 'pypy',
          full_name: 'Yannick_Jadoul/pypy',
          uuid: '{e21192c5-da8c-4db6-9c21-9e167283a334}',
        },
        branch: {
          name: 'py3.7-pep553',
        },
      },
      comment_count: 4,
      state: 'OPEN',
      task_count: 0,
      reason: '',
      updated_on: '2019-10-14T22:26:27.626102+00:00',
      author: {
        display_name: 'Yannick Jadoul',
        uuid: '{afdb1c84-0f8a-4104-85d2-f3012a479592}',
        links: {
          self: {
            href: 'https://api.bitbucket.org/2.0/users/%7Bafdb1c84-0f8a-4104-85d2-f3012a479592%7D',
          },
          html: {
            href: 'https://bitbucket.org/%7Bafdb1c84-0f8a-4104-85d2-f3012a479592%7D/',
          },
          avatar: {
            href:
              'https://secure.gravatar.com/avatar/e9ff28aedb0ee947074084d31a9da1b9?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FYJ-1.png',
          },
        },
        nickname: 'Yannick_Jadoul',
        type: 'user',
        account_id: '557058:089ffcae-fe92-4101-aef5-f2b969471546',
      },
      merge_commit: null,
      closed_by: null,
    },
  ],
  page: 1,
  next: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests?page=2',
};
