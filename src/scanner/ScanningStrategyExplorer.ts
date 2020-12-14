import { inject, injectable } from 'inversify';
import git from 'simple-git/promise';
import { ArgumentsProvider } from '.';
import { debugLog } from '../detectors/utils';
import { ScanningStrategyDetectorUtils } from '../detectors/utils/ScanningStrategyDetectorUtils';
import { GitServiceUtils } from '../services';
import { Types } from '../types';
import { RepositoryConfig } from './RepositoryConfig';

@injectable()
export class ScanningStrategyExplorer {
  private readonly argumentsProvider: ArgumentsProvider;
  private readonly d: any;

  constructor(@inject(Types.ArgumentsProvider) argumentsProvider: ArgumentsProvider) {
    this.argumentsProvider = argumentsProvider;

    this.d = debugLog('ScanningStrategyExplorer');
  }

  async explore(): Promise<RepositoryConfig> {
    const path = ScanningStrategyDetectorUtils.normalizePath(this.argumentsProvider.uri);

    let remoteUrl: string | undefined;
    if (ScanningStrategyDetectorUtils.isLocalPath(path)) {
      remoteUrl = await this.determineRemote(path);
    } else {
      remoteUrl = path;
    }

    if (!remoteUrl) {
      return { remoteUrl, host: undefined, protocol: undefined, baseUrl: undefined };
    }

    const parsedUrl = GitServiceUtils.parseUrl(remoteUrl);
    return {
      baseUrl: `${parsedUrl.protocol}://${parsedUrl.host}`,
      remoteUrl,
      host: parsedUrl.host,
      protocol: parsedUrl.protocol,
    };
  }

  private determineRemote = async (path: string): Promise<string | undefined> => {
    const gitRepository = git(path);

    // Doesn't use a git? => local
    const isRepository = await gitRepository.checkIsRepo();
    if (!isRepository) {
      return undefined;
    }

    // Uses git? Then determine remote type & url.
    const remotes = await gitRepository.getRemotes(true);
    if (remotes.length === 0) {
      return undefined;
    }

    // Read all remotes
    const originRemote = remotes.find((r) => r.name === 'origin');
    const remote = originRemote || remotes[0];

    return remote.refs.fetch;
  };
}
