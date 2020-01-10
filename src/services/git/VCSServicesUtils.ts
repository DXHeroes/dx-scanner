import { PullRequestState } from '../../inspectors/ICollaborationInspector';
import { VCSServiceType } from './IVCSService';
import { GitHubPullRequestState, GitHubIssueState } from './IGitHubService';
import { IssueState } from '../../inspectors';
import { BitbucketPullRequestState, BitbucketIssueState } from '../bitbucket/IBitbucketService';

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

  static getIssueState = (state: IssueState | undefined, service: VCSServiceType) => {
    if (service === VCSServiceType.github) {
      switch (state) {
        case IssueState.open:
          return GitHubIssueState.open;
        case IssueState.closed:
          return GitHubIssueState.closed;
        case IssueState.all:
          return GitHubIssueState.all;
        default:
          return undefined;
      }
    }

    if (service === VCSServiceType.bitbucket) {
      switch (state) {
        case IssueState.open:
          return `"${BitbucketIssueState.new}"`;
        case IssueState.closed:
          return `"${BitbucketIssueState.resolved}"`;
        case IssueState.all:
          return [`"${BitbucketIssueState.new}"`, `"${BitbucketIssueState.resolved}"`, `"${BitbucketIssueState.closed}"`];
        default:
          return undefined;
      }
    }
  };
}
