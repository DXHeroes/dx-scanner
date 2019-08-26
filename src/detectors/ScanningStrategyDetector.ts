import { IDetector } from './IDetector';
import git from 'simple-git/promise';
import { ScanningStrategyDetectorUtils } from './utils/ScanningStrategyDetectorUtils';
import gitUrlParse from 'git-url-parse';
import { GitHubClient } from '../services/git/GitHubClient';
import { injectable, inject } from 'inversify';
import { ErrorFactory } from '../lib/errors';
import { Types } from '../types';
import { ArgumentsProvider } from '../inversify.config';

@injectable()
export class ScanningStrategyDetector implements IDetector<string, ScanningStrategy> {
  private gitHubClient: GitHubClient;
  private readonly argumentsProvider: ArgumentsProvider;

  constructor(@inject(GitHubClient) gitHubClient: GitHubClient, @inject(Types.ArgumentsProvider) argumentsProvider: ArgumentsProvider) {
    this.gitHubClient = gitHubClient;
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

    if (accessType === AccessType.private && this.argumentsProvider.auth === undefined) {
      throw new Error('AT was not provided');
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
        response = await this.gitHubClient.get(parsedUrl.owner, parsedUrl.name);
      } catch (error) {
        if (error.status && error.status === 404) {
          return AccessType.private;
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
