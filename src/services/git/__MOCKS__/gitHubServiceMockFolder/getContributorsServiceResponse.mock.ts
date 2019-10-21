import { Contributor } from '../../model';
import { Paginated } from '../../../../inspectors/common/Paginated';

export const getContributorsServiceResponse: Paginated<Contributor> = {
  hasNextPage: false,
  hasPreviousPage: false,
  items: [
    {
      contributions: 1,
      followersUrl: undefined,
      user: { id: '251370', login: 'Spaceghost', url: 'https://api.github.com/users/Spaceghost' },
    },
    {
      contributions: 1,
      followersUrl: undefined,
      user: { id: '583231', login: 'octocat', url: 'https://api.github.com/users/octocat' },
    },
  ],
  page: 1,
  perPage: 2,
  totalCount: 2,
};
