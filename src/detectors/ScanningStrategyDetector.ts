import { inject, injectable } from 'inversify';
import git from 'simple-git/promise';
import debug from 'debug';
import { IDetector } from './IDetector';
import { GitHubService, BitbucketService, GitServiceUtils } from '../services';
import { Types } from '../types';
import { ErrorFactory } from '../lib/errors';
import { ArgumentsProvider } from '../scanner';
import { ScanningStrategyDetectorUtils } from './utils/ScanningStrategyDetectorUtils';
import { GitLabService } from '../services/gitlab/GitLabService';

@injectable()
export class ScanningStrategyDetector implements IDetector<string, ScanningStrategy> {
  private gitHubService: GitHubService;
  private bitbucketService: BitbucketService;
  private gitLabService: GitLabService;
  private readonly argumentsProvider: ArgumentsProvider;
  private readonly detectorDebug: debug.Debugger;

  constructor(
    @inject(GitHubService) gitHubService: GitHubService,
    @inject(BitbucketService) bitbucketService: BitbucketService,
    @inject(GitLabService) gitLabService: GitLabService,
    @inject(Types.ArgumentsProvider) argumentsProvider: ArgumentsProvider,
  ) {
    this.gitHubService = gitHubService;
    this.bitbucketService = bitbucketService;
    this.gitLabService = gitLabService;
    this.argumentsProvider = argumentsProvider;
    this.detectorDebug = debug('scanningStrategyDetector');
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
    if (ScanningStrategyDetectorUtils.isGitHubPath(path)) return ServiceType.github;
    if (ScanningStrategyDetectorUtils.isLocalPath(path)) return ServiceType.local;
    if (ScanningStrategyDetectorUtils.isBitbucketPath(path)) return ServiceType.bitbucket;
    if (ScanningStrategyDetectorUtils.isGitLabPath(path)) return ServiceType.gitlab;

    throw ErrorFactory.newInternalError('Unable to detect scanning strategy');
  };

  private determineRemoteAccessType = async (remoteService: RemoteService): Promise<AccessType | undefined> => {
    if (!remoteService.remoteUrl) {
      return undefined;
    }

    if (remoteService.serviceType === ServiceType.github) {
      const { owner, repoName } = GitServiceUtils.getOwnerAndRepoName(remoteService.remoteUrl);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let response: any;
      try {
        response = await this.gitHubService.getRepo(owner, repoName);
      } catch (error) {
        this.detectorDebug(error.message);
        if (error.status === 401 || error.status === 404 || error.status === 403) {
          return AccessType.unknown;
        }
        throw error;
      }

      if (response.status === 200) {
        if (response.data.private === true) {
          return AccessType.private;
        }
        return AccessType.public;
      }
    } else if (remoteService.serviceType === ServiceType.bitbucket) {
      const { owner, repoName } = GitServiceUtils.getOwnerAndRepoName(remoteService.remoteUrl);

      try {
        const response = await this.bitbucketService.getRepo(owner, repoName);
        if (response.data.is_private === true) {
          return AccessType.private;
        }
        return AccessType.public;
      } catch (error) {
        this.detectorDebug(error.message);
        if (error.code === 401 || error.code === 404 || error.code === 403) {
          return AccessType.unknown;
        }
        throw error;
      }
    } else if (remoteService.serviceType === ServiceType.gitlab) {
      const { owner, repoName } = GitServiceUtils.parseGitlabUrl(remoteService.remoteUrl);

      try {
        const response = await this.gitLabService.getRepo(owner, repoName);
        if (response.visibility === AccessType.private) {
          return AccessType.private;
        }
        if (response.visibility === AccessType.public || (response && !response.visibility)) {
          return AccessType.public;
        }
        if (!response) {
          return AccessType.unknown;
        }
      } catch (error) {
        this.detectorDebug(error.message);
        if (error.code === 401 || error.code === 404 || error.code === 403) {
          return AccessType.unknown;
        }
        throw error;
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
    } else if (ScanningStrategyDetectorUtils.isBitbucketPath(remote.refs.fetch)) {
      remoteService = { serviceType: ServiceType.git, remoteUrl: remote.refs.fetch };
    } else {
      remoteService = { serviceType: ServiceType.gitlab, remoteUrl: remote.refs.fetch };
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
  gitlab = 'gitlab',
  git = 'git',
  local = 'local',
}

export enum AccessType {
  private = 'private',
  public = 'public',
  unknown = 'unknown',
}

export interface RemoteService {
  serviceType: ServiceType;
  remoteUrl: RemoteUrl;
}

export type RemoteUrl = string | undefined;

export interface ScanningStrategyParams {
  path: string;
}
