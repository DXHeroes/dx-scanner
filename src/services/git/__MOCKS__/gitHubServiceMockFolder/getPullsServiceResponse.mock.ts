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
      body: 'Please pull these awesome changes',
      closedAt: '2011-01-26T19:01:12Z',
      createdAt: '2011-01-26T19:01:12Z',
      id: 1,
      mergedAt: '2011-01-26T19:01:12Z',
      state: 'open',
      updatedAt: '2011-01-26T19:01:12Z',
      url: 'https://api.github.com/repos/octocat/Hello-World/pulls/1',
      user: { id: '1', login: 'octocat', url: 'https://api.github.com/users/octocat' },
    },
  ],
  page: 1,
  perPage: 1,

  totalCount: 1,
};
