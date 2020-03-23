import { Issue } from '../../model';
import _ from 'lodash';

export const getIssueResponse = (params?: Partial<Issue>): Issue => {
  return _.merge(
    {
      id: 207825,
      user: {
        login: 'abrandl',
        id: '1562869',
        url: 'https://gitlab.com/abrandl',
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
    },
    params,
  );
};
