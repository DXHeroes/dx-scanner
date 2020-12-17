import nock from 'nock';
import { ListGetterOptions } from '../../inspectors';
import { Issue } from '../../services/gitlab/gitlabClient/resources/Issues';
import { Branch } from '../../services/gitlab/gitlabClient/resources/Branches';
import { Commit, MergeRequest } from '../../services/gitlab/gitlabClient/resources/MergeRequests';
import { Project } from '../../services/gitlab/gitlabClient/resources/Projects';
import { GitLabIssueState, GitLabPullRequestState } from '../../services/gitlab/IGitLabService';
export declare class GitLabNock {
    user: string;
    repoName: string;
    url: string;
    constructor(user: string, repoName: string, host?: string);
    private pagination;
    private static get;
    getUserInfo(): nock.Scope;
    getGroupInfo(): nock.Scope;
    searchUser(email: string): nock.Scope;
    listPullRequestsResponse(pullRequests: MergeRequest[], options?: ListGetterOptions<{
        state?: GitLabPullRequestState | GitLabPullRequestState[];
    }>): nock.Scope;
    getPullRequestResponse(pullRequest: MergeRequest, mergeIId: number): nock.Scope;
    listPullCommitsResponse(pullCommits: Commit[], mergeIId: number, options?: ListGetterOptions): nock.Scope;
    listRepoCommitsResponse(repoCommits: Commit[], hasNextPage?: boolean, options?: ListGetterOptions): nock.Scope;
    getCommitResponse(commit: Commit, commitId: string): nock.Scope;
    getIssueResponse(issue: Issue): nock.Scope;
    listIssuesResponse(issues: Issue[], options?: ListGetterOptions<{
        state: GitLabIssueState;
    }>): nock.Scope;
    listIssueCommentsResponse(issueNumber: number, options?: ListGetterOptions): nock.Scope;
    listPullRequestCommentsResponse(prNumber: number, options?: ListGetterOptions): nock.Scope;
    getRepoResponse(statusCode?: number, project?: Partial<Project>): nock.Scope;
    listProjects(): nock.Scope;
    listGroups(): nock.Scope;
    checkVersion(): nock.Interceptor;
    listBranchesResponse(issues: Branch[], options?: ListGetterOptions<{
        state: GitLabIssueState;
    }>): nock.Scope;
}
//# sourceMappingURL=gitLabNock.d.ts.map