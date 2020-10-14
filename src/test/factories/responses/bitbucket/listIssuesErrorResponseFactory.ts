import Bitbucket from 'bitbucket';

export const bitbucketListIssuesErrorResponseFactory = (): Bitbucket.Schema.Error => {
  return { type: 'error', error: { message: 'Repository has no issue tracker.' } };
};
