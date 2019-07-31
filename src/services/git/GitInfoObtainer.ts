import { Git } from './Git';
import { GitInfo, GitFLow } from '../../model';
import Debug from 'debug';
const debug = Debug('cli:services:git:github-info-obtainer');

export class GitInfoObtainer {
  private git: Git;

  constructor(git: Git) {
    this.git = git;
  }

  async obtainInfo(): Promise<GitInfo> {
    const contributorCount = await this.git.getContributorCount();
    const pullRequestCount = await this.git.getPullRequestCount();
    debug(`Contributor count: ${contributorCount}, pullRequestCount: ${pullRequestCount}`);
    return {
      activeContributorsCount: contributorCount,
      pullRequests: true,
      flowType: GitFLow.UNKNOWN,
      codeReview: false,
    };
  }
}
