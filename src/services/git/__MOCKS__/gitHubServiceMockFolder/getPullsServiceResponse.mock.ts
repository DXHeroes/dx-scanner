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

// export const getPullsServiceResponse: Paginated<PullRequest> = {
//   hasNextPage: false,
//   hasPreviousPage: false,
//   items: [
//     {
//       base: {
//         repo: {
//           id: '1296269',
//           name: 'Hello-World',
//           owner: {
//             id: '1',
//             login: 'octocat',
//             url: 'https://api.github.com/users/octocat',
//           },
//           url: 'https://api.github.com/repos/octocat/Hello-World',
//         },
//       },
//       title: 'Edited README via GitHub',
//       body: 'Please pull these awesome changes',
//       sha: 'e5bd3914e2e596debea16f433f57875b5b90bcd6',
//       closedAt: '2011-01-26T19:01:12Z',
//       createdAt: '2011-01-26T19:01:12Z',
//       id: 1,
//       mergedAt: '2011-01-26T19:01:12Z',
//       state: 'open',
//       updatedAt: '2011-01-26T19:01:12Z',
//       url: 'https://github.com/octocat/Hello-World/pull/1',
//       user: { id: '1', login: 'octocat', url: 'https://github.com/octocat' },
//     },
//   ],
//   page: 1,
//   perPage: 1,

//   totalCount: 1,
// };
