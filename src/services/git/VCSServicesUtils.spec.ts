import { VCSServicesUtils } from './VCSServicesUtils';
import { BitbucketIssueState, BitbucketPullRequestState } from '../bitbucket/IBitbucketService';
import { PullRequestState, IssueState } from '../../inspectors';
import { GitHubPullRequestState, GitHubIssueState } from './IGitHubService';
import { GitLabPullRequestState, GitLabIssueState } from '../gitlab/IGitLabService';

describe('VCSServicesUtils', () => {
  describe('getBitbucketStateQueryParam', () => {
    it('returns right query paramater for one state', () => {
      const response = VCSServicesUtils.getBitbucketStateQueryParam(BitbucketIssueState.new);
      expect(response).toEqual(`state="${BitbucketIssueState.new}"`);
    });

    it('returns right query paramater for one state in array', () => {
      const response = VCSServicesUtils.getBitbucketStateQueryParam([BitbucketIssueState.new]);
      expect(response).toEqual(`state="${BitbucketIssueState.new}"`);
    });

    it('returns right query paramater for more than one state', () => {
      const response = VCSServicesUtils.getBitbucketStateQueryParam([BitbucketIssueState.new, BitbucketIssueState.closed]);
      expect(response).toEqual(`state="${BitbucketIssueState.new}"+OR+state="${BitbucketIssueState.closed}"`);
    });

    it('returns right query paramater for more than one state', () => {
      const response = VCSServicesUtils.getBitbucketStateQueryParam(undefined);
      expect(response).not.toBeDefined();
    });
  });

  describe('getGithubPRState', () => {
    it('returns GitHubPullRequestState.open', () => {
      const response = VCSServicesUtils.getGithubPRState(PullRequestState.open);
      expect(response).toEqual(GitHubPullRequestState.open);
    });

    it('returns GitHubPullRequestState.closed', () => {
      const response = VCSServicesUtils.getGithubPRState(PullRequestState.closed);
      expect(response).toEqual(GitHubPullRequestState.closed);
    });

    it('returns GitHubPullRequestState.all', () => {
      const response = VCSServicesUtils.getGithubPRState(PullRequestState.all);
      expect(response).toEqual(GitHubPullRequestState.all);
    });

    it('returns undefined', () => {
      const response = VCSServicesUtils.getGithubPRState(undefined);
      expect(response).toEqual(undefined);
    });
  });

  describe('getBitbucketPRState', () => {
    it('returns BitbucketPullRequestState.open', () => {
      const response = VCSServicesUtils.getBitbucketPRState(PullRequestState.open);
      expect(response).toEqual(BitbucketPullRequestState.open);
    });

    it('returns BitbucketPullRequestState.closed', () => {
      const response = VCSServicesUtils.getBitbucketPRState(PullRequestState.closed);
      expect(response).toEqual(BitbucketPullRequestState.closed);
    });

    it('returns array of BitbucketPullRequestStates', () => {
      const response = VCSServicesUtils.getBitbucketPRState(PullRequestState.all);
      expect(response).toEqual([BitbucketPullRequestState.open, BitbucketPullRequestState.closed, BitbucketPullRequestState.declined]);
    });

    it('returns undefined', () => {
      const response = VCSServicesUtils.getBitbucketPRState(undefined);
      expect(response).toEqual(undefined);
    });
  });

  describe('getGitLabPRState', () => {
    it('returns GitLabPullRequestState.open', () => {
      const response = VCSServicesUtils.getGitLabPRState(PullRequestState.open);
      expect(response).toEqual(GitLabPullRequestState.open);
    });

    it('returns [GitLabPullRequestState.closed, GitLabPullRequestState.merged]', () => {
      const response = VCSServicesUtils.getGitLabPRState(PullRequestState.closed);
      expect(response).toEqual([GitLabPullRequestState.closed, GitLabPullRequestState.merged]);
    });

    it('returns GitLabPullRequestState.all', () => {
      const response = VCSServicesUtils.getGitLabPRState(PullRequestState.all);
      expect(response).toEqual(GitLabPullRequestState.all);
    });

    it('returns undefined', () => {
      const response = VCSServicesUtils.getGitLabPRState(undefined);
      expect(response).toEqual(undefined);
    });
  });

  describe('getGitLabIssueState', () => {
    it('returns GitLabIssueState.open', () => {
      const response = VCSServicesUtils.getGitLabIssueState(IssueState.open);
      expect(response).toEqual(GitLabIssueState.open);
    });

    it('returns GitLabIssueState.closed', () => {
      const response = VCSServicesUtils.getGitLabIssueState(IssueState.closed);
      expect(response).toEqual(GitLabIssueState.closed);
    });

    it('returns GitLabIssueState.all', () => {
      const response = VCSServicesUtils.getGitLabIssueState(IssueState.all);
      expect(response).toEqual(GitLabIssueState.all);
    });

    it('returns undefined', () => {
      const response = VCSServicesUtils.getGitLabIssueState(undefined);
      expect(response).toEqual(undefined);
    });
  });

  describe('getGithubIssueState', () => {
    it('returns GitHubIssueState.open', () => {
      const response = VCSServicesUtils.getGithubIssueState(IssueState.open);
      expect(response).toEqual(GitHubIssueState.open);
    });

    it('returns GitHubIssueState.closed', () => {
      const response = VCSServicesUtils.getGithubIssueState(IssueState.closed);
      expect(response).toEqual(GitHubIssueState.closed);
    });

    it('returns GitHubIssueState.all', () => {
      const response = VCSServicesUtils.getGithubIssueState(IssueState.all);
      expect(response).toEqual(GitHubIssueState.all);
    });

    it('returns undefined', () => {
      const response = VCSServicesUtils.getGithubIssueState(undefined);
      expect(response).toEqual(undefined);
    });
  });

  describe('getBitbucketIssueState', () => {
    it('returns BitbucketIssueState.new', () => {
      const response = VCSServicesUtils.getBitbucketIssueState(IssueState.open);
      expect(response).toEqual(BitbucketIssueState.new);
    });

    it('returns BitbucketIssueState.resolved', () => {
      const response = VCSServicesUtils.getBitbucketIssueState(IssueState.closed);
      expect(response).toEqual(BitbucketIssueState.resolved);
    });

    it('returns [BitbucketIssueState.new, BitbucketIssueState.resolved, BitbucketIssueState.closed]', () => {
      const response = VCSServicesUtils.getBitbucketIssueState(IssueState.all);
      expect(response).toEqual([BitbucketIssueState.new, BitbucketIssueState.resolved, BitbucketIssueState.closed]);
    });

    it('returns undefined', () => {
      const response = VCSServicesUtils.getBitbucketIssueState(undefined);
      expect(response).toEqual(undefined);
    });
  });
});
