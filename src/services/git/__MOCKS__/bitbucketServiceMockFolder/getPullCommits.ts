import { PullCommits } from '../../model';
import { Paginated } from '../../../../inspectors/common/Paginated';

export const getPullCommitsResponse = (items?: PullCommits[]): Paginated<PullCommits> => {
  const defaultItems = [
    {
      sha: '0e3d572c47c60df4760e541da6a05e5e305d6175',
      commit: {
        url: 'https://bitbucket.org/ashwinahuja/pypy/commits/0e3d572c47c60df4760e541da6a05e5e305d6175',
        message: 'Making datetime objects more compatible with old C extensions written for CPython',
        author: { name: 'ashwinahuja', email: '', date: '2018-09-13T16:14:59+00:00' },
        tree: {
          sha: '0e3d572c47c60df4760e541da6a05e5e305d6175',
          url: 'https://bitbucket.org/ashwinahuja/pypy/commits/0e3d572c47c60df4760e541da6a05e5e305d6175',
        },
        verified: false,
      },
    },
  ];
  return {
    items: items || defaultItems,
    totalCount: items?.legth || 1,
    hasNextPage: true,
    hasPreviousPage: true,
    page: 1,
    perPage: 1,
  };
};
