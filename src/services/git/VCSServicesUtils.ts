import { PullRequestState } from '../../inspectors/ICollaborationInspector';
import { VCSServiceType } from './IVCSService';
import { GitHubIssueState } from './IGitHubService';
import { IssueState } from '../../inspectors';
import { BitbucketIssueState, BitbucketPullRequestState } from '../bitbucket/IBitbucketService';
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

  static getGithubIssueState = (state: IssueState | undefined) => {
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
  };

  static getBitbucketIssueState = (state: IssueState | undefined) => {
    switch (state) {
      case IssueState.open:
        return BitbucketIssueState.new;
      case IssueState.closed:
        return BitbucketIssueState.resolved;
      case IssueState.all:
        return [BitbucketIssueState.new, BitbucketIssueState.resolved, BitbucketIssueState.closed];
      default:
        return undefined;
    }
  };
}
