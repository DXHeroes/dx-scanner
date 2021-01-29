import { IGitInspector, Commit, Author, Tag } from './IGitInspector';
import { ListGetterOptions } from './common/ListGetterOptions';
import { Paginated } from './common/Paginated';
/**
 * A Git repository inspector.
 */
export declare class GitInspector implements IGitInspector {
    /**
     * The repository to be inspected.
     */
    private readonly git;
    /**
     * Create an instance of GitInspector.
     *
     * @param repoPath A path to the repository to be inspected.
     */
    constructor(repoPath: string);
    /**
     * Get commits in the repository.
     *
     * @param options Options specifying a subset of all the repository commits.
     * @returns The specified commits.
     * @throws Throws an arror if there are no commits in the repository (the path does not exist, the path is not a repository, no commits in the repository) or if sorting is required.
     */
    getCommits(options: ListGetterOptions<{
        author?: string;
        path?: string;
        sha?: string;
        since?: Date;
        until?: Date;
    }>): Promise<Paginated<Commit>>;
    /**
     * Get authors in the repository.
     *
     * @param options Options specifying a subset of all the repository authors.
     * @returns The specified authors.
     * @throws Throws an arror if there are no commits in the repository (the path does not exist, the path is not a repository, no commits in the repository) or if filtering or sorting is required.
     */
    getAuthors(options: ListGetterOptions): Promise<Paginated<Author>>;
    /**
     * Get tags in the repository.
     *
     * @returns The tags.
     * @throws Throws an error if there is no repository (the path does not exist, the path is not a repository).
     */
    getAllTags(): Promise<Tag[]>;
    getStatus(): Promise<import("simple-git").StatusResult>;
}
//# sourceMappingURL=GitInspector.d.ts.map