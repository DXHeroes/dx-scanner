import { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods';

// https://github.com/octokit/plugin-rest-endpoint-methods.js
export type PullsListParams = RestEndpointMethodTypes['pulls']['list']['parameters'];
export type IssuesListForRepoParams = RestEndpointMethodTypes['issues']['listForRepo']['parameters'];
export type IssuesListCommentsParams = RestEndpointMethodTypes['issues']['listComments']['parameters'];
export type PullsListCommitsParams = RestEndpointMethodTypes['pulls']['listCommits']['parameters'];
