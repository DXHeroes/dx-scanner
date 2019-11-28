import { IssueComment } from '../../model';
import { Paginated } from '../../../../inspectors/common/Paginated';

export const getIssueCommentsResponse: Paginated<IssueComment> = {
  items: [
    {
      user: {
        id: '{dfa073eb-c602-4740-83ef-a8fe8ee03dfd}',
        login: 'stefanor',
        url: 'https://bitbucket.org/%7Bdfa073eb-c602-4740-83ef-a8fe8ee03dfd%7D/',
      },
      url: 'https://bitbucket.org/pypy/pypy/issues/3086#comment-54230712',
      body: undefined,
      createdAt: '2019-10-07T06:12:23.627201+00:00',
      updatedAt: undefined,
      authorAssociation: undefined,
      id: 54230712,
    },
  ],
  totalCount: 1,
  hasNextPage: false,
  hasPreviousPage: false,
  page: 1,
  perPage: 1,
};
