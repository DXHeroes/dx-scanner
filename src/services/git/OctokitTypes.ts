import { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods';

// https://github.com/octokit/plugin-rest-endpoint-methods.js
export type PullsListParams = RestEndpointMethodTypes['pulls']['list']['parameters'];
export type IssuesListForRepoParams = RestEndpointMethodTypes['issues']['listForRepo']['parameters'];
export type IssuesListCommentsParams = RestEndpointMethodTypes['issues']['listComments']['parameters'];
export type PullsListCommitsParams = RestEndpointMethodTypes['pulls']['listCommits']['parameters'];
export type GetContentsResponse = RestEndpointMethodTypes['repos']['getContent']['response'] & GitHubSymlink;
export type ReposGetResponseData = RestEndpointMethodTypes['repos']['get']['response'];

// fix type as the target is missing https://developer.github.com/v3/repos/contents/#response-if-content-is-a-symlink
type GitHubSymlink = {
  data: {
    target: string;
  };
};
