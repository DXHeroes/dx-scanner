import { PullRequest } from '../../model';
import _ from 'lodash';

export const getPullRequestResponse = (params?: Partial<PullRequest>): PullRequest => {
  return _.merge(
    {
      user: {
        id: '{9d65d517-4898-47ac-9d2f-fd902d25d9f6}',
        login: 'landtuna',
        url: 'https://bitbucket.org/%7B9d65d517-4898-47ac-9d2f-fd902d25d9f6%7D/',
      },
      url: 'https://bitbucket.org/pypy/pypy/pull-requests/1',
      body: 'Added a floor() ufunc to micronumpy',
      sha: '0f45e3d5961f',
      createdAt: '2011-06-22T19:44:39.555192+00:00',
      updatedAt: '2011-06-23T13:52:30.230741+00:00',
      closedAt: null,
      mergedAt: null,
      state: 'OPEN',
      id: 1,
      base: {
        repo: {
          url: 'https://bitbucket.org/pypy/pypy',
          name: 'pypy',
          id: '{54220cd1-b139-4188-9455-1e13e663f1ac}',
          owner: {
            login: 'pypy',
            id: '{f122f6a4-9111-4431-9f88-884d8cedd194}',
            url: 'www.bitbucket.org/pypy',
          },
        },
      },
    },
    params,
  );
};
