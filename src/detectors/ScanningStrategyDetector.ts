import { IDetector } from './IDetector';
import git from 'simple-git/promise';
import { ScanningStrategyDetectorUtils } from './utils/ScanningStrategyDetectorUtils';
import gitUrlParse from 'git-url-parse';
import { injectable, inject } from 'inversify';
import { ErrorFactory } from '../lib/errors';
import { Types } from '../types';
import { ArgumentsProvider } from '../inversify.config';
import { GitHubService } from '../services/git/GitHubService';
import { BitbucketService } from '../services/bitbucket/BitbucketService';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const parseBitbucketUrl = require('parse-bitbucket-url');

@injectable()
export class ScanningStrategyDetector implements IDetector<string, ScanningStrategy> {
  private gitHubService: GitHubService;
  private bitbucketService: BitbucketService;
  private readonly argumentsProvider: ArgumentsProvider;

  constructor(
    @inject(GitHubService) gitHubService: GitHubService,
    @inject(BitbucketService) bitbucketService: BitbucketService,
    @inject(Types.ArgumentsProvider) argumentsProvider: ArgumentsProvider,
  ) {
    this.gitHubService = gitHubService;
    this.bitbucketService = bitbucketService;
    this.argumentsProvider = argumentsProvider;
  }

  async detect() {
    let serviceType: ServiceType;
    let remoteService: RemoteService;
    let accessType: AccessType | undefined = undefined;
    let remoteUrl: RemoteUrl = undefined;
    const path = ScanningStrategyDetectorUtils.normalizePath(this.argumentsProvider.uri);

    const inputType = this.determineInputType(path);

    // try to determine remote origin if input is local file system
    if (inputType === ServiceType.local) {
      remoteService = await this.determineRemote(path);
      serviceType = remoteService.serviceType;
      remoteUrl = remoteService.remoteUrl;

      if (remoteService.remoteUrl) {
        accessType = await this.determineRemoteAccessType(remoteService);
      }
    } else {
      serviceType = inputType;
      remoteUrl = path;
      accessType = await this.determineRemoteAccessType({ remoteUrl: path, serviceType });
    }

    return {
      serviceType,
      accessType,
      remoteUrl: remoteUrl,
      localPath: inputType === ServiceType.local ? path : undefined,
    };
  }

  private determineInputType = (path: string): ServiceType => {
    if (ScanningStrategyDetectorUtils.isGitHubPath(path)) {
      return ServiceType.github;
    }

    if (ScanningStrategyDetectorUtils.isLocalPath(path)) {
      return ServiceType.local;
    }

    if (ScanningStrategyDetectorUtils.isBitbucketPath(path)) {
      return ServiceType.bitbucket;
    }

    throw ErrorFactory.newInternalError('Unable to detect scanning strategy');
  };

  private determineRemoteAccessType = async (remoteService: RemoteService): Promise<AccessType | undefined> => {
    if (!remoteService.remoteUrl) {
      return undefined;
    }

    if (remoteService.serviceType === ServiceType.github) {
      const parsedUrl = gitUrlParse(remoteService.remoteUrl);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let response: any;
      try {
        response = await this.gitHubService.getRepo(parsedUrl.owner, parsedUrl.name);
      } catch (error) {
        if (error.status === 401 || error.status === 404 || error.status === 403) {
          throw ErrorFactory.newArgumentError('You passed bad credentials or non existing repo.');
        }
        throw error;
      }

      if (response.status === 200) {
        if (response.data.private === true) {
          return AccessType.private;
        }
        return AccessType.public;
      }
    }

    //TODO
    if (remoteService.serviceType === ServiceType.bitbucket) {
      const parsedUrl = parseBitbucketUrl(remoteService.remoteUrl);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let response: any;
      try {
        response = await this.bitbucketService.getRepo(parsedUrl.owner, parsedUrl.name);
      } catch (error) {
        if (error.status === 401 || error.status === 404 || error.status === 403) {
          throw ErrorFactory.newArgumentError('You passed bad credentials or non existing repo.');
        }
      }
      // if (response.status === 200) {
      //   if (response.data.private === true) {
      //     return AccessType.private;
      //   }
      //   return AccessType.public;
      // }
    }

    return undefined;
  };

  private determineRemote = async (path: string): Promise<RemoteService> => {
    let remoteService: RemoteService;

    const gitRepository = git(path);

    // Doesn't use a git? => local
    const isRepository = await gitRepository.checkIsRepo();
    if (!isRepository) {
      return { serviceType: ServiceType.local, remoteUrl: undefined };
    }

    // Uses git? Then determine remote type & url.
    const remotes = await gitRepository.getRemotes(true);
    if (remotes.length === 0) {
      return { serviceType: ServiceType.git, remoteUrl: undefined };
    }

    // Read all remotes
    const originRemote = remotes.find((r) => r.name === 'origin');
    const remote = originRemote || remotes[0];

    if (ScanningStrategyDetectorUtils.isGitHubPath(remote.refs.fetch)) {
      remoteService = { serviceType: ServiceType.github, remoteUrl: remote.refs.fetch };
    } else {
      remoteService = { serviceType: ServiceType.git, remoteUrl: remote.refs.fetch };
    }

    return remoteService;
  };
}

export interface ScanningStrategy {
  serviceType: ServiceType;
  accessType: AccessType | undefined;
  remoteUrl: RemoteUrl;
  localPath: string | undefined;
}

export enum ServiceType {
  github = 'github',
  bitbucket = 'bitbucket',
  git = 'git',
  local = 'local',
}

export enum AccessType {
  private = 'private',
  public = 'public',
}

export interface RemoteService {
  serviceType: ServiceType;
  remoteUrl: RemoteUrl;
}

export type RemoteUrl = string | undefined;

export interface ScanningStrategyParams {
  path: string;
}
