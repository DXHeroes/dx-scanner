import { PullRequest } from '../../model';

export const getPullServiceResponse: PullRequest = {
  base: {
    repo: {
      id: 1296269,
      name: 'Hello-World',
      owner: {
        id: 583231,
        login: 'octocat',
        url: 'https://api.github.com/users/octocat',
      },
      url: 'https://api.github.com/repos/octocat/Hello-World',
    },
  },
  body: '',
  closedAt: '2011-05-18T20:00:25Z',
  createdAt: '2011-05-09T19:10:00Z',
  id: 140900,
  mergedAt: null,
  state: 'closed',
  updatedAt: '2018-07-06T14:06:18Z',
  url: 'https://api.github.com/repos/octocat/Hello-World/pulls/1',
  user: { id: 777449, login: 'unoju', url: 'https://api.github.com/users/unoju' },
};
