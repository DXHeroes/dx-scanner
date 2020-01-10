import { BitbucketCommit } from '../../../../services';

export const bitbucketListCommitResponseFactory = (items: Bitbucket.Schema.Commit[]): BitbucketCommit => {
  return {
    values: items,
    next: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/commits?page=2',
    previous: '//TODO: "previous" is not present when it is a first page',
    page: 1,
    pagelen: items.length,
    size: items.length,
  };
};
