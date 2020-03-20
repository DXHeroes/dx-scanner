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
import { RepositoryConfig } from '../contexts/discovery/RepositoryConfig';
import { DiscoveryContext } from '../contexts/discovery/DiscoveryContext';

@injectable()
export class ScanningStrategyDetector implements IDetector<string, ScanningStrategy> {
  // private gitHubService: GitHubService;
  // private bitbucketService: BitbucketService;
  // private gitLabService: GitLabService;
  private readonly argumentsProvider: ArgumentsProvider;
  private readonly repositoryConfig: RepositoryConfig;
  private readonly d: debug.Debugger;
  private isOnline = false;

  constructor(
    // @inject(GitHubService) gitHubService: GitHubService,
    // @inject(BitbucketService) bitbucketService: BitbucketService,
    // @inject(GitLabService) gitLabService: GitLabService,
    @inject(Types.ArgumentsProvider) argumentsProvider: ArgumentsProvider,
    @inject(Types.RepositoryConfig) repositoryConfig: RepositoryConfig,
  ) {
    // this.gitHubService = gitHubService;
    // this.bitbucketService = bitbucketService;
    // this.gitLabService = gitLabService;
    this.argumentsProvider = argumentsProvider;
    this.repositoryConfig = repositoryConfig;
    this.d = debug('scanningStrategyDetector');
  }

  async detect(): Promise<ScanningStrategy> {
    let serviceType: ServiceType | undefined;
    // let remoteService: RemoteService;
    let accessType: AccessType | undefined = undefined;
    let remoteUrl: RemoteUrl = undefined;
    const path = await ScanningStrategyDetectorUtils.normalizePath(this.argumentsProvider.uri); //

    // try to determine remote origin if input is local file system
    if (this.repositoryConfig.inputType === ServiceType.local) {
      if (this.repositoryConfig.remoteService.remoteUrl) {
        this.isOnline = true;
        accessType = this.repositoryConfig.accessType;
      }
    } else {
      serviceType = this.repositoryConfig.inputType;
      remoteUrl = path;
      accessType = this.repositoryConfig.accessType;
      this.isOnline = true;
    }

    return {
      serviceType,
      accessType,
      remoteUrl: remoteUrl,
      localPath: this.repositoryConfig.inputType === ServiceType.local ? path : undefined,
      isOnline: this.isOnline,
    };
  }

  // private determineInputType = async (path: string): Promise<ServiceType | undefined> => {
  //   if (ScanningStrategyDetectorUtils.isGitHubPath(path)) return ServiceType.github;
  //   if (await ScanningStrategyDetectorUtils.isLocalPath(path)) return ServiceType.local;
  //   if (ScanningStrategyDetectorUtils.isBitbucketPath(path)) return ServiceType.bitbucket;
  //   if (await ScanningStrategyDetectorUtils.isGitLabPath(path, this.argumentsProvider.auth)) return ServiceType.gitlab;

  //   // return undefined if we don't know yet the service type
  //   //  (e.g. because of missing credentials for Gitlab)
  //   if ((await ScanningStrategyDetectorUtils.isGitLabPath(path, this.argumentsProvider.auth)) === undefined) return undefined;

  //   throw ErrorFactory.newInternalError(
  //     `Unable to detect scanning strategy. It seems that the service is not implemented yet. (Input path: ${path})`,
  //   );
  // };

  // private determineRemoteAccessType = async (remoteService: RemoteService): Promise<AccessType | undefined> => {
  //   if (!remoteService.remoteUrl) return undefined;

  //   if (remoteService.serviceType === ServiceType.github) {
  //     const { owner, repoName } = GitServiceUtils.parseUrl(remoteService.remoteUrl);

  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //     let response: any;
  //     try {
  //       response = await this.gitHubService.getRepo(owner, repoName);
  //     } catch (error) {
  //       this.d(error.message);
  //       if (error.status === 401 || error.status === 404 || error.status === 403) {
  //         return AccessType.unknown;
  //       }
  //       if (error.status === 500) {
  //         this.isOnline = false;
  //         return AccessType.unknown;
  //       }
  //       throw error;
  //     }

  //     if (response.status === 200) {
  //       if (response.data.private === true) {
  //         return AccessType.private;
  //       }
  //       return AccessType.public;
  //     }
  //   } else if (remoteService.serviceType === ServiceType.bitbucket) {
  //     const { owner, repoName } = GitServiceUtils.parseUrl(remoteService.remoteUrl);

  //     try {
  //       const response = await this.bitbucketService.getRepo(owner, repoName);
  //       if (response.data.is_private === true) {
  //         return AccessType.private;
  //       }
  //       return AccessType.public;
  //     } catch (error) {
  //       this.d(error.message);
  //       if (error.code === 401 || error.code === 404 || error.code === 403) {
  //         return AccessType.unknown;
  //       }
  //       if (error.status === 500) {
  //         this.isOnline = false;
  //         return AccessType.unknown;
  //       }
  //       throw error;
  //     }
  //   } else if (remoteService.serviceType === ServiceType.gitlab) {
  //     const { owner, repoName, host } = GitServiceUtils.parseUrl(remoteService.remoteUrl);
  //     this.gitLabService.setClient(host, this.argumentsProvider.auth);

  //     try {
  //       const { data } = await this.gitLabService.getRepo(owner, repoName);
  //       if (data.visibility === AccessType.private) {
  //         return AccessType.private;
  //       }
  //       if (data.visibility === AccessType.public || (data && !data.visibility)) {
  //         return AccessType.public;
  //       }
  //       if (!data) {
  //         return AccessType.unknown;
  //       }
  //     } catch (error) {
  //       this.d(error.message);
  //       if (
  //         error.response.status === 401 ||
  //         error.response.status === 404 ||
  //         error.response.status === 403 ||
  //         error.response.status === 500
  //       ) {
  //         if (error.response.status === 500) {
  //           this.isOnline = false;
  //         }
  //         return AccessType.unknown;
  //       }
  //       throw error;
  //     }
  //   }

  //   return undefined;
  // };

  // private determineRemote = async (path: string): Promise<RemoteService> => {
  //   let remoteService: RemoteService;
  //   console.log(path, 'path');
  //   const gitRepository = git(path);

  //   // Doesn't use a git? => local
  //   const isRepository = await gitRepository.checkIsRepo();
  //   if (!isRepository) {
  //     return { serviceType: ServiceType.local, remoteUrl: undefined };
  //   }

  //   // Uses git? Then determine remote type & url.
  //   const remotes = await gitRepository.getRemotes(true);
  //   if (remotes.length === 0) {
  //     return { serviceType: ServiceType.git, remoteUrl: undefined };
  //   }

  //   // Read all remotes
  //   const originRemote = remotes.find((r) => r.name === 'origin');
  //   const remote = originRemote || remotes[0];

  //   if (ScanningStrategyDetectorUtils.isGitHubPath(remote.refs.fetch)) {
  //     remoteService = { serviceType: ServiceType.github, remoteUrl: remote.refs.fetch };
  //   } else if (ScanningStrategyDetectorUtils.isBitbucketPath(remote.refs.fetch)) {
  //     remoteService = { serviceType: ServiceType.git, remoteUrl: remote.refs.fetch };
  //   } else {
  //     remoteService = { serviceType: ServiceType.gitlab, remoteUrl: remote.refs.fetch };
  //   }
  //   this.d(remoteService);
  //   return remoteService;
  // };
}

export interface ScanningStrategy {
  serviceType: ServiceType | undefined;
  accessType: AccessType | undefined;
  remoteUrl: RemoteUrl;
  localPath: string | undefined;
  isOnline: boolean;
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
  serviceType: ServiceType | undefined;
  remoteUrl: RemoteUrl;
}

export type RemoteUrl = string | undefined;

export interface ScanningStrategyParams {
  path: string;
}
