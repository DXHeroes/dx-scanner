import { PullRequest } from '../../model';

export const getPullServiceResponse: PullRequest = {
  base: {
    repo: {
      id: '1296269',
      name: 'Hello-World',
      owner: {
        id: '583231',
        login: 'octocat',
        url: 'https://api.github.com/users/octocat',
      },
      url: 'https://api.github.com/repos/octocat/Hello-World',
    },
  },
  body: '',
  closedAt: '2011-01-26T19:01:12Z',
  createdAt: '2012-03-06T23:06:50Z',
  id: 1,
  mergedAt: '2011-01-26T19:01:12Z',
  state: 'closed',
  updatedAt: '2012-03-06T23:06:50Z',
  url: 'https://api.github.com/repos/octocat/Hello-World/pulls/1',
  user: { id: '583231', login: 'octocat', url: 'https://api.github.com/users/octocat' },
};
