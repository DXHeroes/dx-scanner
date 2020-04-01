import gitUrlParse from 'git-url-parse';
import _ from 'lodash';
import { ServiceType } from '../../detectors/IScanningStrategy';
import { assertNever } from '../../lib/assertNever';
import { ProjectComponent } from '../../model';
import { RepositoryConfig } from '../../scanner/RepositoryConfig';
import { ScanningStrategy } from '../../detectors';

export class GitServiceUtils {
  static getUrlToRepo = (url: string, path?: string | undefined, branch = 'master') => {
    const parsedUrl = gitUrlParse(url);

    let completeUrl = `${parsedUrl.protocol}://${parsedUrl.resource}/${parsedUrl.owner}/${parsedUrl.name}`;
    const sourceUrl = <ServiceType | null>parsedUrl.resource;

    if (path && sourceUrl) {
      completeUrl += GitServiceUtils.getPath(path, branch || parsedUrl.ref, sourceUrl);
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

  static getPath = (componentPath: string, branch = 'master', serviceType?: ServiceType) => {
    if (serviceType) {
      switch (serviceType) {
        case ServiceType.github:
          return `/tree/${branch}${componentPath}`;
        case ServiceType.bitbucket:
          return `/src/${branch}${componentPath}`;
        case ServiceType.gitlab:
          return `/tree/${branch}${componentPath}`;
        case ServiceType.local:
          return `${componentPath}`;
        case ServiceType.git:
          return `${branch}${componentPath}`;

        default:
          return assertNever(serviceType);
      }
    }
  };

  static getRepoName = (repositoryPath: string | undefined, path: string): string => {
    if (repositoryPath) {
      const parsedUrl = gitUrlParse(repositoryPath);
      return `${parsedUrl.protocol}://${parsedUrl.resource}/${parsedUrl.owner}/${parsedUrl.name}`;
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

  static getComponentPath = (component: ProjectComponent, scanningStrategy: ScanningStrategy): string => {
    let componentPath, urlComponentPath, repoPath;

    if (scanningStrategy.isOnline) {
      // get component path without tmp folder path
      componentPath = _.replace(component.path, <string>scanningStrategy.localPath, '');

      // if it's root component, return repo path directly
      if (!componentPath) {
        return <string>component.repositoryPath;
      }
      const parsedUrl = gitUrlParse(<string>component.repositoryPath);
      repoPath = `${parsedUrl.protocol}://${parsedUrl.resource}/${parsedUrl.full_name}`;

      // get path to component according to service type
      urlComponentPath = GitServiceUtils.getPath(componentPath || component.path, 'master', scanningStrategy.serviceType);
    }

    repoPath = repoPath || component.repositoryPath;

    // if scanner is running remotely, concat repo path with component path, if not return local path directly
    return urlComponentPath ? (repoPath += urlComponentPath) : component.path;
  };
}

export interface ParsedUrl {
  owner: string;
  repoName: string;
  host: string;
  protocol: string;
}
