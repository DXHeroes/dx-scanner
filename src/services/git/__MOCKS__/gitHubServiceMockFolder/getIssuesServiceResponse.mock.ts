import { Issue } from '../../model';
import { Paginated } from '../../../../inspectors/common/Paginated';

export const getIssuesServiceResponse: Paginated<Issue> = {
  hasNextPage: false,
  hasPreviousPage: false,
  items: [
    {
      body: 'a',
      closedAt: null,
      createdAt: '2019-06-26T15:11:43Z',
      id: 461030590,
      pullRequestUrl: 'https://api.github.com/repos/octocat/Hello-World/pulls/513',
      state: 'open',
      updatedAt: '2019-06-26T15:11:43Z',
      url: 'https://api.github.com/repos/octocat/Hello-World/issues/513',
      user: { id: 33818943, login: 'nowaygod', url: 'https://api.github.com/users/nowaygod' },
    },
    {
      body: '',
      closedAt: null,
      createdAt: '2019-06-24T19:43:52Z',
      id: 460062740,
      pullRequestUrl: 'https://api.github.com/repos/octocat/Hello-World/pulls/512',
      state: 'open',
      updatedAt: '2019-06-24T19:43:52Z',
      url: 'https://api.github.com/repos/octocat/Hello-World/issues/512',
      user: { id: 50170747, login: 'nmonmontmon', url: 'https://api.github.com/users/nmonmontmon' },
    },
  ],
  page: 1,
  perPage: 2,
  totalCount: 2,
};
