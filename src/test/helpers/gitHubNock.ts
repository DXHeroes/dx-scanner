import nock from 'nock';
import * as nodePath from 'path';

export class GitHubNock {
  repository: Repository;

  constructor(ownerId: string, ownerLogin: string, repoId: number, repoName: string) {
    this.repository = new Repository(repoId, repoName, new UserItem(ownerId, ownerLogin));
  }

  getFile(path: string, content = 'Hello World!\n', sha = '980a0d5f19a64b4b30a87d4206aade58726b60e3', persist = true): File {
    const body = new File(this.repository, path, content, sha);
    return this.getContents(path, body, persist);
  }

  getDirectory(path: string, subfiles: string[], subdirs: string[], persist = true): (FileItem | DirectoryItem)[] {
    const body = [
      ...subfiles.map((name) => new FileItem(this.repository, nodePath.posix.join(path, name))),
      ...subdirs.map((name) => new DirectoryItem(this.repository, nodePath.posix.join(path, name))),
    ];
    return this.getContents(path, body, persist);
  }

  getNonexistentContents(path: string, persist = true): void {
    this.getContents(path, undefined, persist);
  }

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
    pagination?: { page: number; perPage: number };
    persist?: boolean;
  }): PullRequestItem[] {
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
      return new PullRequestItem(
        number,
        state,
        title,
        body,
        new BranchItem(head, this.repository),
        new BranchItem(base, this.repository),
        created_at,
        updated_at,
        lines?.additions,
        lines?.deletions,
      );
    });

    return this.getPullsInternal({
      state: options.queryState,
      pulls: responseBody,
      persist: options.persist,
      pagination: options.pagination,
    });
  }

  getPull(
    number: number,
    state: string,
    title: string,
    body: string,
    head: string,
    base: string,
    persist = true,
    created_at?: string,
    updated_at?: string,
    lines?: {
      additions: number;
      deletions: number;
    },
  ): PullRequest {
    if (!created_at) {
      created_at = '2011-01-26T19:01:12Z';
    }

    if (!updated_at) {
      updated_at = created_at;
    }

    const responseBody = new PullRequest(
      number,
      state,
      title,
      body,
      new BranchItem(head, this.repository),
      new BranchItem(base, this.repository),
      created_at,
      updated_at,
      lines?.additions,
      lines?.deletions,
    );

    return this.getPullsInternal({ number: number, pulls: responseBody, persist: persist });
  }

  getContributors(contributors: { id: string; login: string }[], persist = true): Contributor[] {
    const url = this.repository.contributors_url;
    const code = 200;
    const body = contributors.map(({ id, login }) => new Contributor(id, login));

    GitHubNock.get(url, {}, persist).reply(code, body);
    return body;
  }

  getContributorsStats(contributors: { id: string; login: string }[], persist = true): ContributorsStats[] {
    const url = this.repository.contributors_stats_url;
    const code = 200;
    const body = contributors.map(({ id, login }) => new ContributorsStats(new UserItem(id, login), 1));

    GitHubNock.get(url, {}, persist).reply(code, body);
    return body;
  }

  private getContents<T>(path: string, contents: T, persist = true): T {
    const url = this.repository.contents_url.replace('{+path}', encodeURIComponent(path));
    const params = {};
    const code = contents !== undefined ? 200 : 404;

    GitHubNock.get(url, params, persist).reply(code, contents);
    return contents;
  }

  private getPullsInternal<T extends PullRequest | PullRequestItem[]>(options: {
    number?: number | undefined;
    state?: string | undefined;
    pulls: T;
    persist: boolean;
    pagination?: { page: number; perPage: number } | undefined;
  }): T {
    const url = this.repository.pulls_url.replace('{/number}', options.number !== undefined ? `/${options.number}` : '');
    const params: nock.DataMatcherMap = {};
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

  getCommits(persist = true): nock.Interceptor {
    return GitHubNock.get(this.repository.commits_url.replace('{/sha}', ''), {}, persist);
  }

  getGitCommits(sha: string, persist = true): nock.Interceptor {
    return GitHubNock.get(this.repository.git_commits_url.replace('{/sha}', `/${sha}`), {}, persist);
  }

  getIssues(number?: number, persist = true): nock.Interceptor {
    const url = this.repository.issues_url.replace('{/number}', number !== undefined ? `/${number}` : '');
    const params: nock.DataMatcherMap = {};

    return GitHubNock.get(url, params, persist);
  }

  getRepo(suffix: string, persist = true): nock.Interceptor {
    return GitHubNock.get(this.repository.url + suffix, {}, persist);
  }

  private static get(url: string, params: nock.DataMatcherMap, persist = true): nock.Interceptor {
    const urlObj = new URL(url);

    const scope = nock(urlObj.origin);
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

export class Repository {
  id: number;
  node_id = 'MDEwOlJlcG9zaXRvcnkxMjk2MjY5';
  name: string;
  full_name: string;
  owner: UserItem;
  private = false;
  html_url: string;
  description = '';
  fork = false;
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
  contributors_stats_url: string;
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
  homepage = 'https://example.com';
  language = null;
  forks_count = 0;
  stargazers_count = 0;
  watchers_count = 0;
  size = 365;
  default_branch = 'master';
  open_issues_count = 0;
  is_template = true;
  topics = [];
  has_issues = true;
  has_projects = true;
  has_wiki = true;
  has_pages = false;
  has_downloads = true;
  archived = false;
  disabled = false;
  pushed_at = '2011-01-26T19:06:43Z';
  created_at = '2011-01-26T19:01:12Z';
  updated_at = '2011-01-26T19:14:43Z';
  permissions = {
    admin: true,
    push: true,
    pull: true,
  };
  allow_rebase_merge = true;
  template_repository = null;
  allow_squash_merge = true;
  allow_merge_commit = true;
  subscribers_count = 0;
  network_count = 0;

  constructor(id: number, name: string, owner: UserItem) {
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
    this.contributors_stats_url = `${this.url}/stats/contributors`;
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

class RepoContent {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string | null;
  type = '';
  _links: { self: string; git: string; html: string };

  constructor(
    repository: Repository,
    path: string,
    gitType: string,
    downloadable: boolean,
    sha = '980a0d5f19a64b4b30a87d4206aade58726b60e3',
  ) {
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

export class FileItem extends RepoContent {
  type = 'file';

  constructor(repository: Repository, path: string, sha = '980a0d5f19a64b4b30a87d4206aade58726b60e3') {
    super(repository, path, 'blob', true, sha);
  }
}

export class File extends FileItem {
  content: string;
  encoding: string;

  constructor(repository: Repository, path: string, content = 'Hello World!\n', sha = '980a0d5f19a64b4b30a87d4206aade58726b60e3') {
    super(repository, path, sha);

    const contentBuffer = Buffer.from(content);
    this.size = contentBuffer.length;
    this.encoding = 'base64';
    this.content = contentBuffer.toString(this.encoding);
  }
}

export class DirectoryItem extends RepoContent {
  type = 'dir';

  constructor(repository: Repository, path: string, sha = '980a0d5f19a64b4b30a87d4206aade58726b60e3') {
    super(repository, path, 'tree', false, sha);
  }
}

export class UserItem {
  login: string;
  id: string;
  node_id = 'MDQ6VXNlcjE=';
  avatar_url: string;
  gravatar_id = '';
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
  type = 'User';
  site_admin = false;

  constructor(id: string, login: string) {
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

export class Contributor extends UserItem {
  contributions = 1;
}

export class ContributorsStats {
  author: UserItem;
  total: number;
  weeks = [];
  constructor(author: UserItem, total: number) {
    this.author = author;
    this.total = total;
  }
}

export class BranchItem {
  label: string;
  ref: string;
  sha = '6dcb09b5b57875f334f61aebed695e2e4193db5e';
  user: UserItem;
  repo: Repository;

  constructor(ref: string, repo: Repository) {
    this.ref = ref;
    this.repo = repo;
    this.user = this.repo.owner;
    this.label = `${this.user.login}:${this.ref}`;
  }
}

export class PullRequestItem {
  url: string;
  id = 1;
  node_id = 'MDExOlB1bGxSZXF1ZXN0MQ==';
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
  locked = false;
  title: string;
  user: UserItem;
  body: string;
  labels = [];
  milestone = null;
  created_at: string;
  updated_at = '2011-01-26T19:01:12Z';
  closed_at = '2011-01-26T19:01:12Z';
  merged_at = '2011-01-26T19:01:12Z';
  merge_commit_sha = 'e5bd3914e2e596debea16f433f57875b5b90bcd6';
  assignee = null;
  assignees = [];
  requested_reviewers = [];
  requested_teams = [];
  head: BranchItem;
  base: BranchItem;
  _links: {
    self: { href: string };
    html: { href: string };
    issue: { href: string };
    comments: { href: string };
    review_comments: { href: string };
    review_comment: { href: string };
    commits: { href: string };
    statuses: { href: string };
  };
  author_association = 'OWNER';
  additions: number | undefined;
  deletions: number | undefined;

  constructor(
    number: number,
    state: string,
    title: string,
    body: string,
    head: BranchItem,
    base: BranchItem,
    createdAt: string,
    updatedAt: string,
    additions: number | undefined,
    deletions: number | undefined,
  ) {
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

export class PullRequest extends PullRequestItem {
  merged = false;
  mergeable = true;
  rebaseable = true;
  mergeable_state = 'clean';
  merged_by = null;
  comments = 0;
  review_comments = 0;
  maintainer_can_modify = true;
  commits = 1;
  changed_files = 1;
}
