import { Paginated } from '../../../../inspectors/common/Paginated';
import { Issue } from '../../model';

export const listIssuesResponse = (items?: Issue[]): Paginated<Issue> => {
  const defaultItems = [
    {
      user: {
        id: '9970',
        login: 'gitlab-org',
        url: 'https://gitlab.com/groups/gitlab-org',
      },
      url: 'https://gitlab.com/gitlab-org/gitlab/issues/207825',
      body:
        'Follow-up for https://gitlab.com/gitlab-org/database-team/team-tasks/issues/30#note_292428210:\n' +
        '\n' +
        "Marginalia's line references often end up pointing to database load balancer code or similar:\n" +
        '\n' +
        '```\n' +
        '/*application:web,correlation_id:HnFTVEMUC\n' +
        "J3,line:/ee/lib/gitlab/database/load_balancing/connection_proxy.rb:63:in `block in read_using_load_balancer'*/\n" +
        '```\n' +
        '\n' +
        '> :line supports a configuration by setting a regexp in Marginalia::Comment.lines_to_ignore to exclude parts of the stacktrace from inclusion in the line comment.\n' +
        '\n' +
        'Marginalia supports to filter particular lines, so perhaps we can tune it more to our needs. The goal is to show the line in the codebase where the query originated from.\n' +
        '\n' +
        'As [noted](https://gitlab.com/gitlab-org/database-team/team-tasks/issues/30#note_292679100) by @sribalakumar, there might be performance implications coming out of this.',
      createdAt: '2020-02-24T12:49:46.119Z',
      updatedAt: '2020-03-02T11:14:16.842Z',
      closedAt: null,
      state: 'opened',
      id: 207825,
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

export const mockListIssuesResponseForUser: Issue[] = [
  {
    user: {
      id: '3045721',
      login: 'Homolova',
      url: 'https://gitlab.com/Homolova',
    },
    url: 'https://gitlab.com/Homolova/ted_ontouml_kom/issues/1',
    body: 'test',
    createdAt: '2020-03-05T14:13:37.362Z',
    updatedAt: '2020-03-05T14:13:37.362Z',
    closedAt: null,
    state: 'opened',
    id: 1,
  },
];
