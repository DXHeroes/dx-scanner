import { BitbucketCommit } from '../../../../services';
import _ from 'lodash';

export const bitbucketListCommitResponseFactory = (params?: Partial<BitbucketCommit>): BitbucketCommit => {
  return _.merge(
    {
      values: [],
      next: null,
      previous: '//TODO: "previous" is not present when it is a first page',
      page: 1,
      pagelen: 0,
      size: 0,
    },
    params,
  );
};
