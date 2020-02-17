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
      case GitService.bitbucket:
        return `/src/${branch}${path}`;
      //TODO gitlab
      case GitService.gitlab:
        return `/tree/${branch}${path}`;
      // return `/tree/${branch}${path}`
      // GitService gitlab.com what about host?

      default:
        return assertNever(service);
    }
  };

  static getRepoName = (repositoryPath: string | undefined, path: string): string => {
    if (repositoryPath) {
      return GitServiceUtils.getPathOrRepoUrl(repositoryPath);
    } else {
      return path;
    }
  };

  static getPathOrRepoUrl = (url: string, path?: string | undefined, branch = 'master') => {
    const parsedUrl = gitUrlParse(url);

    if (parsedUrl.protocol === 'file') {
      return url;
    }

    return GitServiceUtils.getUrlToRepo(url, path, branch);
  };

  static parseGitlabUrl = (url: string) => {
    const parsedUrl = gitUrlParse(url);
    if (parsedUrl.resource === 'gitlab.com') {
      return {
        owner: parsedUrl.owner,
        repoName: parsedUrl.name,
      };
    }

    return {
      owner: parsedUrl.owner,
      repoName: parsedUrl.name,
      host: parsedUrl.resource,
    };
  };
}
