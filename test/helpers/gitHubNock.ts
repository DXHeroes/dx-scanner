import nock from 'nock';
import * as nodePath from 'path';

export class GitHubNock {
  repository: Repository;

  constructor(ownerId: number, ownerLogin: string, repoId: number, repoName: string) {
    this.repository = new Repository(repoId, repoName, new UserItem(ownerId, ownerLogin));
  }

  getFile(path: string, content = 'Hello World!\n', sha = '980a0d5f19a64b4b30a87d4206aade58726b60e3', persist = true): File {
    const body = new File(this.repository, path, content, sha);
    return this.getContents(path, body, persist);
  }

  getSymlink(path: string, target: string, sha = '980a0d5f19a64b4b30a87d4206aade58726b60e3', persist = true): Symlink {
    const body = new Symlink(this.repository, path, target, sha);
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

  getPulls(
    pulls: {
      number: number;
      state: string;
      title: string;
      body: string;
      head: { ref: string; repo: { id: number; name: string; owner: { id: number; login: string } } };
      base: { ref: string; repo: { id: number; name: string; owner: { id: number; login: string } } };
    }[],
    queryState?: string,
    persist = true,
  ): PullRequestItem[] {
    const code = 200;
    const responseBody = pulls.map(
      ({ number, state, title, body, head, base }) =>
        new PullRequestItem(
          number,
          state,
          title,
          body,
          new BranchItem(head.ref, new Repository(head.repo.id, head.repo.name, new UserItem(head.repo.owner.id, head.repo.owner.login))),
          new BranchItem(base.ref, new Repository(base.repo.id, base.repo.name, new UserItem(base.repo.owner.id, base.repo.owner.login))),
        ),
    );

    this.getPullsInternal(undefined, queryState, persist).reply(code, responseBody);
    return responseBody;
  }

  getContributors(contributors: { id: number; login: string }[], anon?: boolean, persist = true): Contributor[] {
    const url = this.repository.contributors_url;
    const params: nock.POJO = {};
    if (anon !== undefined) {
      params.anon = anon.toString();
    }
    const code = 200;
    const body = contributors.map(({ id, login }) => new Contributor(id, login));

    GitHubNock.get(url, params, persist).reply(code, body);
    return body;
  }

  private getContents<T>(path: string, contents: T, persist = true): T {
    const url = this.repository.contents_url.replace('{+path}', path);
    const params = {};
    const code = contents !== undefined ? 200 : 404;

    GitHubNock.get(url, params, persist).reply(code, contents);
    return contents;
  }

  private getPullsInternal(number?: number, state?: string, persist = true): nock.Interceptor {
    const url = this.repository.pulls_url.replace('{/number}', number !== undefined ? `/${number}` : '');
    const params: nock.POJO = {};
    if (state !== undefined) {
      params.state = state;
    }

    const interceptor = GitHubNock.get(url, params, persist);
    return interceptor;
  }

  getCommits(persist = true): nock.Interceptor {
    return GitHubNock.get(this.repository.commits_url.replace('{/sha}', ''), {}, persist);
  }

  getGitCommits(sha: string, persist = true): nock.Interceptor {
    return GitHubNock.get(this.repository.git_commits_url.replace('{/sha}', `/${sha}`), {}, persist);
  }

  getIssues(number?: number, page?: number, perPage?: number, persist = true): nock.Interceptor {
    const url = this.repository.issues_url.replace('{/number}', number !== undefined ? `/${number}` : '');
    const params: nock.POJO = {};
    if (page !== undefined) {
      params.page = page;
    }
    if (perPage !== undefined) {
      // eslint-disable-next-line @typescript-eslint/camelcase
      params.per_page = perPage;
    }

    return GitHubNock.get(url, params, persist);
  }

  getPull(number: number, persist = true): nock.Interceptor {
    return this.getPullsInternal(number, undefined, persist);
  }

  getRepo(suffix: string, persist = true): nock.Interceptor {
    return GitHubNock.get(this.repository.url + suffix, {}, persist);
  }

  private static get(url: string, params: nock.POJO, persist = true): nock.Interceptor {
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
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.full_name = `${this.owner.login}/${this.name}`;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.html_url = `${this.owner.html_url}/${this.name}`;
    this.url = `https://api.github.com/repos/${this.full_name}`;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.archive_url = `${this.url}/{archive_format}{/ref}`;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.assignees_url = `${this.url}/assignees{/user}`;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.blobs_url = `${this.url}/git/blobs{/sha}`;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.branches_url = `${this.url}/branches{/branch}`;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.collaborators_url = `${this.url}/collaborators{/collaborator}`;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.comments_url = `${this.url}/comments{/number}`;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.commits_url = `${this.url}/commits{/sha}`;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.compare_url = `${this.url}/compare/{base}...{head}`;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.contents_url = `${this.url}/contents/{+path}`;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.contributors_url = `${this.url}/contributors`;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.deployments_url = `${this.url}/deployments`;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.downloads_url = `${this.url}/downloads`;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.events_url = `${this.url}/events`;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.forks_url = `${this.url}/forks`;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.git_commits_url = `${this.url}/git/commits{/sha}`;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.git_refs_url = `${this.url}/git/refs{/sha}`;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.git_tags_url = `${this.url}/git/tags{/sha}`;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.git_url = `git:github.com/${this.full_name}.git`;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.issue_comment_url = `${this.url}/issues/comments{/number}`;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.issue_events_url = `${this.url}/issues/events{/number}`;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.issues_url = `${this.url}/issues{/number}`;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.keys_url = `${this.url}/keys{/key_id}`;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.labels_url = `${this.url}/labels{/name}`;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.languages_url = `${this.url}/languages`;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.merges_url = `${this.url}/merges`;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.milestones_url = `${this.url}/milestones{/number}`;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.notifications_url = `${this.url}/notifications{?since,all,participating}`;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.pulls_url = `${this.url}/pulls{/number}`;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.releases_url = `${this.url}/releases{/id}`;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.ssh_url = `git@github.com:${this.full_name}.git`;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.stargazers_url = `${this.url}/stargazers`;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.statuses_url = `${this.url}/statuses/{sha}`;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.subscribers_url = `${this.url}/subscribers`;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.subscription_url = `${this.url}/subscription`;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.tags_url = `${this.url}/tags`;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.teams_url = `${this.url}/teams`;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.trees_url = `${this.url}/git/trees{/sha}`;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.clone_url = `https://github.com/${this.full_name}.git`;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.mirror_url = `git:git.example.com/${this.full_name}`;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.hooks_url = `${this.url}/hooks`;
    // eslint-disable-next-line @typescript-eslint/camelcase
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
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.html_url = `${repository.html_url}/${gitType}/${ref}/${this.path}`;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.git_url = gitPattern.replace('{/sha}', `/${this.sha}`);
    // eslint-disable-next-line @typescript-eslint/camelcase
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

export class Symlink extends FileItem {
  type = 'symlink';
  target: string;

  constructor(repository: Repository, path: string, target: string, sha = '980a0d5f19a64b4b30a87d4206aade58726b60e3') {
    super(repository, path, sha);
    this.target = target;
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
  id: number;
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

  constructor(id: number, login: string) {
    this.login = login;
    this.id = id;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.avatar_url = `https://avatars3.githubusercontent.com/u/${this.id}`;
    this.url = `https://api.github.com/users/${this.login}`;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.html_url = `https://github.com/${this.login}`;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.followers_url = `${this.url}/followers`;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.following_url = `${this.url}/following{/other_user}`;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.gists_url = `${this.url}/gists{/gist_id}`;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.starred_url = `${this.url}/starred{/owner}{/repo}`;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.subscriptions_url = `${this.url}/subscriptions`;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.organizations_url = `${this.url}/orgs`;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.repos_url = `${this.url}/repos`;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.events_url = `${this.url}/events{/privacy}`;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.received_events_url = `${this.url}/received_events`;
  }
}

export class Contributor extends UserItem {
  contributions = 1;
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
  created_at = '2011-01-26T19:01:12Z';
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

  constructor(number: number, state: string, title: string, body: string, head: BranchItem, base: BranchItem) {
    this.number = number;
    this.base = base;
    this.head = head;
    this.url = this.base.repo.pulls_url.replace('{/number}', `/${this.number}`);
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.commits_url = `${this.url}/commits`;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.review_comments_url = `${this.url}/comments`;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.review_comment_url = `${this.base.repo.pulls_url.replace('{/number}', '')}/comments{/number}`;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.issue_url = this.base.repo.issues_url.replace('{/number}', `/${this.number}`);
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.comments_url = `${this.issue_url}/comments`;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.html_url = `${this.base.repo.html_url}/pull/${this.number}`;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.diff_url = `${this.html_url}.diff`;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.patch_url = `${this.html_url}.patch`;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.statuses_url = this.head.repo.statuses_url.replace('{sha}', this.head.ref);
    this.state = state;
    this.title = title;
    this.user = this.head.user;
    this.body = body;
    this._links = {
      self: { href: this.url },
      html: { href: this.html_url },
      issue: { href: this.issue_url },
      comments: { href: this.comments_url },
      // eslint-disable-next-line @typescript-eslint/camelcase
      review_comments: { href: this.review_comments_url },
      // eslint-disable-next-line @typescript-eslint/camelcase
      review_comment: { href: this.review_comment_url },
      commits: { href: this.commits_url },
      statuses: { href: this.statuses_url },
    };
  }
}
