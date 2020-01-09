/* eslint-disable @typescript-eslint/camelcase */
import nock from 'nock';
import { ListGetterOptions, PaginationParams } from '../../inspectors';
import { BitbucketCommit } from '../../services/bitbucket/BitbucketService';
import { BitbucketPullRequestState } from '../../services/git/IVCSService';
import { bitbucketListPRsResponseFactory } from '../factories/responses/bitbucket/listPrsResponseFactory';
import { bitbucketListIssuesResponseFactory } from '../factories/responses/bitbucket/listIssuesResponseFactory';
import { bitbucketListIssueCommentsResponseFactory } from '../factories/responses/bitbucket/listIssueCommentsResponseFactory';
import { DeepRequired } from '../../lib/deepRequired';
import { getPullCommitsResponse } from '../../services/git/__MOCKS__/bitbucketServiceMockFolder';
import { bitbucketListPullCommitsResponseFactory } from '../factories/responses/bitbucket/listPullCommitsResponseFactory';
import { bitbucketListCommitResponseFactory } from '../factories/responses/bitbucket/listRepoCommitsResponseFactory';

export class BitbucketNock {
  user: string;
  repoName: string;
  url: string;

  constructor(user: string, repoName: string) {
    (this.user = user), (this.repoName = repoName);
    this.url = 'https://api.bitbucket.org/2.0';
  }

  /**
   * @deprecated This functions is deprecated and will be removed soon
   */
  getApiResponse(options: {
    resource: string;
    id?: number | string;
    value?: string;
    state?: BitbucketPullRequestState | BitbucketPullRequestState[];
    pagination?: PaginationParams;
  }): nock.Scope {
    let url = `${this.url}/repositories/${this.user}/${this.repoName}/${options.resource}`;
    let response;

    const params = {};
    const persist = true;

    if (options.state === undefined) {
      options.state = BitbucketPullRequestState.open;
    }

    if (options.value !== undefined) {
      switch (options.value) {
        case 'comments':
          url = url.concat(`/${options.id}/${options.value}`);
          response = new IssueCommentsMock().issueComments;
          break;
        case 'commits':
          throw 'Deprecated switch case used! Use `.listPullCommits instead`';
      }
    } else {
      switch (options.resource) {
        case 'pullrequests':
          throw 'Deprecated switch case used! Use `.getPullRequests instead`';
        case 'issues':
          throw 'Deprecated switch case used! Use `.getIssues instead`';
        case 'commits':
          response = new RepoCommitsMock().repoCommits;
          break;
        case 'commit':
          url = url.concat(`/${options.id}`);
          response = new RepoCommitMock().repoCommit;
          break;
        default:
          throw Error('You passed wrong value or id');
      }
    }

    return BitbucketNock.get(url, params, persist).reply(200, response);
  }

  getOwnerId() {
    const url = `${this.url}/repositories/${this.user}/${this.repoName}`;
    const params = {};
    const persist = true;
    const response = { owner: { uuid: '{f122f6a4-9111-4431-9f88-884d8cedd194}' } };
    return BitbucketNock.get(url, params, persist).reply(200, response);
  }

  getPRsAdditionsAndDeletions(prNumber: number) {
    const baseUrl = `${this.url}/repositories/${this.user}/${this.repoName}/pullrequests/${prNumber}/diffstat`;

    const response = { values: [{ lines_removed: 1, lines_added: 2 }] };
    return BitbucketNock.get(baseUrl).reply(200, response);
  }

  private static get(url: string, params: nock.DataMatcherMap = {}, persist = true): nock.Interceptor {
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

  listPullRequestsResponse(
    pullRequests: Bitbucket.Schema.Pullrequest[],
    options?: ListGetterOptions<{ state?: BitbucketPullRequestState | BitbucketPullRequestState[] }>,
  ) {
    const baseUrl = `${this.url}/repositories/${this.user}/${this.repoName}/pullrequests`;

    const queryParams: { state?: BitbucketPullRequestState | BitbucketPullRequestState[]; page?: number; pagelen?: number } = {};
    if (options?.filter?.state) queryParams.state = options?.filter?.state;
    if (options?.pagination?.page) queryParams.page = options?.pagination?.page;
    if (options?.pagination?.perPage) queryParams.pagelen = options?.pagination?.perPage;

    const response = bitbucketListPRsResponseFactory(pullRequests);

    return BitbucketNock.get(baseUrl, queryParams).reply(200, response);
  }

  getPullRequestResponse(pullRequest: Bitbucket.Schema.Pullrequest) {
    const baseUrl = `${this.url}/repositories/${this.user}/${this.repoName}/pullrequests/${pullRequest.id}`;

    return BitbucketNock.get(baseUrl).reply(200, pullRequest);
  }

  listIssuesResponse(
    issues: Bitbucket.Schema.Issue[],
    options?: ListGetterOptions<{ state?: BitbucketPullRequestState | BitbucketPullRequestState[] }>,
  ) {
    const baseUrl = `${this.url}/repositories/${this.user}/${this.repoName}/issues`;

    const queryParams: { state?: BitbucketPullRequestState | BitbucketPullRequestState[]; page?: number; pagelen?: number } = {};
    if (options?.filter?.state) queryParams.state = options?.filter?.state;
    if (options?.pagination?.page) queryParams.page = options?.pagination?.page;
    if (options?.pagination?.perPage) queryParams.pagelen = options?.pagination?.perPage;

    const response = bitbucketListIssuesResponseFactory(issues);

    return BitbucketNock.get(baseUrl, queryParams).reply(200, response);
  }

  getIssueResponse(issue: Bitbucket.Schema.Issue) {
    const baseUrl = `${this.url}/repositories/${this.user}/${this.repoName}/issues/${issue.id}`;

    return BitbucketNock.get(baseUrl).reply(200, issue);
  }

  listIssueCommentsResponse(issueComment: Bitbucket.Schema.IssueComment[], issueId: number) {
    const baseUrl = `${this.url}/repositories/${this.user}/${this.repoName}/issues/${issueId}/comments`;

    const response = bitbucketListIssueCommentsResponseFactory(issueComment);

    return BitbucketNock.get(baseUrl).reply(200, response);
  }

  listPullCommits(pullCommits: Bitbucket.Schema.Commit[], prNumber: number) {
    const baseUrl = `${this.url}/repositories/${this.user}/${this.repoName}/pullrequests/${prNumber}/commits`;
    const response = bitbucketListPullCommitsResponseFactory(pullCommits);

    return BitbucketNock.get(baseUrl).reply(200, response);
  }

  getCommitResponse(commit: Bitbucket.Schema.Commit, commitSha: string) {
    const baseUrl = `${this.url}/repositories/${this.user}/${this.repoName}/commit/${commitSha}`;

    return BitbucketNock.get(baseUrl).reply(200, commit);
  }

  listCommitResponse(commit: Bitbucket.Schema.Commit[]) {
    const baseUrl = `${this.url}/repositories/${this.user}/${this.repoName}/commits`;
    const response = bitbucketListCommitResponseFactory(commit);

    return BitbucketNock.get(baseUrl).reply(200, response);
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
