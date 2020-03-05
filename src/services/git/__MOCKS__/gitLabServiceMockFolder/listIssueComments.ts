import { Paginated } from '../../../../inspectors/common/Paginated';
import { IssueComment } from '../../model';

export const listIssueCommentsResponse = (items?: IssueComment[]): Paginated<IssueComment> => {
  const defaultItems = [
    {
      user: {
        id: '3045721',
        login: 'Homolova',
        url: 'https://gitlab.com/Homolova',
      },
      url: 'gitlab.com/projects/homolova/ted_ontouml_kom/notes/299798113',
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
    page: 1,
    perPage: 1,
  };
};
