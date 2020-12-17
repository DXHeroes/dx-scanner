import nock from 'nock';
export declare class GitHubNock {
    repository: Repository;
    constructor(ownerId: string, ownerLogin: string, repoId: number, repoName: string);
    getFile(path: string, content?: string, sha?: string, persist?: boolean): File;
    getDirectory(path: string, subfiles: string[], subdirs: string[], persist?: boolean): (FileItem | DirectoryItem)[];
    getNonexistentContents(path: string, persist?: boolean): void;
    getPulls(options: {
        pulls: {
            number: number;
            state: string;
            title: string;
            body: string;
            head: string;
            base: string;
            created_at?: string;
            updated_at?: string;
            lines?: {
                additions: number;
                deletions: number;
            };
        }[];
        queryState?: string;
        pagination?: {
            page: number;
            perPage: number;
        };
        persist?: boolean;
    }): PullRequestItem[];
    getPull(number: number, state: string, title: string, body: string, head: string, base: string, persist?: boolean, created_at?: string, updated_at?: string, lines?: {
        additions: number;
        deletions: number;
    }): PullRequest;
    getContributors(contributors: {
        id: string;
        login: string;
    }[], persist?: boolean): Contributor[];
    private getContents;
    private getPullsInternal;
    getCommits(persist?: boolean): nock.Interceptor;
    getGitCommits(sha: string, persist?: boolean): nock.Interceptor;
    getIssues(number?: number, persist?: boolean): nock.Interceptor;
    getRepo(suffix: string, persist?: boolean): nock.Interceptor;
    private static get;
}
export declare class Repository {
    id: number;
    node_id: string;
    name: string;
    full_name: string;
    owner: UserItem;
    private: boolean;
    html_url: string;
    description: string;
    fork: boolean;
    url: string;
    archive_url: string;
    assignees_url: string;
    blobs_url: string;
    branches_url: string;
    collaborators_url: string;
    comments_url: string;
    commits_url: string;
    compare_url: string;
    contents_url: string;
    contributors_url: string;
    deployments_url: string;
    downloads_url: string;
    events_url: string;
    forks_url: string;
    git_commits_url: string;
    git_refs_url: string;
    git_tags_url: string;
    git_url: string;
    issue_comment_url: string;
    issue_events_url: string;
    issues_url: string;
    keys_url: string;
    labels_url: string;
    languages_url: string;
    merges_url: string;
    milestones_url: string;
    notifications_url: string;
    pulls_url: string;
    releases_url: string;
    ssh_url: string;
    stargazers_url: string;
    statuses_url: string;
    subscribers_url: string;
    subscription_url: string;
    tags_url: string;
    teams_url: string;
    trees_url: string;
    clone_url: string;
    mirror_url: string;
    hooks_url: string;
    svn_url: string;
    homepage: string;
    language: null;
    forks_count: number;
    stargazers_count: number;
    watchers_count: number;
    size: number;
    default_branch: string;
    open_issues_count: number;
    is_template: boolean;
    topics: never[];
    has_issues: boolean;
    has_projects: boolean;
    has_wiki: boolean;
    has_pages: boolean;
    has_downloads: boolean;
    archived: boolean;
    disabled: boolean;
    pushed_at: string;
    created_at: string;
    updated_at: string;
    permissions: {
        admin: boolean;
        push: boolean;
        pull: boolean;
    };
    allow_rebase_merge: boolean;
    template_repository: null;
    allow_squash_merge: boolean;
    allow_merge_commit: boolean;
    subscribers_count: number;
    network_count: number;
    constructor(id: number, name: string, owner: UserItem);
}
declare class RepoContent {
    name: string;
    path: string;
    sha: string;
    size: number;
    url: string;
    html_url: string;
    git_url: string;
    download_url: string | null;
    type: string;
    _links: {
        self: string;
        git: string;
        html: string;
    };
    constructor(repository: Repository, path: string, gitType: string, downloadable: boolean, sha?: string);
}
export declare class FileItem extends RepoContent {
    type: string;
    constructor(repository: Repository, path: string, sha?: string);
}
export declare class File extends FileItem {
    content: string;
    encoding: string;
    constructor(repository: Repository, path: string, content?: string, sha?: string);
}
export declare class DirectoryItem extends RepoContent {
    type: string;
    constructor(repository: Repository, path: string, sha?: string);
}
export declare class UserItem {
    login: string;
    id: string;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
    constructor(id: string, login: string);
}
export declare class Contributor extends UserItem {
    contributions: number;
}
export declare class BranchItem {
    label: string;
    ref: string;
    sha: string;
    user: UserItem;
    repo: Repository;
    constructor(ref: string, repo: Repository);
}
export declare class PullRequestItem {
    url: string;
    id: number;
    node_id: string;
    html_url: string;
    diff_url: string;
    patch_url: string;
    issue_url: string;
    commits_url: string;
    review_comments_url: string;
    review_comment_url: string;
    comments_url: string;
    statuses_url: string;
    number: number;
    state: string;
    locked: boolean;
    title: string;
    user: UserItem;
    body: string;
    labels: never[];
    milestone: null;
    created_at: string;
    updated_at: string;
    closed_at: string;
    merged_at: string;
    merge_commit_sha: string;
    assignee: null;
    assignees: never[];
    requested_reviewers: never[];
    requested_teams: never[];
    head: BranchItem;
    base: BranchItem;
    _links: {
        self: {
            href: string;
        };
        html: {
            href: string;
        };
        issue: {
            href: string;
        };
        comments: {
            href: string;
        };
        review_comments: {
            href: string;
        };
        review_comment: {
            href: string;
        };
        commits: {
            href: string;
        };
        statuses: {
            href: string;
        };
    };
    author_association: string;
    additions: number | undefined;
    deletions: number | undefined;
    constructor(number: number, state: string, title: string, body: string, head: BranchItem, base: BranchItem, createdAt: string, updatedAt: string, additions: number | undefined, deletions: number | undefined);
}
export declare class PullRequest extends PullRequestItem {
    merged: boolean;
    mergeable: boolean;
    rebaseable: boolean;
    mergeable_state: string;
    merged_by: null;
    comments: number;
    review_comments: number;
    maintainer_can_modify: boolean;
    commits: number;
    changed_files: number;
}
export {};
//# sourceMappingURL=gitHubNock.d.ts.map