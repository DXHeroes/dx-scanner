import { PullRequestState } from '../../inspectors/ICollaborationInspector';
import { BitbucketPullRequestState, CSVService } from './ICVSService';
import { GitHubPullRequestState } from './IGitHubService';

export class CSVServicesUtils {
  static getPRState = (
    state: PullRequestState | undefined,
    service: CSVService,
  ): GitHubPullRequestState | BitbucketPullRequestState | undefined => {
    if (service === CSVService.github) {
      switch (state) {
        case PullRequestState.open:
          return GitHubPullRequestState.open;
        case PullRequestState.closed:
          return GitHubPullRequestState.closed;
        case PullRequestState.all:
          return GitHubPullRequestState.all;
        case undefined:
          return undefined;
      }
    }

    if (service === CSVService.bitbucket) {
      switch (state) {
        case PullRequestState.open:
          return BitbucketPullRequestState.open;
        case PullRequestState.closed:
          return BitbucketPullRequestState.closed;
        case PullRequestState.all:
          return BitbucketPullRequestState.open && BitbucketPullRequestState.closed && BitbucketPullRequestState.declined;
        case undefined:
          return undefined;
      }
    }
  };
}
