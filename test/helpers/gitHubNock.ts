import nock from 'nock';

export class GitHubNock {
  owner: string;
  repo: string;

  constructor(owner: string, repo: string) {
    this.owner = owner;
    this.repo = repo;
  }

  getRepo(suffix: string): nock.Interceptor {
    return nock('https://api.github.com')
      .persist()
      .get(`/repos/${this.owner}/${this.repo}${suffix}`);
  }
}
