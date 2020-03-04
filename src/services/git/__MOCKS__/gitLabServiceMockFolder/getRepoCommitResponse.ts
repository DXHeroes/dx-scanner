import { Commit } from '../../model';
import _ from 'lodash';

export const getRepoCommit = (params?: Partial<Commit>): Commit => {
  return _.merge(
    {
      sha: 'df760e1c70f6903017a91f57dd3d9d7f230c54d7',
      url: 'gitlab.com/projects/gitlab-org/gitlab/repository/commits/df760e1c',
      message: 'Update CHANGELOG.md for 12.8.1\n\n[ci skip]',
      author: {
        name: 'GitLab Release Tools Bot',
        email: 'delivery-team+release-tools@gitlab.com',
        date: '2020-02-24T15:26:36.000+00:00',
      },
      tree: {
        sha: '52fe4982b340317231054002c7f3a7cc5165758f',
        url: 'gitlab.com/projects/gitlab-org/gitlab/repository/commits/52fe4982b340317231054002c7f3a7cc5165758f',
      },
      verified: false,
    },
    params,
  );
};
