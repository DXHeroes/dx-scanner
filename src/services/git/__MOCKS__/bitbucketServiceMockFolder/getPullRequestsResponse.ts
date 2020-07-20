import { Paginated } from '../../../../inspectors/common/Paginated';
import { PullRequest } from '../../model';

export const getPullRequestsResponse = (items?: PullRequest[]): Paginated<PullRequest> => {
  const defaultItems = [
    {
      user: {
        id: '{9d65d517-4898-47ac-9d2f-fd902d25d9f6}',
        login: 'landtuna',
        url: 'https://bitbucket.org/%7B9d65d517-4898-47ac-9d2f-fd902d25d9f6%7D/',
      },
      title: 'bitbucket test pull request',
      url: 'https://bitbucket.org/pypy/pypy/pull-requests/1',
      body: 'Added a floor() ufunc to micronumpy',
      sha: '1234567890',
      createdAt: '2011-06-22T19:44:39.555192+00:00',
      updatedAt: '2011-06-23T13:52:30.230741+00:00',
      closedAt: '2011-06-23T13:52:30.230741+00:00',
      mergedAt: null,
      state: 'DECLINED',
      id: 1,
      base: {
        repo: {
          url: 'https://bitbucket.org/pypy/pypy',
          name: 'pypy',
          id: '{54220cd1-b139-4188-9455-1e13e663f1ac}',
          owner: { id: 'undefined', login: 'pypy', url: 'www.bitbucket.org/pypy' },
        },
      },
    },
  ];

  return {
    items: items || defaultItems,
    totalCount: items?.length || 1,
    hasNextPage: false,
    hasPreviousPage: false,
    page: 1,
    perPage: items?.length || 1,
  };
};
