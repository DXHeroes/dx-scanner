import { Schema } from 'bitbucket';
import { Response } from 'bitbucket/src/request/types';
import { IVCSService } from '..';
import { ArgumentsProvider } from '../../scanner';
import { ListGetterOptions, PullRequestState, Paginated } from '../../inspectors';
import { IssueState } from '../../inspectors/IIssueTrackingInspector';
import { PullRequest, PullFiles, PullCommits, Issue, IssueComment, PullRequestReview, Commit, PullRequestComment, CreatedUpdatedPullRequestComment, Contributor, ContributorStats, Symlink, File, Directory, Branch } from '../git/model';
import { RepositoryConfig } from '../../scanner/RepositoryConfig';
export declare class BitbucketService implements IVCSService {
    private client;
    private readonly argumentsProvider;
    private cache;
    private callCount;
    private authenticated;
    private readonly repositoryConfig;
    constructor(argumentsProvider: ArgumentsProvider, repositoryConfig: RepositoryConfig);
    purgeCache(): void;
    authenticate(): void;
    getRepo(owner: string, repo: string): Promise<Response<Schema.Repository>>;
    listPullRequests(owner: string, repo: string, options?: {
        withDiffStat?: boolean;
    } & ListGetterOptions<{
        state?: PullRequestState;
    }>): Promise<Paginated<PullRequest>>;
    getPullRequest(owner: string, repo: string, prNumber: number, withDiffStat?: boolean): Promise<PullRequest>;
    listPullRequestFiles(owner: string, repo: string, prNumber: number): Promise<Paginated<PullFiles>>;
    listPullCommits(owner: string, repo: string, prNumber: number, options?: ListGetterOptions): Promise<Paginated<PullCommits>>;
    listIssues(owner: string, repo: string, options?: ListGetterOptions<{
        state?: IssueState;
    }>): Promise<Paginated<Issue>>;
    getIssue(owner: string, repo: string, issueNumber: number): Promise<Issue>;
    listIssueComments(owner: string, repo: string, issueNumber: number): Promise<Paginated<IssueComment>>;
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
    listContributors(owner: string, repo: string): Promise<Contributor[]>;
    listContributorsStats(owner: string, repo: string): Promise<Paginated<ContributorStats>>;
    getRepoContent(owner: string, repo: string, path: string): Promise<File | Symlink | Directory | null>;
    /**
     * Add additions, deletions and changes of pull request when the getPullRequests() is called with withDiffStat = true
     */
    getPullsDiffStat(owner: string, repo: string, prNumber: number): Promise<{
        additions: number;
        deletions: number;
        changes: number;
    }>;
    private paginateCommits;
    private unwrap;
    private debugBitbucketResponse;
    getPagination<T>(data: {
        next?: string;
        previous?: string;
        page?: number;
        values: T[];
    }): {
        totalCount: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
        page: number | undefined;
        perPage: number;
    };
    private extractEmailFromString;
}
export interface BitbucketCommit {
    next: string;
    page: number;
    pagelen: number;
    previous: string;
    size: number;
    values: Schema.Commit[];
}
//# sourceMappingURL=BitbucketService.d.ts.map