import nock from 'nock';
import { ListGetterOptions } from '../../inspectors';
import { BitbucketPullRequestState, BitbucketIssueState } from '../../services/bitbucket/IBitbucketService';
import Bitbucket from 'bitbucket';
import { BitbucketCommit } from '../../services';
export declare class BitbucketNock {
    user: string;
    repoName: string;
    url: string;
    constructor(user: string, repoName: string);
    private static get;
    getOwnerId(): nock.Scope;
    listPullRequestsResponse(pullRequests: Bitbucket.Schema.Pullrequest[], options?: ListGetterOptions<{
        state?: BitbucketPullRequestState | BitbucketPullRequestState[];
    }>): nock.Scope;
    getPullRequestResponse(pullRequest: Bitbucket.Schema.Pullrequest): nock.Scope;
    getPRsAdditionsAndDeletions(prNumber: number): nock.Scope;
    listIssuesResponse(issues: Bitbucket.Schema.Issue[], options?: ListGetterOptions<{
        state?: BitbucketIssueState | BitbucketIssueState[];
    }>): nock.Scope;
    listIssuesErrorResponse(): nock.Scope;
    getIssueResponse(issue: Bitbucket.Schema.Issue): nock.Scope;
    listIssueCommentsResponse(issueComments: Bitbucket.Schema.IssueComment[], issueId: number): nock.Scope;
    listPullCommits(pullCommits: Bitbucket.Schema.Commit[], prNumber: number): nock.Scope;
    listCommitsResponse(params?: Partial<BitbucketCommit>): nock.Scope;
    getCommitResponse(commit: Bitbucket.Schema.Commit, commitSha: string): nock.Scope;
    getRepoResponse(): nock.Scope;
}
//# sourceMappingURL=bitbucketNock.d.ts.map