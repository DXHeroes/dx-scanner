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

  private getContents<T>(path: string, contents: T): T {
    this.getRepo(`/contents/${path}`).reply(200, contents);
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

  constructor(owner: string, repo: string, path: string, sha = '980a0d5f19a64b4b30a87d4206aade58726b60e3') {
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
    this.html_url = `${htmlBase}/blob/${ref}/${this.path}`;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.git_url = `${apiBase}/git/blobs/${this.sha}`;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.download_url = `${downloadBase}/${ref}/${this.path}`;
    this._links = {
      self: this.url,
      git: this.git_url,
      html: this.html_url,
    };
  }
}

export class File extends RepoContent {
  type = 'file';
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

export class Symlink extends RepoContent {
  type = 'symlink';
  target: string;

  constructor(owner: string, repo: string, path: string, target: string, sha = '980a0d5f19a64b4b30a87d4206aade58726b60e3') {
    super(owner, repo, path, sha);
    this.target = target;
  }
}
