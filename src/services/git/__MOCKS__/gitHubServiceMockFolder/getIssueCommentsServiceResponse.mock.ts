/* eslint-disable @typescript-eslint/camelcase */
export const getIssueCommentsServiceResponse = {
  hasNextPage: false,
  hasPreviousPage: false,
  items: [
    {
      authorAssociation: 'NONE',
      body: 'test\n',
      createdAt: '2011-06-10T07:30:27Z',
      id: 1340258,
      updatedAt: '2011-06-10T07:30:27Z',
      url: 'https://api.github.com/repos/octocat/Hello-World/issues/comments/1340258',
      user: { id: '841296', login: 'masonzou', url: 'https://api.github.com/users/masonzou' },
    },
    {
      authorAssociation: 'NONE',
      body: 'affirmative\n',
      createdAt: '2013-02-18T15:09:23Z',
      id: 13725928,
      updatedAt: '2013-02-18T15:09:23Z',
      url: 'https://api.github.com/repos/octocat/Hello-World/issues/comments/13725928',
      user: { id: '3627156', login: '198103292005021004', url: 'https://api.github.com/users/198103292005021004' },
    },
  ],
  page: 1,
  perPage: 2,
  totalCount: 2,
};
