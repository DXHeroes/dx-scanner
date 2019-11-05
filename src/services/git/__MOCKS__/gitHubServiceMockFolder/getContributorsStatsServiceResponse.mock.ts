import { ContributorStats } from '../../model';
import { Paginated } from '../../../../inspectors/common/Paginated';

export const getContributorsStatsServiceResponse: Paginated<ContributorStats> = {
  hasNextPage: false,
  hasPreviousPage: false,
  items: [
    {
      author: { id: '251370', login: 'Spaceghost', url: 'https://api.github.com/users/Spaceghost' },
      total: 1,
      weeks: [
        { additions: 1, commits: 1, deletions: 1, startOfTheWeek: 1315699200 },
        { additions: 0, commits: 0, deletions: 0, startOfTheWeek: 1316304000 },
        { additions: 0, commits: 0, deletions: 0, startOfTheWeek: 1316908800 },
      ],
    },
  ],
  page: 1,
  perPage: 1,
  totalCount: 1,
};
