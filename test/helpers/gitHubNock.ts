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
    this.getRepo(`/contents/${path}`).reply(200, body);
    return body;
  }

  getRepo(suffix: string): nock.Interceptor {
    return nock('https://api.github.com')
      .persist()
      .get(`/repos/${this.owner}/${this.repo}${suffix}`);
  }
}

export class File {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string | null;
  type = 'file';
  content: string;
  encoding: string;
  _links: { self: string; git: string; html: string };

  constructor(owner: string, repo: string, path: string, content = 'Hello World!\n', sha = '980a0d5f19a64b4b30a87d4206aade58726b60e3') {
    const ref = 'master';
    const apiBase = `https://api.github.com/repos/${owner}/${repo}`;
    const htmlBase = `https://github.com/${owner}/${repo}`;
    const downloadBase = `https://raw.githubusercontent.com/${owner}/${repo}`;
    const contentBuffer = Buffer.from(content);

    this.name = nodePath.posix.basename(path);
    this.path = path;
    this.sha = sha;
    this.size = contentBuffer.length;
    this.url = `${apiBase}/contents/${this.path}?ref=${ref}`;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.html_url = `${htmlBase}/blob/${ref}/${this.path}`;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.git_url = `${apiBase}/git/blobs/${this.sha}`;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.download_url = `${downloadBase}/${ref}/${this.path}`;
    this.encoding = 'base64';
    this.content = contentBuffer.toString(this.encoding);
    this._links = {
      self: this.url,
      git: this.git_url,
      html: this.html_url,
    };
  }
}
