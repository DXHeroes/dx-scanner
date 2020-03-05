/* eslint-disable @typescript-eslint/camelcase */
import _ from 'lodash';
import { Project } from '../../../../services/gitlab/gitlabClient/resources/Projects';

export const gitLabRepoInfoResponseFactory = (params?: Partial<Project>): Project => {
  return _.merge(
    {
      id: 278964,
      description:
        'GitLab is an open source end-to-end software development platform with built-in version control, issue tracking, code review, CI/CD, and more. Self-host GitLab on your own servers, in a container, or on a cloud provider.',
      name: 'GitLab',
      name_with_namespace: 'GitLab.org / GitLab',
      path: 'gitlab',
      path_with_namespace: 'gitlab-org/gitlab',
      created_at: '2015-05-20T10:47:11.949Z',
      default_branch: 'master',
      tag_list: [],
      ssh_url_to_repo: 'git@gitlab.com:gitlab-org/gitlab.git',
      http_url_to_repo: 'https://gitlab.com/gitlab-org/gitlab.git',
      web_url: 'https://gitlab.com/gitlab-org/gitlab',
      readme_url: 'https://gitlab.com/gitlab-org/gitlab/-/blob/master/README.md',
      avatar_url: 'https://assets.gitlab-static.net/uploads/-/system/project/avatar/278964/logo-extra-whitespace.png',
      star_count: 1530,
      forks_count: 1654,
      last_activity_at: '2020-03-05T14:26:02.850Z',
      namespace: {
        id: 9970,
        name: 'GitLab.org',
        path: 'gitlab-org',
        kind: 'group',
        full_path: 'gitlab-org',
        parent_id: null,
        avatar_url: '/uploads/-/system/group/avatar/9970/logo-extra-whitespace.png',
        web_url: 'https://gitlab.com/groups/gitlab-org',
      },
    },
    params,
  );
};
