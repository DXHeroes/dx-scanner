import _ from 'lodash';
import { Branch } from '../../../../services/gitlab/gitlabClient/resources/Branches';

export const gitLabBranchResponseFactory = (params: Partial<Branch>): Branch => {
  return _.merge(
    {
      name: 'master',
      default: true,
    },
    params,
  );
};
