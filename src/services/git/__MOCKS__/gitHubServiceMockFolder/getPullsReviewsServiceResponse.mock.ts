import { PullRequestReview } from '../../model';
import { Paginated } from '../../../../inspectors/common/Paginated';

export const getPullsReviewsServiceResponse: Paginated<PullRequestReview> = {
  hasNextPage: false,
  hasPreviousPage: false,
  items: [
    {
      body: '',
      id: 41231978,
      state: 'COMMENTED',
      url: 'https://api.github.com/repos/octocat/Hello-World/pulls/1',
      user: { id: '1999050', login: 'pedrorijo91', url: 'https://api.github.com/users/pedrorijo91' },
    },
    {
      body: '',
      id: 134751616,
      state: 'COMMENTED',
      url: 'https://api.github.com/repos/octocat/Hello-World/pulls/1',
      user: { id: '13119311', login: 'alexanderclin', url: 'https://api.github.com/users/alexanderclin' },
    },
    {
      body: '',
      id: 134757534,
      state: 'COMMENTED',
      url: 'https://api.github.com/repos/octocat/Hello-World/pulls/1',
      user: { id: '19191220', login: 'jonathantsang', url: 'https://api.github.com/users/jonathantsang' },
    },
    {
      body: '',
      id: 135027960,
      state: 'COMMENTED',
      url: 'https://api.github.com/repos/octocat/Hello-World/pulls/1',
      user: { id: '19191220', login: 'jonathantsang', url: 'https://api.github.com/users/jonathantsang' },
    },
  ],
  page: 1,
  perPage: 4,
  totalCount: 4,
};
