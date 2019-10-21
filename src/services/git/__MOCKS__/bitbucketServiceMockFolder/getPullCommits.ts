import { PullCommits } from '../../model';
import { Paginated } from '../../../../inspectors/common/Paginated';

export const getPullCommits: Paginated<PullCommits> = {
  items: [
    {
      sha: 'f799951483319e5397d41019de50f8e07b01b04f',
      commit: {
        url: 'https://bitbucket.org/ashwinahuja/pypy/commits/f799951483319e5397d41019de50f8e07b01b04f',
        message: 'Remove the duplicated (unnecessary items)',
        author: { name: 'ashwinahuja', email: 'undefined', date: '2018-09-13T16:19:32+00:00' },
        tree: {
          sha: 'f799951483319e5397d41019de50f8e07b01b04f',
          url: 'https://bitbucket.org/ashwinahuja/pypy/commits/f799951483319e5397d41019de50f8e07b01b04f',
        },
        verified: false,
      },
    },
    {
      sha: '0e3d572c47c60df4760e541da6a05e5e305d6175',
      commit: {
        url: 'https://bitbucket.org/ashwinahuja/pypy/commits/0e3d572c47c60df4760e541da6a05e5e305d6175',
        message: 'Making datetime objects more compatible with old C extensions written for CPython',
        author: { name: 'ashwinahuja', email: 'undefined', date: '2018-09-13T16:14:59+00:00' },
        tree: {
          sha: '0e3d572c47c60df4760e541da6a05e5e305d6175',
          url: 'https://bitbucket.org/ashwinahuja/pypy/commits/0e3d572c47c60df4760e541da6a05e5e305d6175',
        },
        verified: false,
      },
    },
  ],
  totalCount: 2,
  hasNextPage: false,
  hasPreviousPage: false,
  page: 1,
  perPage: 2,
};
