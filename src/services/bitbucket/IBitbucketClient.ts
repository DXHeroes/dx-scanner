import { DeepRequired } from '../../lib/deepRequired';

export type BitbucketPaginatedPullRequestResponse = DeepRequired<Bitbucket.Response<DeepRequired<Bitbucket.Schema.PaginatedPullrequests>>>;
