import _ from 'lodash';
import { VersionResponse } from '../../../../services/gitlab/gitlabClient/resources/Version';

export const gitLabVersionResponseFactory = (params?: Partial<VersionResponse>): VersionResponse => {
  return _.merge({ version: '1.0.0', revision: '225c2e' }, params);
};
