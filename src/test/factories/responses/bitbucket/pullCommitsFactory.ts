import _ from 'lodash';
import Bitbucket from 'bitbucket';

/* eslint-disable @typescript-eslint/camelcase */
export const bitbucketPullCommitsResponseFactory = (params?: Partial<Bitbucket.Schema.Commit>): Bitbucket.Schema.Commit => {
  return _.merge(
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
    params,
  );
};
