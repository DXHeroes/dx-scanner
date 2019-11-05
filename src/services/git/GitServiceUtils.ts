import gitUrlParse from 'git-url-parse';
import { GitService } from './model';
import { assertNever } from '../../lib/assertNever';

export class GitServiceUtils {
  static getUrlToRepo = (url: string, path?: string | undefined, branch = 'master') => {
    const parsedUrl = gitUrlParse(url);

    let completeUrl = `${parsedUrl.protocol}://${parsedUrl.source}/${parsedUrl.owner}/${parsedUrl.name}`;
    const sourceUrl = <GitService | null>parsedUrl.source;

    if (path && sourceUrl) {
      completeUrl += GitServiceUtils.getPath(sourceUrl, path, branch || parsedUrl.ref);
    }

    return completeUrl;
  };

  static getOwnerAndRepoName = (url: string) => {
    const parsedUrl = gitUrlParse(url);

    return {
      owner: parsedUrl.owner,
      repoName: parsedUrl.name,
    };
  };

  static getPath = (service: GitService, path: string, branch = 'master') => {
    switch (service) {
      case GitService.github:
        return `/tree/${branch}${path}`;

      default:
        return assertNever(service);
    }
  };
}
