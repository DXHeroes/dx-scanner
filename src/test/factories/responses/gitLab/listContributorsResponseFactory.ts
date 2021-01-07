import _ from 'lodash';
import { Contributor } from '../../../../services/gitlab/gitlabClient/resources/Contributors';

export const gitLabListContributorsResponseFactory = (params?: Partial<Contributor>): Contributor => {
  return _.merge(
    {
      name: 'adela',
      email: 'adela@gitlab.com',
      commits: 1,
    },
    params,
  );
};
