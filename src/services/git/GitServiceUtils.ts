import gitUrlParse from 'git-url-parse';
import _ from 'lodash';
import { GitService } from './model';
import { ServiceType } from '../../detectors/IScanningStrategy';

export class GitServiceUtils {
  static getUrlToRepo = (url: string, path?: string | undefined, branch = 'master', serviceType?: ServiceType) => {
    const parsedUrl = gitUrlParse(url);

    let completeUrl = `${parsedUrl.protocol}://${parsedUrl.resource}/${parsedUrl.owner}/${parsedUrl.name}`;
    const sourceUrl = <GitService | null>parsedUrl.resource;

    if (path && sourceUrl) {
      completeUrl += GitServiceUtils.getPath(path, branch || parsedUrl.ref, serviceType, sourceUrl);
    }

    return completeUrl;
  };

  static parseUrl = (url: string): ParsedUrl => {
    const parsedUrl = gitUrlParse(url);

    return {
      owner: parsedUrl.owner,
      repoName: parsedUrl.name,
      host: parsedUrl.resource,
      protocol: parsedUrl.protocol,
    };
  };

  static getPath = (componentPath: string, branch = 'master', serviceType?: ServiceType, service?: GitService) => {
    if (serviceType) {
      switch (serviceType) {
        case ServiceType.github:
          return `/tree/${branch}${componentPath}`;
        case ServiceType.bitbucket:
          return `/src/${branch}${componentPath}`;
        case ServiceType.gitlab:
          return `/tree/${branch}${componentPath}`;

        default:
          return componentPath;
      }
    }

    switch (service) {
      case GitService.github:
        return `/tree/${branch}${componentPath}`;
      case GitService.bitbucket:
        return `/src/${branch}${componentPath}`;
      case GitService.gitlab:
        return `/tree/${branch}${componentPath}`;

      default:
        return componentPath;
    }
  };

  static getRepoName = (repositoryPath: string | undefined, path: string, serviceType?: ServiceType): string => {
    if (repositoryPath) {
      return GitServiceUtils.getPathOrRepoUrl(repositoryPath, path, 'master', serviceType);
    } else {
      return path;
    }
  };

  static getPathOrRepoUrl = (url: string, path?: string | undefined, branch = 'master', serviceType?: ServiceType) => {
    const parsedUrl = gitUrlParse(url);

    if (parsedUrl.protocol === 'file') {
      return url;
    }

    return GitServiceUtils.getUrlToRepo(url, path, branch, serviceType);
  };

  static getComponentPath = (
    path: string,
    basePath: string,
    isLocalScanning: boolean | undefined,
    repositoryPath?: string,
    serviceType?: ServiceType,
  ): string => {
    let componentPath, urlComponentPath;
    if (!isLocalScanning) {
      // get component path without tmp folder path
      componentPath = _.replace(path, basePath, '');

      // if it's root component, return repo path directly
      if (!componentPath) {
        return <string>repositoryPath;
      }

      // get path to component according to service type
      urlComponentPath = GitServiceUtils.getPath(componentPath || path, 'master', serviceType);
    }

    // if scanner is running remotely, concat repo path with component path, if not return local path directly
    return urlComponentPath ? (repositoryPath += urlComponentPath) : path;
  };
}

export interface ParsedUrl {
  owner: string;
  repoName: string;
  host: string;
  protocol: string;
}
