import { Paginated, PaginationParams } from '../../../../inspectors/common/Paginated';
import { PullRequestComment } from '../../model';

export const listPullRequestCommentsResponse = (
  items?: PullRequestComment[],
  pagination?: PaginationParams,
): Paginated<PullRequestComment> => {
  const defaultItems = [
    {
      user: {
        id: '3045721',
        login: 'Homolova',
        url: 'https://gitlab.com/Homolova',
      },
      url: 'gitlab.com/projects/homolova/ted_ontouml_kom/merge_requests/1/notes',
      body: 'test comment',
      createdAt: '2020-03-05T15:07:35.386Z',
      updatedAt: '2020-03-05T15:07:35.386Z',
      authorAssociation: 'Homolova',
      id: 299798113,
    },
  ];

  return {
    items: items || defaultItems,
    totalCount: items?.length || 1,
    hasNextPage: true,
    hasPreviousPage: false,
    page: pagination?.page || 1,
    perPage: pagination?.perPage || 1,
  };
};
