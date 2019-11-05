import { Issue } from '../../model';

/* eslint-disable @typescript-eslint/camelcase */
export const getIssueServiceResponse: Issue = {
  url: 'https://api.github.com/repos/octocat/Hello-World/issues/1',
  id: '872858',
  user: {
    login: 'unoju',
    id: '777449',
    url: 'https://api.github.com/users/unoju',
  },
  state: 'closed',
  body: '',
  createdAt: '2011-05-09T19:10:00Z',
  updatedAt: '2018-07-06T14:06:18Z',
  closedAt: '2011-05-18T20:00:25Z',
};
