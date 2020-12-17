import { ListGetterOptions } from '../../inspectors/common/ListGetterOptions';
import { Paginated } from '../../inspectors/common/Paginated';
import { PullRequestState } from '../../inspectors/ICollaborationInspector';
import { IssueState } from '../../inspectors/IIssueTrackingInspector';
import { ArgumentsProvider } from '../../scanner';
import { RepositoryConfig } from '../../scanner/RepositoryConfig';
import { IVCSService } from './IVCSService';
import { Branch, Commit, Contributor, ContributorStats, CreatedUpdatedPullRequestComment, Directory, File, Issue, IssueComment, PullCommits, PullFiles, PullRequest, PullRequestComment, PullRequestReview, Symlink } from './model';
import { ReposGetResponseData } from './OctokitTypes';
export declare class GitHubService implements IVCSService {
    private readonly client;
    private cache;
    private callCount;
    private readonly graphqlWithAuth;
    private readonly repositoryConfig;
    constructor(argumentsProvider: ArgumentsProvider, repositoryConfig: RepositoryConfig);
    purgeCache(): void;
    /**
     * The parent and source objects are present when the repository is a fork.
     *
     * 'parent' is the repository this repository was forked from.
     * 'source' is the ultimate source for the network.
     */
    getRepo(owner: string, repo: string): Promise<ReposGetResponseData>;
    /**
     * Lists all pull requests in the repo using GraphQL.
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
    /**
     * Lists all reviews on pull request in the repo.
     */
    listPullRequestReviews(owner: string, repo: string, prNumber: number): Promise<Paginated<PullRequestReview>>;
    /**
     * Lists commits in the repository.
     *
     * The response will include a verification object that describes the result of verifying the commit's signature.
     * To see the included fields in the verification object see https://octokit.github.io/rest.js/#pagination.
     *
     * Sha can be SHA or branch name.
     */
    listRepoCommits(owner: string, repo: string, options?: ListGetterOptions): Promise<Paginated<Commit>>;
    /**
     * Get the Commit of the given commit_sha in the repo.
     */
    getCommit(owner: string, repo: string, commitSha: string): Promise<Commit>;
    /**
     * Lists contributors to the specified repository and sorts them by the number of commits per contributor in descending order.
     */
    listContributors(owner: string, repo: string): Promise<Contributor[]>;
    /**
     * total - The Total number of commits authored by the contributor.
     *  Weekly Hash (weeks array):
     *
     *    w - Start of the week, given as a Unix timestamp.
     *    a - Number of additions
     *    d - Number of deletions
     *    c - Number of commits
     */
    listContributorsStats(owner: string, repo: string): Promise<Paginated<ContributorStats>>;
    /**
     * Gets the contents of a file or directory in a repository.
     */
    getRepoContent(owner: string, repo: string, path: string): Promise<File | Symlink | Directory | null>;
    /**
     * List all issues in the repo.
     */
    listIssues(owner: string, repo: string, options?: ListGetterOptions<{
        state?: IssueState;
    }>): Promise<Paginated<Issue>>;
    /**
     * Get a single issue in the repo.
     */
    getIssue(owner: string, repo: string, issueNumber: number): Promise<Issue>;
    /**
     * Get All Comments for an Issue
     */
    listIssueComments(owner: string, repo: string, issueNumber: number, options?: ListGetterOptions): Promise<Paginated<IssueComment>>;
    listBranches(owner: string, repo: string, options?: ListGetterOptions): Promise<Paginated<Branch>>;
    /**
     * Lists all pull request files.
     */
    listPullRequestFiles(owner: string, repo: string, prNumber: number): Promise<Paginated<PullFiles>>;
    /**
     * Lists commits on a pull request.
     */
    listPullCommits(owner: string, repo: string, prNumber: number, options?: ListGetterOptions): Promise<Paginated<PullCommits>>;
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
    updatePullRequestComment(owner: string, repo: string, commentId: number, body: string): Promise<CreatedUpdatedPullRequestComment>;
    /**
     * Add additions, deletions and changes of pull request when the getPullRequests() is called with withDiffStat = true
     */
    getPullsDiffStat(owner: string, repo: string, prNumber: number): Promise<{
        additions: number;
        deletions: number;
        changes: number;
    }>;
    getPagination(totalCount: number, link?: string, hasNextPage?: boolean, hasPreviousPage?: boolean): {
        totalCount: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
        page: number;
        perPage: number;
    };
    /**
     * Debug GitHub request promise
     */
    private unwrap;
    /**
     * Debug GitHub REST response
     * - count API calls and inform about remaining rate limit
     */
    private debugGitHubResponse;
    /**
     * Debug GitHub GQL request promise
     */
    private unwrapGql;
    /**
     * Debug GitHub GQL response
     * - count API calls and inform about remaining rate limit
     */
    private debugGitHubGqlResponse;
}
//# sourceMappingURL=GitHubService.d.ts.map