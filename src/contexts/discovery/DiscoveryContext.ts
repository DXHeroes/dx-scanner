import { inject, injectable } from 'inversify';
import git from 'simple-git/promise';
import { RemoteService, ServiceType, AccessType } from '../../detectors';
import { ScanningStrategyDetectorUtils } from '../../detectors/utils/ScanningStrategyDetectorUtils';
import { ErrorFactory } from '../../lib/errors';
import { ArgumentsProvider } from '../../scanner';
import { Types } from '../../types';
import debug from 'debug';
import { RepositoryConfig } from './RepositoryConfig';
import { GitServiceUtils, ParsedUrl, GitHubService, BitbucketService } from '../../services';
import { GitLabService } from '../../services/gitlab/GitLabService';

@injectable()
export class DiscoveryContext {
  private readonly argumentsProvider: ArgumentsProvider;
  private readonly d: debug.Debugger;
  private gitHubService: GitHubService;
  private bitbucketService: BitbucketService;
  private gitLabService: GitLabService;
  isOnline = false;

  constructor(
    @inject(Types.ArgumentsProvider) argumentsProvider: ArgumentsProvider,
    @inject(GitHubService) gitHubService: GitHubService,
    @inject(BitbucketService) bitbucketService: BitbucketService,
    @inject(GitLabService) gitLabService: GitLabService,
  ) {
    this.argumentsProvider = argumentsProvider;
    this.gitHubService = gitHubService;
    this.bitbucketService = bitbucketService;
    this.gitLabService = gitLabService;
    this.d = debug('discoveryContext');
  }

  async determineInputType(): Promise<ServiceType | undefined> {
    const path = await ScanningStrategyDetectorUtils.normalizePath(this.argumentsProvider.uri);

    if (ScanningStrategyDetectorUtils.isGitHubPath(path)) return ServiceType.github;
    if (await ScanningStrategyDetectorUtils.isLocalPath(path)) return ServiceType.local;
    if (ScanningStrategyDetectorUtils.isBitbucketPath(path)) return ServiceType.bitbucket;
    if (await ScanningStrategyDetectorUtils.isGitLabPath(path, this.argumentsProvider.auth)) return ServiceType.gitlab;

    // return undefined if we don't know yet the service type
    //  (e.g. because of missing credentials for Gitlab)
    if ((await ScanningStrategyDetectorUtils.isGitLabPath(path, this.argumentsProvider.auth)) === undefined) return undefined;

    throw ErrorFactory.newInternalError(
      `Unable to detect scanning strategy. It seems that the service is not implemented yet. (Input path: ${path})`,
    );
  }

  async determineRemote(): Promise<RemoteService> {
    const path = await ScanningStrategyDetectorUtils.normalizePath(this.argumentsProvider.uri);

    let remoteService: RemoteService;
    console.log(path, 'path');
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
    this.d(remoteService);
    return remoteService;
  }

  async determineRemoteAccessType(remoteService: RemoteService): Promise<AccessType | undefined> {
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
          return AccessType.unknown;
        }
        if (error.status === 500) {
          this.isOnline = false;
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
          return AccessType.unknown;
        }
        if (error.status === 500) {
          this.isOnline = false;
          return AccessType.unknown;
        }
        throw error;
      }
    } else if (remoteService.serviceType === ServiceType.gitlab) {
      const { owner, repoName, host } = GitServiceUtils.parseUrl(remoteService.remoteUrl);
      this.gitLabService.setClient(host, this.argumentsProvider.auth);

      try {
        const { data } = await this.gitLabService.getRepo(owner, repoName);
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
        if (
          error.response.status === 401 ||
          error.response.status === 404 ||
          error.response.status === 403 ||
          error.response.status === 500
        ) {
          if (error.response.status === 500) {
            this.isOnline = false;
          }
          return AccessType.unknown;
        }
        throw error;
      }
    }

    return undefined;
  }

  async getRepositoryConfig(): Promise<RepositoryConfig> {
    const inputType = await this.determineInputType();
    const remoteService = await this.determineRemote();

    let parsedUrl;
    if (remoteService.remoteUrl) parsedUrl = GitServiceUtils.parseUrl(remoteService.remoteUrl);
    const accessType = await this.determineRemoteAccessType(remoteService);
    return {
      remoteService: { remoteUrl: remoteService.remoteUrl, serviceType: remoteService.serviceType },
      inputType,
      accessType,
      host: parsedUrl?.host,
      protocol: parsedUrl?.protocol,
    };
  }
}
