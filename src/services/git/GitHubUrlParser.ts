import { ErrorFactory } from '../../lib/errors/ErrorFactory';

/* eslint-disable @typescript-eslint/explicit-member-accessibility */

export class GitHubUrlParser {
  public static getOwnerAndRepoName(url: string): { owner: string; repoName: string } {
    url = url.replace('http://', '');
    url = url.replace('https://', '');
    const urlTokens = url.split('/');
    if (urlTokens.length !== 3) {
      throw ErrorFactory.newInternalError(`Malformed github url: ${url}`);
    }
    const repoName = urlTokens[2].endsWith('.git') ? urlTokens[2].replace('.git', '') : urlTokens[2];
    return {
      owner: urlTokens[1],
      repoName,
    };
  }
}
