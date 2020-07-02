import debug from 'debug';
import { inject, injectable } from 'inversify';
import { has } from 'lodash';
import { ArgumentsProvider } from '../scanner';
import { RepositoryConfig } from '../scanner/RepositoryConfig';
import { BitbucketService, GitHubService, GitServiceUtils } from '../services';
import { GitLabService } from '../services/gitlab/GitLabService';
import { Types } from '../types';
import { IDetector } from './IDetector';
import { ScanningStrategyDetectorUtils } from './utils/ScanningStrategyDetectorUtils';
import { ErrorFactory } from '../lib/errors';
import { AccessType, ServiceType } from './IScanningStrategy';
import git from 'simple-git/promise';

@injectable()
export class ScanningStrategyDetector implements IDetector<string, ScanningStrategy> {
  private gitHubService: GitHubService;
  private bitbucketService: BitbucketService;
  private gitLabService: GitLabService;
  private readonly argumentsProvider: ArgumentsProvider;
  private readonly repositoryConfig: RepositoryConfig;
  private readonly d: debug.Debugger;
  private isOnline = false;

  constructor(
    @inject(GitHubService) gitHubService: GitHubService,
    @inject(BitbucketService) bitbucketService: BitbucketService,
    @inject(GitLabService) gitLabService: GitLabService,
    @inject(Types.ArgumentsProvider) argumentsProvider: ArgumentsProvider,
    @inject(Types.RepositoryConfig) repositoryConfig: RepositoryConfig,
  ) {
    this.gitHubService = gitHubService;
    this.bitbucketService = bitbucketService;
    this.gitLabService = gitLabService;
    this.argumentsProvider = argumentsProvider;
    this.repositoryConfig = repositoryConfig;
    this.d = debug('scanningStrategyDetector');
  }

  async detect(): Promise<ScanningStrategy> {
    let accessType: AccessType | undefined;
    let remoteUrl: RemoteUrl;
    let rootPath: string | undefined;
    let localPath: string | undefined;

    const path = ScanningStrategyDetectorUtils.normalizePath(this.argumentsProvider.uri);

    const serviceType = await this.determineInputType(this.repositoryConfig.remoteUrl || path);
    this.d('serviceType', serviceType);

    // try to determine remote origin if input is local file system
    if (serviceType === ServiceType.local) {
      remoteUrl = this.repositoryConfig.remoteUrl;

      if (remoteUrl) {
        accessType = await this.determineRemoteAccessType({ remoteUrl: path, serviceType });
      }
    } else {
      accessType = await this.determineRemoteAccessType({ remoteUrl: this.repositoryConfig.remoteUrl, serviceType });
    }

    if (ScanningStrategyDetectorUtils.isLocalPath(path)) {
      rootPath = path;
      localPath = path;

      if (await git(path).checkIsRepo()) {
        rootPath = await git(path).revparse(['--show-toplevel']);
      }
    }

    return {
      serviceType,
      accessType,
      remoteUrl: this.repositoryConfig.remoteUrl,
      localPath,
      rootPath,
      isOnline: this.isOnline,
    };
  }

  private determineInputType = async (path: string): Promise<ServiceType | undefined> => {
    if (ScanningStrategyDetectorUtils.isGitHubPath(path)) return ServiceType.github;
    if (ScanningStrategyDetectorUtils.isBitbucketPath(path)) return ServiceType.bitbucket;
    if (ScanningStrategyDetectorUtils.isGitLabPath(path)) return ServiceType.gitlab;

    if (ScanningStrategyDetectorUtils.isLocalPath(path)) return ServiceType.local;

    // Try to determine gitLab service type if it's self-hosted
    const remotelyDetectedService = await this.determineGitLabRemoteServiceType();
    if (remotelyDetectedService) return remotelyDetectedService;

    throw ErrorFactory.newInternalError(
      `Unable to detect scanning strategy. It seems that the service is not implemented yet. (Input path: ${path})`,
    );
  };

  private determineRemoteAccessType = async (remoteService: RemoteService): Promise<AccessType | undefined> => {
    if (!remoteService.remoteUrl) return undefined;

    if (remoteService.serviceType === ServiceType.github) {
      const { owner, repoName } = GitServiceUtils.parseUrl(remoteService.remoteUrl);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let response: any;
      try {
        response = await this.gitHubService.getRepo(owner, repoName);
      } catch (error) {
        this.d(error.message);
        if (error.status === 401 || error.status === 404 || error.status === 403) {
          if (error.status === 403 && /API rate limit exceeded/.test(error.message)) {
            throw ErrorFactory.newAuthorizationError(`GitHub ${error.message}`);
          }
          this.isOnline = true;
          return AccessType.unknown;
        }
        if (error.status === 500) {
          this.isOnline = false;
          return AccessType.unknown;
        }
        throw error;
      }

      if (response.status === 200) {
        this.isOnline = true;
        if (response.data.private === true) {
          return AccessType.private;
        }
        return AccessType.public;
      }
    } else if (remoteService.serviceType === ServiceType.bitbucket) {
      const { owner, repoName } = GitServiceUtils.parseUrl(remoteService.remoteUrl);

      try {
        const response = await this.bitbucketService.getRepo(owner, repoName);
        if (response.data.is_private === true) {
          return AccessType.private;
        }
        return AccessType.public;
      } catch (error) {
        this.d(error.message);
        if (error.code === 401 || error.code === 404 || error.code === 403) {
          this.isOnline = true;
          return AccessType.unknown;
        }
        if (error.status === 500) {
          this.isOnline = false;
          return AccessType.unknown;
        }
        throw error;
      }
    } else if (remoteService.serviceType === ServiceType.gitlab) {
      const { owner, repoName } = GitServiceUtils.parseUrl(remoteService.remoteUrl);

      try {
        const { data } = await this.gitLabService.getRepo(owner, repoName);
        this.isOnline = true;

        if (data.visibility === AccessType.private) {
          return AccessType.private;
        }
        if (data.visibility === AccessType.public || (data && !data.visibility)) {
          return AccessType.public;
        }
        if (!data) {
          return AccessType.unknown;
        }
      } catch (error) {
        this.d(error.message);

        if (!error.response) {
          this.isOnline = false;
          return AccessType.unknown;
        }

        if (
          error.response.status === 401 ||
          error.response.status === 404 ||
          error.response.status === 403 ||
          error.response.status === 500
        ) {
          this.isOnline = true;
          return AccessType.unknown;
        }
        throw error;
      }
    }

    return undefined;
  };

  private determineGitLabRemoteServiceType = async (): Promise<ServiceType | undefined> => {
    let serviceType = undefined;

    try {
      await this.gitLabService.listRepos();
      await this.gitLabService.listGroups();
      serviceType = ServiceType.gitlab;
    } catch (error) {
      return undefined;
    }

    // second check to ensure that it is really a GitLab API
    try {
      const response = await this.gitLabService.checkVersion();
      if (has(response, 'version') && has(response, 'revision')) {
        return ServiceType.gitlab;
      }
    } catch (error) {
      this.d(error); //debug error
      if (error.response?.status === 401 || error.response?.status === 403) {
        // return undefined if we're not sure that the service is Gitlab
        //  - it prompts user for a credentials
        return serviceType;
      }

      return undefined;
    }
  };
}

export interface ScanningStrategy {
  serviceType: ServiceType | undefined;
  accessType: AccessType | undefined;
  remoteUrl: RemoteUrl;
  localPath: string | undefined;
  rootPath: string | undefined;
  isOnline: boolean;
}

export interface RemoteService {
  serviceType: ServiceType | undefined;
  remoteUrl: RemoteUrl;
}

export type RemoteUrl = string | undefined;

export interface ScanningStrategyParams {
  path: string;
}
