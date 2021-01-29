import { IssueState } from '../../inspectors';
import { PullRequestState } from '../../inspectors/ICollaborationInspector';
import { BitbucketIssueState, BitbucketPullRequestState } from '../bitbucket/IBitbucketService';
import { GitLabIssueState, GitLabPullRequestState } from '../gitlab/IGitLabService';
import { GitHubGqlPullRequestState, GitHubIssueState, GitHubPullRequestState } from './IGitHubService';
export declare class VCSServicesUtils {
    static getGithubPRState: (state: PullRequestState | undefined) => GitHubPullRequestState | undefined;
    static getGithubGqlPRState: (state: PullRequestState | undefined) => GitHubGqlPullRequestState;
    static getBitbucketPRState: (state: PullRequestState | undefined) => BitbucketPullRequestState.open | BitbucketPullRequestState.closed | BitbucketPullRequestState[] | undefined;
    static getGitLabPRState: (state: PullRequestState | undefined) => GitLabPullRequestState.open | GitLabPullRequestState.all | GitLabPullRequestState[] | undefined;
    static getGitLabIssueState: (state: IssueState | undefined) => GitLabIssueState | undefined;
    static getGithubIssueState: (state: IssueState | undefined) => GitHubIssueState | undefined;
    static getBitbucketIssueState: (state: IssueState | undefined) => BitbucketIssueState.new | BitbucketIssueState.resolved | BitbucketIssueState[] | undefined;
    static getBitbucketStateQueryParam: (state: BitbucketIssueState | BitbucketIssueState[] | undefined) => string | undefined;
    static parseGitHubHeaderLink: (link: string | undefined) => ParsedGitHubLinkHeader | undefined;
}
interface ParsedGitHubLinkHeader {
    prev?: string | null;
    next?: string | null;
    page: number;
    perPage: number;
    totalCount: number;
}
export {};
//# sourceMappingURL=VCSServicesUtils.d.ts.map