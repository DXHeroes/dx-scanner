import { IVCSService } from '..';
import { IssueState, ListGetterOptions, Paginated, PullRequestState } from '../../inspectors';
import { ArgumentsProvider } from '../../scanner';
import { Commit, Contributor, ContributorStats, CreatedUpdatedPullRequestComment, Directory, File, Issue, IssueComment, Lines, PullCommits, PullFiles, PullRequest, PullRequestComment, PullRequestReview, Symlink, Branch } from '../git/model';
import { CustomAxiosResponse } from './gitlabClient/gitlabUtils';
import { RepositoryConfig } from '../../scanner/RepositoryConfig';
export declare class GitLabService implements IVCSService {
    private client;
    private cache;
    private callCount;
    private readonly argumentsProvider;
    private readonly host;
    private readonly repositoryConfig;
    constructor(argumentsProvider: ArgumentsProvider, repositoryConfig: RepositoryConfig);
    purgeCache(): void;
    checkVersion(): Promise<import("./gitlabClient/resources/Version").VersionResponse>;
    getRepo(owner: string, repo: string): Promise<CustomAxiosResponse<import("./gitlabClient/resources/Projects").Project>>;
    /**
     * Lists all pull requests in the repo.
     */
    listPullRequests(owner: string, repo: string, options?: {
        withDiffStat?: boolean;
    } & ListGetterOptions<{
        state?: PullRequestState;
    }>): Promise<Paginated<PullRequest>>;
    /**
     * Get a single pull request.
     */
    getPullRequest(owner: string, repo: string, prNumber: number, withDiffStat?: boolean): Promise<PullRequest>;
    listPullRequestFiles(owner: string, repo: string, prNumber: number): Promise<Paginated<PullFiles>>;
    listPullCommits(owner: string, repo: string, prNumber: number, options?: ListGetterOptions): Promise<Paginated<PullCommits>>;
    listIssues(owner: string, repo: string, options?: ListGetterOptions<{
        state?: IssueState;
    }>): Promise<Paginated<Issue>>;
    getIssue(owner: string, repo: string, issueNumber: number): Promise<Issue>;
    listIssueComments(owner: string, repo: string, issueNumber: number, options?: ListGetterOptions): Promise<Paginated<IssueComment>>;
    listBranches(owner: string, repo: string, options?: ListGetterOptions): Promise<Paginated<Branch>>;
    listPullRequestReviews(owner: string, repo: string, prNumber: number): Promise<Paginated<PullRequestReview>>;
    listRepoCommits(owner: string, repo: string, options?: ListGetterOptions): Promise<Paginated<Commit>>;
    getCommit(owner: string, repo: string, commitSha: string): Promise<Commit>;
    /**
     * List Comments for a Pull Request
     */
    listPullRequestComments(owner: string, repo: string, prNumber: number, options?: ListGetterOptions): Promise<Paginated<PullRequestComment>>;
    /**
     * Add Comment to a Pull Request
     */
    createPullRequestComment(owner: string, repo: string, prNumber: number, body: string): Promise<CreatedUpdatedPullRequestComment>;
    /**
     * Update Comment on a Pull Request
     */
    updatePullRequestComment(owner: string, repo: string, commentId: number, body: string, pullRequestId: number): Promise<CreatedUpdatedPullRequestComment>;
    listRepos(): Promise<import("./gitlabClient/resources/Projects").Project[]>;
    listGroups(): Promise<import("./gitlabClient/resources/UsersOrGroups").Group[]>;
    listContributors(owner: string, repo: string, options?: ListGetterOptions): Promise<Contributor[]>;
    private getAllCommits;
    listContributorsStats(owner: string, repo: string): Promise<Paginated<ContributorStats>>;
    getRepoContent(owner: string, repo: string, path: string): Promise<File | Symlink | Directory | null>;
    getPullsDiffStat(owner: string, repo: string, prNumber: number): Promise<Lines>;
    private getUserInfo;
    private searchUser;
    private getPagination;
    /**
     * Debug GitLab request promise
     */
    private unwrap;
    /**
     * Debug GitLab response
     * - count API calls and inform about remaining rate limit
     */
    private debugGitLabResponse;
}
//# sourceMappingURL=GitLabService.d.ts.map