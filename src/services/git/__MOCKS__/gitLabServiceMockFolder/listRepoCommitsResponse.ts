import { Paginated } from '../../../../inspectors/common/Paginated';
import { Commit } from '../../model';

export const getRepoCommits = (items?: Commit[]): Paginated<Commit> => {
  const defaultItems: Commit[] = [
    {
      sha: '4eecfba1b1e2c35c13a7b34fc3d71e58cbb3645d',
      url: 'gitlab.com/projects/gitlab-org/gitlab/repository/commits/4eecfba1',
      message:
        'Conditionally cache Snippet content\n' +
        '\n' +
        'Not all Snippets contain Markdown content and so\n' +
        'the `content` field should not always be cached.\n' +
        '\n' +
        'This change will attempt to determine if the content\n' +
        'is Markdown based on the Snippet filename and only cache\n' +
        'if it is\n',
      author: {
        name: 'Vijay Hawoldar',
        email: 'vhawoldar@gitlab.com',
        date: '2020-02-28T08:49:54.000+00:00',
      },
      tree: {
        sha: '54cd52b6316d15f3124b7223fd7863e7c3d18185',
        url: 'gitlab.com/projects/gitlab-org/gitlab/repository/commits/54cd52b6316d15f3124b7223fd7863e7c3d18185',
      },
      verified: false,
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
