import { PullRequestState } from '../../inspectors/ICollaborationInspector';
import { BitbucketPullRequestState, VCSServiceType } from './IVCSService';
import { GitHubPullRequestState } from './IGitHubService';

export class VCSServicesUtils {
  static getGithubPRState = (state: PullRequestState | undefined) => {
    switch (state) {
      case PullRequestState.open:
        return GitHubPullRequestState.open;
      case PullRequestState.closed:
        return GitHubPullRequestState.closed;
      case PullRequestState.all:
        return GitHubPullRequestState.all;
      default:
        return undefined;
    }
  };

  static getBitbucketPRState = (state: PullRequestState | undefined) => {
    switch (state) {
      case PullRequestState.open:
        return BitbucketPullRequestState.open;
      case PullRequestState.closed:
        return BitbucketPullRequestState.closed;
      case PullRequestState.all:
        return [BitbucketPullRequestState.open, BitbucketPullRequestState.closed, BitbucketPullRequestState.declined];
      default:
        return undefined;
    }
  };
}
