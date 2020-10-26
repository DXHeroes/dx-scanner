import { PullRequest } from '../../model';
import { Paginated } from '../../../../inspectors/common/Paginated';

export const getPullsServiceResponse: Paginated<PullRequest> = {
  items: [
    {
      user: {
        id: 'MDQ6VXNlcjE2OTE4MzEx',
        login: 'Nythiennzo',
        url: 'https://github.com/Nythiennzo',
      },
      title: 'Add comma in Hello World.',
      url: 'https://github.com/octocat/Hello-World/pull/453',
      body: "Hello, I'm doing a test for a demo.",
      sha: null,
      createdAt: '2018-10-13T01:14:27Z',
      updatedAt: '2018-10-13T01:14:27Z',
      closedAt: null,
      mergedAt: null,
      state: 'OPEN',
      id: 453,
      base: {
        repo: {
          url: 'https://github.com/octocat/Hello-World',
          name: 'Hello-World',
          id: 'MDEwOlJlcG9zaXRvcnkxMjk2MjY5',
          owner: {
            url: 'https://github.com/octocat',
            id: 'MDQ6VXNlcjU4MzIzMQ==',
            login: 'octocat',
          },
        },
      },
      lines: { additions: 1, deletions: 1, changes: 2 },
    },
  ],
  totalCount: 1,
  hasNextPage: false,
  hasPreviousPage: false,
  page: 1,
  perPage: 1,
};
