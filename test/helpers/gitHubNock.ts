import nock from 'nock';
import * as nodePath from 'path';

export class GitHubNock {
  owner: string;
  repo: string;

  constructor(owner: string, repo: string) {
    this.owner = owner;
    this.repo = repo;
  }

  getFile(path: string, content = 'Hello World!\n', sha = '980a0d5f19a64b4b30a87d4206aade58726b60e3'): File {
    const body = new File(this.owner, this.repo, path, content, sha);
    return this.getContents(path, body);
  }

  getSymlink(path: string, target: string, sha = '980a0d5f19a64b4b30a87d4206aade58726b60e3'): Symlink {
    const body = new Symlink(this.owner, this.repo, path, target, sha);
    return this.getContents(path, body);
  }

  getDirectory(path: string, subfiles: string[], subdirs: string[]): (FileItem | DirectoryItem)[] {
    const body = [
      ...subfiles.map((name) => new FileItem(this.owner, this.repo, nodePath.posix.join(path, name))),
      ...subdirs.map((name) => new DirectoryItem(this.owner, this.repo, nodePath.posix.join(path, name))),
    ];
    return this.getContents(path, body);
  }

  getNonexistentContents(path: string): void {
    this.getContents(path, undefined);
  }

  private getContents<T>(path: string, contents: T): T {
    this.getRepo(`/contents/${path}`).reply(contents !== undefined ? 200 : 404, contents);
    return contents;
  }

  getRepo(suffix: string): nock.Interceptor {
    return nock('https://api.github.com')
      .persist()
      .get(`/repos/${this.owner}/${this.repo}${suffix}`);
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
