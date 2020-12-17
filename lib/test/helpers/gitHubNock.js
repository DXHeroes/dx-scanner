"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PullRequest = exports.PullRequestItem = exports.BranchItem = exports.Contributor = exports.UserItem = exports.DirectoryItem = exports.File = exports.FileItem = exports.Repository = exports.GitHubNock = void 0;
const nock_1 = __importDefault(require("nock"));
const nodePath = __importStar(require("path"));
class GitHubNock {
    constructor(ownerId, ownerLogin, repoId, repoName) {
        this.repository = new Repository(repoId, repoName, new UserItem(ownerId, ownerLogin));
    }
    getFile(path, content = 'Hello World!\n', sha = '980a0d5f19a64b4b30a87d4206aade58726b60e3', persist = true) {
        const body = new File(this.repository, path, content, sha);
        return this.getContents(path, body, persist);
    }
    getDirectory(path, subfiles, subdirs, persist = true) {
        const body = [
            ...subfiles.map((name) => new FileItem(this.repository, nodePath.posix.join(path, name))),
            ...subdirs.map((name) => new DirectoryItem(this.repository, nodePath.posix.join(path, name))),
        ];
        return this.getContents(path, body, persist);
    }
    getNonexistentContents(path, persist = true) {
        this.getContents(path, undefined, persist);
    }
    getPulls(options) {
        if (!options.persist) {
            options.persist = true;
        }
        const responseBody = options.pulls.map(({ number, state, title, body, head, base, created_at, updated_at, lines }) => {
            if (!created_at) {
                created_at = '2011-01-26T19:01:12Z';
            }
            if (!updated_at) {
                updated_at = created_at;
            }
            return new PullRequestItem(number, state, title, body, new BranchItem(head, this.repository), new BranchItem(base, this.repository), created_at, updated_at, lines === null || lines === void 0 ? void 0 : lines.additions, lines === null || lines === void 0 ? void 0 : lines.deletions);
        });
        return this.getPullsInternal({
            state: options.queryState,
            pulls: responseBody,
            persist: options.persist,
            pagination: options.pagination,
        });
    }
    getPull(number, state, title, body, head, base, persist = true, created_at, updated_at, lines) {
        if (!created_at) {
            created_at = '2011-01-26T19:01:12Z';
        }
        if (!updated_at) {
            updated_at = created_at;
        }
        const responseBody = new PullRequest(number, state, title, body, new BranchItem(head, this.repository), new BranchItem(base, this.repository), created_at, updated_at, lines === null || lines === void 0 ? void 0 : lines.additions, lines === null || lines === void 0 ? void 0 : lines.deletions);
        return this.getPullsInternal({ number: number, pulls: responseBody, persist: persist });
    }
    getContributors(contributors, persist = true) {
        const url = this.repository.contributors_url;
        const code = 200;
        const body = contributors.map(({ id, login }) => new Contributor(id, login));
        GitHubNock.get(url, {}, persist).reply(code, body);
        return body;
    }
    getContents(path, contents, persist = true) {
        const url = this.repository.contents_url.replace('{+path}', encodeURIComponent(path));
        const params = {};
        const code = contents !== undefined ? 200 : 404;
        GitHubNock.get(url, params, persist).reply(code, contents);
        return contents;
    }
    getPullsInternal(options) {
        const url = this.repository.pulls_url.replace('{/number}', options.number !== undefined ? `/${options.number}` : '');
        const params = {};
        if (options.state !== undefined) {
            params.state = options.state;
        }
        if (options.pagination) {
            params.page = options.pagination.page;
            params.per_page = options.pagination.perPage;
        }
        GitHubNock.get(url, params, options.persist).reply(200, options.pulls);
        return options.pulls;
    }
    getCommits(persist = true) {
        return GitHubNock.get(this.repository.commits_url.replace('{/sha}', ''), {}, persist);
    }
    getGitCommits(sha, persist = true) {
        return GitHubNock.get(this.repository.git_commits_url.replace('{/sha}', `/${sha}`), {}, persist);
    }
    getIssues(number, persist = true) {
        const url = this.repository.issues_url.replace('{/number}', number !== undefined ? `/${number}` : '');
        const params = {};
        return GitHubNock.get(url, params, persist);
    }
    getRepo(suffix, persist = true) {
        return GitHubNock.get(this.repository.url + suffix, {}, persist);
    }
    static get(url, params, persist = true) {
        const urlObj = new URL(url);
        const scope = nock_1.default(urlObj.origin);
        if (persist) {
            scope.persist();
        }
        const interceptor = scope.get(urlObj.pathname);
        if (Object.keys(params)) {
            interceptor.query(params);
        }
        return interceptor;
    }
}
exports.GitHubNock = GitHubNock;
class Repository {
    constructor(id, name, owner) {
        this.node_id = 'MDEwOlJlcG9zaXRvcnkxMjk2MjY5';
        this.private = false;
        this.description = '';
        this.fork = false;
        this.homepage = 'https://example.com';
        this.language = null;
        this.forks_count = 0;
        this.stargazers_count = 0;
        this.watchers_count = 0;
        this.size = 365;
        this.default_branch = 'master';
        this.open_issues_count = 0;
        this.is_template = true;
        this.topics = [];
        this.has_issues = true;
        this.has_projects = true;
        this.has_wiki = true;
        this.has_pages = false;
        this.has_downloads = true;
        this.archived = false;
        this.disabled = false;
        this.pushed_at = '2011-01-26T19:06:43Z';
        this.created_at = '2011-01-26T19:01:12Z';
        this.updated_at = '2011-01-26T19:14:43Z';
        this.permissions = {
            admin: true,
            push: true,
            pull: true,
        };
        this.allow_rebase_merge = true;
        this.template_repository = null;
        this.allow_squash_merge = true;
        this.allow_merge_commit = true;
        this.subscribers_count = 0;
        this.network_count = 0;
        this.id = id;
        this.name = name;
        this.owner = owner;
        this.full_name = `${this.owner.login}/${this.name}`;
        this.html_url = `${this.owner.html_url}/${this.name}`;
        this.url = `https://api.github.com/repos/${this.full_name}`;
        this.archive_url = `${this.url}/{archive_format}{/ref}`;
        this.assignees_url = `${this.url}/assignees{/user}`;
        this.blobs_url = `${this.url}/git/blobs{/sha}`;
        this.branches_url = `${this.url}/branches{/branch}`;
        this.collaborators_url = `${this.url}/collaborators{/collaborator}`;
        this.comments_url = `${this.url}/comments{/number}`;
        this.commits_url = `${this.url}/commits{/sha}`;
        this.compare_url = `${this.url}/compare/{base}...{head}`;
        this.contents_url = `${this.url}/contents/{+path}`;
        this.contributors_url = `${this.url}/contributors`;
        this.deployments_url = `${this.url}/deployments`;
        this.downloads_url = `${this.url}/downloads`;
        this.events_url = `${this.url}/events`;
        this.forks_url = `${this.url}/forks`;
        this.git_commits_url = `${this.url}/git/commits{/sha}`;
        this.git_refs_url = `${this.url}/git/refs{/sha}`;
        this.git_tags_url = `${this.url}/git/tags{/sha}`;
        this.git_url = `git:github.com/${this.full_name}.git`;
        this.issue_comment_url = `${this.url}/issues/comments{/number}`;
        this.issue_events_url = `${this.url}/issues/events{/number}`;
        this.issues_url = `${this.url}/issues{/number}`;
        this.keys_url = `${this.url}/keys{/key_id}`;
        this.labels_url = `${this.url}/labels{/name}`;
        this.languages_url = `${this.url}/languages`;
        this.merges_url = `${this.url}/merges`;
        this.milestones_url = `${this.url}/milestones{/number}`;
        this.notifications_url = `${this.url}/notifications{?since,all,participating}`;
        this.pulls_url = `${this.url}/pulls{/number}`;
        this.releases_url = `${this.url}/releases{/id}`;
        this.ssh_url = `git@github.com:${this.full_name}.git`;
        this.stargazers_url = `${this.url}/stargazers`;
        this.statuses_url = `${this.url}/statuses/{sha}`;
        this.subscribers_url = `${this.url}/subscribers`;
        this.subscription_url = `${this.url}/subscription`;
        this.tags_url = `${this.url}/tags`;
        this.teams_url = `${this.url}/teams`;
        this.trees_url = `${this.url}/git/trees{/sha}`;
        this.clone_url = `https://github.com/${this.full_name}.git`;
        this.mirror_url = `git:git.example.com/${this.full_name}`;
        this.hooks_url = `${this.url}/hooks`;
        this.svn_url = `https://svn.github.com/${this.full_name}`;
    }
}
exports.Repository = Repository;
class RepoContent {
    constructor(repository, path, gitType, downloadable, sha = '980a0d5f19a64b4b30a87d4206aade58726b60e3') {
        this.type = '';
        const ref = 'master';
        let gitPattern = '';
        switch (gitType) {
            case 'blob':
                gitPattern = repository.blobs_url;
                break;
            case 'tree':
                gitPattern = repository.trees_url;
        }
        this.name = nodePath.posix.basename(path);
        this.path = path;
        this.sha = sha;
        this.size = 0;
        this.url = repository.contents_url.replace('{+path}', `${this.path}?ref=${ref}`);
        this.html_url = `${repository.html_url}/${gitType}/${ref}/${this.path}`;
        this.git_url = gitPattern.replace('{/sha}', `/${this.sha}`);
        this.download_url = downloadable
            ? `https://raw.githubusercontent.com/${repository.owner.login}/${repository.name}/${ref}/${this.path}`
            : null;
        this._links = {
            self: this.url,
            git: this.git_url,
            html: this.html_url,
        };
    }
}
class FileItem extends RepoContent {
    constructor(repository, path, sha = '980a0d5f19a64b4b30a87d4206aade58726b60e3') {
        super(repository, path, 'blob', true, sha);
        this.type = 'file';
    }
}
exports.FileItem = FileItem;
class File extends FileItem {
    constructor(repository, path, content = 'Hello World!\n', sha = '980a0d5f19a64b4b30a87d4206aade58726b60e3') {
        super(repository, path, sha);
        const contentBuffer = Buffer.from(content);
        this.size = contentBuffer.length;
        this.encoding = 'base64';
        this.content = contentBuffer.toString(this.encoding);
    }
}
exports.File = File;
class DirectoryItem extends RepoContent {
    constructor(repository, path, sha = '980a0d5f19a64b4b30a87d4206aade58726b60e3') {
        super(repository, path, 'tree', false, sha);
        this.type = 'dir';
    }
}
exports.DirectoryItem = DirectoryItem;
class UserItem {
    constructor(id, login) {
        this.node_id = 'MDQ6VXNlcjE=';
        this.gravatar_id = '';
        this.type = 'User';
        this.site_admin = false;
        this.login = login;
        this.id = id;
        this.avatar_url = `https://avatars3.githubusercontent.cm/u/${this.id}`;
        this.url = `https://api.github.com/users/${this.login}`;
        this.html_url = `https://github.com/${this.login}`;
        this.followers_url = `${this.url}/followers`;
        this.following_url = `${this.url}/following{/other_user}`;
        this.gists_url = `${this.url}/gists{/gist_id}`;
        this.starred_url = `${this.url}/starred{/owner}{/repo}`;
        this.subscriptions_url = `${this.url}/subscriptions`;
        this.organizations_url = `${this.url}/orgs`;
        this.repos_url = `${this.url}/repos`;
        this.events_url = `${this.url}/events{/privacy}`;
        this.received_events_url = `${this.url}/received_events`;
    }
}
exports.UserItem = UserItem;
class Contributor extends UserItem {
    constructor() {
        super(...arguments);
        this.contributions = 1;
    }
}
exports.Contributor = Contributor;
class BranchItem {
    constructor(ref, repo) {
        this.sha = '6dcb09b5b57875f334f61aebed695e2e4193db5e';
        this.ref = ref;
        this.repo = repo;
        this.user = this.repo.owner;
        this.label = `${this.user.login}:${this.ref}`;
    }
}
exports.BranchItem = BranchItem;
class PullRequestItem {
    constructor(number, state, title, body, head, base, createdAt, updatedAt, additions, deletions) {
        this.id = 1;
        this.node_id = 'MDExOlB1bGxSZXF1ZXN0MQ==';
        this.locked = false;
        this.labels = [];
        this.milestone = null;
        this.updated_at = '2011-01-26T19:01:12Z';
        this.closed_at = '2011-01-26T19:01:12Z';
        this.merged_at = '2011-01-26T19:01:12Z';
        this.merge_commit_sha = 'e5bd3914e2e596debea16f433f57875b5b90bcd6';
        this.assignee = null;
        this.assignees = [];
        this.requested_reviewers = [];
        this.requested_teams = [];
        this.author_association = 'OWNER';
        this.additions = additions;
        this.deletions = deletions;
        this.number = number;
        this.base = base;
        this.head = head;
        this.url = this.base.repo.pulls_url.replace('{/number}', `/${this.number}`);
        this.commits_url = `${this.url}/commits`;
        this.review_comments_url = `${this.url}/comments`;
        this.review_comment_url = `${this.base.repo.pulls_url.replace('{/number}', '')}/comments{/number}`;
        this.issue_url = this.base.repo.issues_url.replace('{/number}', `/${this.number}`);
        this.comments_url = `${this.issue_url}/comments`;
        this.html_url = `${this.base.repo.html_url}/pull/${this.number}`;
        this.diff_url = `${this.html_url}.diff`;
        this.patch_url = `${this.html_url}.patch`;
        this.statuses_url = this.head.repo.statuses_url.replace('{sha}', this.head.ref);
        this.state = state;
        this.title = title;
        this.user = this.head.user;
        this.body = body;
        this.created_at = createdAt;
        this.updated_at = updatedAt;
        this._links = {
            self: { href: this.url },
            html: { href: this.html_url },
            issue: { href: this.issue_url },
            comments: { href: this.comments_url },
            review_comments: { href: this.review_comments_url },
            review_comment: { href: this.review_comment_url },
            commits: { href: this.commits_url },
            statuses: { href: this.statuses_url },
        };
    }
}
exports.PullRequestItem = PullRequestItem;
class PullRequest extends PullRequestItem {
    constructor() {
        super(...arguments);
        this.merged = false;
        this.mergeable = true;
        this.rebaseable = true;
        this.mergeable_state = 'clean';
        this.merged_by = null;
        this.comments = 0;
        this.review_comments = 0;
        this.maintainer_can_modify = true;
        this.commits = 1;
        this.changed_files = 1;
    }
}
exports.PullRequest = PullRequest;
//# sourceMappingURL=gitHubNock.js.map