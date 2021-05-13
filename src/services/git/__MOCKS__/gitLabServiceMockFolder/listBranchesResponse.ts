import { Paginated, PaginationParams } from '../../../../inspectors/common/Paginated';
import { Branch } from '../../model';

export const listBranchesResponse = (items?: Branch[], pagination?: PaginationParams): Paginated<Branch> => {
  const defaultItems = [
    {
      name: 'master',
      type: 'default',
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
