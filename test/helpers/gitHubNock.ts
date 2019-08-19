import nock from 'nock';
import * as nodePath from 'path';

export class GitHubNock {
  owner: string;
  repo: string;

  constructor(owner: string, repo: string) {
    this.owner = owner;
    this.repo = repo;
  }

  getFile(path: string, content = 'Hello World!\n', sha = '980a0d5f19a64b4b30a87d4206aade58726b60e3', persist = true): File {
    const body = new File(this.owner, this.repo, path, content, sha);
    return this.getContents(path, body, persist);
  }

  getSymlink(path: string, target: string, sha = '980a0d5f19a64b4b30a87d4206aade58726b60e3', persist = true): Symlink {
    const body = new Symlink(this.owner, this.repo, path, target, sha);
    return this.getContents(path, body, persist);
  }

  getDirectory(path: string, subfiles: string[], subdirs: string[], persist = true): (FileItem | DirectoryItem)[] {
    const body = [
      ...subfiles.map((name) => new FileItem(this.owner, this.repo, nodePath.posix.join(path, name))),
      ...subdirs.map((name) => new DirectoryItem(this.owner, this.repo, nodePath.posix.join(path, name))),
    ];
    return this.getContents(path, body, persist);
  }

  getNonexistentContents(path: string, persist = true): void {
    this.getContents(path, undefined, persist);
  }

  getContributors(contributors: { id: number; login: string }[], anon?: boolean, persist = true): Contributor[] {
    const body = contributors.map(({ id, login }) => new Contributor(id, login));
    const interceptor = this.getRepo(`/contributors`, persist);
    if (anon !== undefined) {
      interceptor.query({ anon: anon.toString() });
    }
    interceptor.reply(200, body);
    return body;
  }

  private getContents<T>(path: string, contents: T, persist = true): T {
    this.getRepo(`/contents/${path}`, persist).reply(contents !== undefined ? 200 : 404, contents);
    return contents;
  }

  getRepo(suffix: string, persist = true): nock.Interceptor {
    const interceptor = nock('https://api.github.com');
    if (persist) {
      interceptor.persist();
    }
    return interceptor.get(`/repos/${this.owner}/${this.repo}${suffix}`);
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
    owner: string,
    repo: string,
    path: string,
    gitType: string,
    downloadable: boolean,
    sha = '980a0d5f19a64b4b30a87d4206aade58726b60e3',
  ) {
    const ref = 'master';
    const apiBase = `https://api.github.com/repos/${owner}/${repo}`;
    const htmlBase = `https://github.com/${owner}/${repo}`;
    const downloadBase = `https://raw.githubusercontent.com/${owner}/${repo}`;

    this.name = nodePath.posix.basename(path);
    this.path = path;
    this.sha = sha;
    this.size = 0;
    this.url = `${apiBase}/contents/${this.path}?ref=${ref}`;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.html_url = `${htmlBase}/${gitType}/${ref}/${this.path}`;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.git_url = `${apiBase}/git/${gitType}s/${this.sha}`;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.download_url = downloadable ? `${downloadBase}/${ref}/${this.path}` : null;
    this._links = {
      self: this.url,
      git: this.git_url,
      html: this.html_url,
    };
  }
}

export class FileItem extends RepoContent {
  type = 'file';

  constructor(owner: string, repo: string, path: string, sha = '980a0d5f19a64b4b30a87d4206aade58726b60e3') {
    super(owner, repo, path, 'blob', true, sha);
  }
}

export class File extends FileItem {
  content: string;
  encoding: string;

  constructor(owner: string, repo: string, path: string, content = 'Hello World!\n', sha = '980a0d5f19a64b4b30a87d4206aade58726b60e3') {
    super(owner, repo, path, sha);

    const contentBuffer = Buffer.from(content);
    this.size = contentBuffer.length;
    this.encoding = 'base64';
    this.content = contentBuffer.toString(this.encoding);
  }
}

export class Symlink extends FileItem {
  type = 'symlink';
  target: string;

  constructor(owner: string, repo: string, path: string, target: string, sha = '980a0d5f19a64b4b30a87d4206aade58726b60e3') {
    super(owner, repo, path, sha);
    this.target = target;
  }
}

export class DirectoryItem extends RepoContent {
  type = 'dir';

  constructor(owner: string, repo: string, path: string, sha = '980a0d5f19a64b4b30a87d4206aade58726b60e3') {
    super(owner, repo, path, 'tree', false, sha);
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
