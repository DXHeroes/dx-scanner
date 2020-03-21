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
  sha: 'e5bd3914e2e596debea16f433f57875b5b90bcd6',
  closedAt: '2011-01-26T19:01:12Z',
  createdAt: '2011-01-26T19:01:12Z',
  id: 1,
  mergedAt: '2011-01-26T19:01:12Z',
  state: 'closed',
  updatedAt: '2011-01-26T19:01:12Z',
  url: 'https://api.github.com/repos/octocat/Hello-World/pulls/1',
  user: { id: '583231', login: 'octocat', url: 'https://api.github.com/users/octocat' },
};
