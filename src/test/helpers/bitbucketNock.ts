/* eslint-disable @typescript-eslint/camelcase */
import nock from 'nock';
import { ListGetterOptions } from '../../inspectors';
import { BitbucketPullRequestState } from '../../services/git/IVCSService';
import { bitbucketListIssueCommentsResponseFactory } from '../factories/responses/bitbucket/listIssueCommentsResponseFactory';
import { bitbucketListIssuesResponseFactory } from '../factories/responses/bitbucket/listIssuesResponseFactory';
import { bitbucketListPRsResponseFactory } from '../factories/responses/bitbucket/listPrsResponseFactory';
import { bitbucketListPullCommitsResponseFactory } from '../factories/responses/bitbucket/listPullCommitsResponseFactory';
import { bitbucketListCommitResponseFactory } from '../factories/responses/bitbucket/listRepoCommitsResponseFactory';

export class BitbucketNock {
  user: string;
  repoName: string;
  url: string;

  constructor(user: string, repoName: string) {
    (this.user = user), (this.repoName = repoName);
    this.url = 'https://api.bitbucket.org/2.0';
  }

  private static get(url: string, params: nock.DataMatcherMap = {}, persist = true): nock.Interceptor {
    const urlObj = new URL(url);

    const scope = nock(urlObj.origin);
    if (persist) {
      scope.persist();
    }

    const interceptor = scope.get(urlObj.pathname);
    if (Object.keys(params)) {
      interceptor.query(params);
    }
    return interceptor;
  }

  getOwnerId() {
    const url = `${this.url}/repositories/${this.user}/${this.repoName}`;
    const params = {};
    const persist = true;
    const response = { owner: { uuid: '{f122f6a4-9111-4431-9f88-884d8cedd194}' } };
    return BitbucketNock.get(url, params, persist).reply(200, response);
  }

  listPullRequestsResponse(
    pullRequests: Bitbucket.Schema.Pullrequest[],
    options?: ListGetterOptions<{ state?: BitbucketPullRequestState | BitbucketPullRequestState[] }>,
  ) {
    const baseUrl = `${this.url}/repositories/${this.user}/${this.repoName}/pullrequests`;

    const queryParams: { state?: BitbucketPullRequestState | BitbucketPullRequestState[]; page?: number; pagelen?: number } = {};
    if (options?.filter?.state) queryParams.state = options?.filter?.state;
    if (options?.pagination?.page) queryParams.page = options?.pagination?.page;
    if (options?.pagination?.perPage) queryParams.pagelen = options?.pagination?.perPage;

    const response = bitbucketListPRsResponseFactory(pullRequests);

    return BitbucketNock.get(baseUrl, queryParams).reply(200, response);
  }

  getPullRequestResponse(pullRequest: Bitbucket.Schema.Pullrequest) {
    const baseUrl = `${this.url}/repositories/${this.user}/${this.repoName}/pullrequests/${pullRequest.id}`;

    return BitbucketNock.get(baseUrl).reply(200, pullRequest);
  }

  getPRsAdditionsAndDeletions(prNumber: number) {
    const baseUrl = `${this.url}/repositories/${this.user}/${this.repoName}/pullrequests/${prNumber}/diffstat`;

    const response = { values: [{ lines_removed: 1, lines_added: 2 }] };
    return BitbucketNock.get(baseUrl).reply(200, response);
  }

  listIssuesResponse(
    issues: Bitbucket.Schema.Issue[],
    options?: ListGetterOptions<{ state?: BitbucketPullRequestState | BitbucketPullRequestState[] }>,
  ) {
    const baseUrl = `${this.url}/repositories/${this.user}/${this.repoName}/issues`;

    const queryParams: { state?: BitbucketPullRequestState | BitbucketPullRequestState[]; page?: number; pagelen?: number } = {};
    if (options?.filter?.state) queryParams.state = options?.filter?.state;
    if (options?.pagination?.page) queryParams.page = options?.pagination?.page;
    if (options?.pagination?.perPage) queryParams.pagelen = options?.pagination?.perPage;

    const response = bitbucketListIssuesResponseFactory(issues);

    return BitbucketNock.get(baseUrl, queryParams).reply(200, response);
  }

  getIssueResponse(issue: Bitbucket.Schema.Issue) {
    const baseUrl = `${this.url}/repositories/${this.user}/${this.repoName}/issues/${issue.id}`;

    return BitbucketNock.get(baseUrl).reply(200, issue);
  }

  listIssueCommentsResponse(issueComments: Bitbucket.Schema.IssueComment[], issueId: number) {
    const baseUrl = `${this.url}/repositories/${this.user}/${this.repoName}/issues/${issueId}/comments`;

    const response = bitbucketListIssueCommentsResponseFactory(issueComment);
    return BitbucketNock.get(baseUrl).reply(200, response);
  }

  listPullCommits(pullCommits: Bitbucket.Schema.Commit[], prNumber: number) {
    const baseUrl = `${this.url}/repositories/${this.user}/${this.repoName}/pullrequests/${prNumber}/commits`;

    const response = bitbucketListPullCommitsResponseFactory(pullCommits);
    return BitbucketNock.get(baseUrl).reply(200, response);
  }

  listCommitResponse(commit: Bitbucket.Schema.Commit[]) {
    const baseUrl = `${this.url}/repositories/${this.user}/${this.repoName}/commits`;

    const response = bitbucketListCommitResponseFactory(commit);
    return BitbucketNock.get(baseUrl).reply(200, response);
  }

  getCommitResponse(commit: Bitbucket.Schema.Commit, commitSha: string) {
    const baseUrl = `${this.url}/repositories/${this.user}/${this.repoName}/commit/${commitSha}`;

    return BitbucketNock.get(baseUrl).reply(200, commit);
  }
}
