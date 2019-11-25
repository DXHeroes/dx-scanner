import { PullRequestState } from '../../inspectors/ICollaborationInspector';
import { BitbucketPullRequestState, VCSService } from './IVCSService';
import { GitHubPullRequestState } from './IGitHubService';

export class VCSServicesUtils {
  static getPRState = (
    state: PullRequestState | undefined,
    service: VCSService,
  ): GitHubPullRequestState | BitbucketPullRequestState | undefined => {
    if (service === VCSService.github) {
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

    if (service === VCSService.bitbucket) {
      switch (state) {
        case PullRequestState.open:
          return BitbucketPullRequestState.open;
        case PullRequestState.closed:
          return BitbucketPullRequestState.closed;
        case PullRequestState.all:
          return BitbucketPullRequestState.open && BitbucketPullRequestState.closed && BitbucketPullRequestState.declined;
        default:
          return undefined;
      }
    }
  };
}
