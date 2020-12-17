import { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods';
export declare type PullsListParams = RestEndpointMethodTypes['pulls']['list']['parameters'];
export declare type IssuesListForRepoParams = RestEndpointMethodTypes['issues']['listForRepo']['parameters'];
export declare type IssuesListCommentsParams = RestEndpointMethodTypes['issues']['listComments']['parameters'];
export declare type PullsListCommitsParams = RestEndpointMethodTypes['pulls']['listCommits']['parameters'];
export declare type GetContentsResponse = RestEndpointMethodTypes['repos']['getContent']['response'] & GitHubSymlink;
export declare type ReposGetResponseData = RestEndpointMethodTypes['repos']['get']['response'];
declare type GitHubSymlink = {
    data: {
        target: string;
    };
};
export {};
//# sourceMappingURL=OctokitTypes.d.ts.map