/* eslint-disable no-process-env */
import _ from 'lodash';
import { VCSServiceType } from '../services';
import { ErrorFactory } from '../lib/errors';
import { assertNever } from '../lib/assertNever';

export class CIReporterUtils {
  static loadConfigurationTravis(): CIReporterConfig {
    const ev = process.env;

    if (!ev.TRAVIS_REPO_SLUG) throw ErrorFactory.newInternalError('Could not load Travis configuration');

    const repoOwnerAndName = ev.TRAVIS_REPO_SLUG.split('/');

    return {
      service: VCSServiceType.github,
      pullRequestId: ev.TRAVIS_PULL_REQUEST !== 'false' ? Number(ev.TRAVIS_PULL_REQUEST) : undefined,
      repository: {
        owner: repoOwnerAndName[0],
        name: repoOwnerAndName[1],
      },
    };
  }

  static loadConfigurationGitHubActions(): CIReporterConfig {
    const ev = process.env;

    if (!ev.GITHUB_REPOSITORY || !ev.GITHUB_REF) throw ErrorFactory.newInternalError('Could not load GitHub Actions configuration');

    const repoOwnerAndName = ev.GITHUB_REPOSITORY.split('/');
    const pullRequestId = _.includes(ev.GITHUB_REF, 'refs/pull') ? ev.GITHUB_REF.split('/')[2] : undefined;

    return {
      service: VCSServiceType.github,
      pullRequestId: Number(pullRequestId),
      repository: {
        owner: repoOwnerAndName[0],
        name: repoOwnerAndName[1],
      },
    };
  }

  static loadConfigurationBitbucket(): CIReporterConfig {
    const ev = process.env;

    return {
      service: VCSServiceType.bitbucket,
      pullRequestId: Number(ev.BITBUCKET_PR_ID),
      repository: {
        owner: ev.BITBUCKET_REPO_OWNER!,
        name: ev.BITBUCKET_REPO_SLUG!,
      },
    };
  }

  static loadConfigurationAppveyor(): CIReporterConfig {
    const ev = process.env;

    if (!ev.APPVEYOR_REPO_NAME) throw ErrorFactory.newInternalError('Could not load Appveyor configuration');

    const repoOwnerAndName = ev.APPVEYOR_REPO_NAME.split('/');

    let service: VCSServiceType | undefined;
    const appveyorProvider = <AppveyorProvider>ev.APPVEYOR_REPO_PROVIDER;

    switch (appveyorProvider) {
      case AppveyorProvider.github:
        service = VCSServiceType.github;
        break;
      case AppveyorProvider.bitBucket:
        service = VCSServiceType.bitbucket;
        break;
      case AppveyorProvider.kiln:
      case AppveyorProvider.vso:
      case AppveyorProvider.gitLab:
      case AppveyorProvider.gitHubEnterprise:
      case AppveyorProvider.gitLabEnterprise:
      case AppveyorProvider.stash:
      case AppveyorProvider.gitea:
      case AppveyorProvider.git:
      case AppveyorProvider.mercurial:
      case AppveyorProvider.subversion:
        throw ErrorFactory.newInternalError(`We don't support "${appveyorProvider}" yet`);
      default:
        assertNever(appveyorProvider);
    }

    return {
      service: service!,
      pullRequestId: Number(ev.APPVEYOR_PULL_REQUEST_NUMBER),
      repository: {
        owner: repoOwnerAndName[0],
        name: repoOwnerAndName[1],
      },
    };
  }
}

export type CIReporterConfig = {
  service: VCSServiceType;
  pullRequestId: number | undefined;
  repository: {
    owner: string;
    name: string;
  };
};

enum AppveyorProvider {
  github = 'gitHub',
  bitBucket = 'bitBucket',
  kiln = 'kiln',
  vso = 'vso',
  gitLab = 'gitLab',
  gitHubEnterprise = 'gitHubEnterprise',
  gitLabEnterprise = 'gitLabEnterprise',
  stash = 'stash',
  gitea = 'gitea',
  git = 'git',
  mercurial = 'mercurial',
  subversion = 'subversion',
}
