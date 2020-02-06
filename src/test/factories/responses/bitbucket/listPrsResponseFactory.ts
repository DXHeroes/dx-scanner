import Bitbucket from 'bitbucket';

export const bitbucketListPRsResponseFactory = (items: Bitbucket.Schema.Pullrequest[] = []): Bitbucket.Schema.PaginatedPullrequests => {
  return {
    values: items,
    next: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests?page=2',
    previous: '//TODO: "previous" is not present when it is a first page',
    page: 1,
    pagelen: items.length,
    size: items.length,
  };
};
