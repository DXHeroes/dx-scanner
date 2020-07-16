import gitUrlParse from 'git-url-parse';
import _, { replace } from 'lodash';
import nodePath from 'path';
import { ScanningStrategy } from '../../detectors';
import { ServiceType } from '../../detectors/IScanningStrategy';
import { assertNever } from '../../lib/assertNever';
import { ProjectComponent } from '../../model';

export class GitServiceUtils {
  static getUrlToRepo = (url: string, scanningStrategy: ScanningStrategy, path?: string | undefined, branch = 'master') => {
    const parsedUrl = gitUrlParse(url);

    let completeUrl = `https://${parsedUrl.resource}/${parsedUrl.owner}/${parsedUrl.name}`;

    if (path) {
      const relPath = replace(path, scanningStrategy.rootPath || '', '');
      completeUrl += GitServiceUtils.getPath(relPath, branch || parsedUrl.ref, scanningStrategy.serviceType!);
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

  static getPath = (componentPath: string, branch = 'master', serviceType: ServiceType) => {
    const resPath = (): string => {
      switch (serviceType) {
        case ServiceType.github:
          return `/tree/${branch}/${componentPath}`;
        case ServiceType.bitbucket:
          return `/src/${branch}/${componentPath}`;
        case ServiceType.gitlab:
          return `/tree/${branch}/${componentPath}`;
        case ServiceType.local:
          return componentPath;
        case ServiceType.git:
          return `${branch}/${componentPath}`;

        default:
          return assertNever(serviceType);
      }
    };
    return nodePath.normalize(resPath());
  };

  static getRepoName = (repositoryPath: string | undefined, path: string): string => {
    if (repositoryPath) {
      const parsedUrl = gitUrlParse(repositoryPath);
      return `${parsedUrl.protocol}://${parsedUrl.resource}/${parsedUrl.owner}/${parsedUrl.name}`;
    } else {
      return path;
    }
  };

  static getPathOrRepoUrl = (url: string, scanningStrategy: ScanningStrategy, path?: string | undefined, branch = 'master') => {
    const parsedUrl = gitUrlParse(url);

    if (parsedUrl.protocol === 'file') {
      return url;
    }

    return GitServiceUtils.getUrlToRepo(url, scanningStrategy, path, branch);
  };

  static getComponentPath = (component: ProjectComponent, scanningStrategy: ScanningStrategy): string => {
    let componentPath, urlComponentPath, repoPath;

    if (scanningStrategy.isOnline) {
      // get component path without tmp folder path
      componentPath = _.replace(component.path, <string>scanningStrategy.localPath, '');

      // if it's root component, return repo path directly
      const parsedUrl = gitUrlParse(<string>component.repositoryPath);
      repoPath = `${parsedUrl.protocol}://${parsedUrl.resource}/${parsedUrl.full_name}`;

      if (!componentPath) {
        return repoPath;
      }

      // get path to component according to service type
      urlComponentPath = GitServiceUtils.getPath(componentPath || component.path, 'master', <ServiceType>scanningStrategy.serviceType);
    }

    repoPath = repoPath || component.repositoryPath;

    // if scanner is running remotely, concat repo path with component path, if not return local path directly
    return urlComponentPath ? (repoPath += urlComponentPath) : component.path;
  };

  static getComponentLocalPath = (component: ProjectComponent, scanningStrategy: ScanningStrategy): string => {
    const cwp = _.replace(component.path, <string>scanningStrategy.localPath, '');
    return nodePath.basename(cwp);
  };

  static getComponentName = (component: ProjectComponent, scanningStrategy: ScanningStrategy) => {
    let componentPath;
    if (scanningStrategy.isOnline) {
      // get component path without tmp folder path
      componentPath = _.replace(component.path, <string>scanningStrategy.localPath, '');

      // if it's root component, return repo path directly
      const parsedUrl = gitUrlParse(<string>component.repositoryPath);
      if (!componentPath) {
        return parsedUrl.full_name;
      }
    }

    return componentPath || component.path;
  };
}

export interface ParsedUrl {
  owner: string;
  repoName: string;
  host: string;
  protocol: string;
}
