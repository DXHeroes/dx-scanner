import { Paginated } from '../../../../inspectors/common/Paginated';
import { PullRequest } from '../../model';

export const getPullRequestsResponse: Paginated<PullRequest> = {
  items: [
    {
      user: {
        id: '{9d65d517-4898-47ac-9d2f-fd902d25d9f6}',
        login: 'landtuna',
        url: 'https://bitbucket.org/%7B9d65d517-4898-47ac-9d2f-fd902d25d9f6%7D/',
      },
      url: 'https://bitbucket.org/pypy/pypy/pull-requests/1',
      body: 'Added a floor() ufunc to micronumpy',
      createdAt: '2011-06-22T19:44:39.555192+00:00',
      updatedAt: '2011-06-23T13:52:30.230741+00:00',
      closedAt: null,
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
  ],
  totalCount: 1,
  hasNextPage: true,
  hasPreviousPage: false,
  page: 1,
  perPage: 1,
};
