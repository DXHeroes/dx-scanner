import { PullRequest } from '../../model';
import { Paginated } from '../../../../inspectors/common/Paginated';

export const getPullsServiceResponse: Paginated<PullRequest> = {
  hasNextPage: false,
  hasPreviousPage: false,
  items: [
    {
      base: {
        repo: {
          id: '1296269',
          name: 'Hello-World',
          owner: {
            id: '1',
            login: 'octocat',
            url: 'https://api.github.com/users/octocat',
          },
          url: 'https://api.github.com/repos/octocat/Hello-World',
        },
      },
      title: 'Edited README via GitHub',
      body: 'Please pull these awesome changes',
      sha: 'e5bd3914e2e596debea16f433f57875b5b90bcd6',
      closedAt: '2011-01-26T19:01:12Z',
      createdAt: '2011-01-26T19:01:12Z',
      id: 1,
      mergedAt: '2011-01-26T19:01:12Z',
      state: 'open',
      updatedAt: '2011-01-26T19:01:12Z',
      url: 'https://github.com/octocat/Hello-World/pull/1',
      user: { id: '1', login: 'octocat', url: 'https://github.com/octocat' },
    },
  ],
  page: 1,
  perPage: 1,

  totalCount: 1,
};
