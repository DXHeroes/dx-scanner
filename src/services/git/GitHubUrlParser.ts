import gitUrlParse from 'git-url-parse';

export class GitHubUrlParser {
  static getOwnerAndRepoName(url: string): { owner: string; repoName: string } {
    const parsedUrl = gitUrlParse(url);

    return {
      owner: parsedUrl.owner,
      repoName: parsedUrl.name,
    };
  }
}
