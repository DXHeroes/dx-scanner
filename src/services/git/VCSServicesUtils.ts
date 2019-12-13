import { PullRequestState } from '../../inspectors/ICollaborationInspector';
import { BitbucketPullRequestState, VCSServiceType } from './IVCSService';
import { GitHubPullRequestState } from './IGitHubService';

export class VCSServicesUtils {
  static getPRState = (state: PullRequestState | undefined, service: VCSServiceType) => {
    if (service === VCSServiceType.github) {
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
    }

    if (service === VCSServiceType.bitbucket) {
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
    }
  };
}
