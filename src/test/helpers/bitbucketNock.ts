import nock from 'nock';
import { ListGetterOptions } from '../../inspectors';
import { bitbucketListIssueCommentsResponseFactory } from '../factories/responses/bitbucket/listIssueCommentsResponseFactory';
import { bitbucketListIssuesResponseFactory } from '../factories/responses/bitbucket/listIssuesResponseFactory';
import { bitbucketListPRsResponseFactory } from '../factories/responses/bitbucket/listPrsResponseFactory';
import { bitbucketListPullCommitsResponseFactory } from '../factories/responses/bitbucket/listPullCommitsResponseFactory';
import { bitbucketListCommitResponseFactory } from '../factories/responses/bitbucket/listRepoCommitsResponseFactory';
import { bitbucketListIssuesErrorResponseFactory } from '../factories/responses/bitbucket/listIssuesErrorResponseFactory';
import { BitbucketPullRequestState, BitbucketIssueState } from '../../services/bitbucket/IBitbucketService';
import { VCSServicesUtils } from '../../services/git/VCSServicesUtils';
import Bitbucket from 'bitbucket';
import { bitbucketRepoInfoResponseFactory } from '../factories/responses/bitbucket/getRepoContent';
import { BitbucketCommit } from '../../services';

export class BitbucketNock {
  user: string;
  repoName: string;
  url: string;

  constructor(user: string, repoName: string) {
    (this.user = user), (this.repoName = repoName);
    this.url = 'https://api.bitbucket.org/2.0';
  }

  private static get(url: string, params: nock.DataMatcherMap | boolean = {}, persist = true): nock.Interceptor {
    const urlObj = new URL(url);

    const scope = nock(urlObj.origin);
    if (persist) {
      scope.persist();
    }

    const interceptor = scope.get(urlObj.pathname);
    if (params) {
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
    options?: ListGetterOptions<{ state?: BitbucketIssueState | BitbucketIssueState[] }>,
  ) {
    const baseUrl = `${this.url}/repositories/${this.user}/${this.repoName}/issues`;

    // get state for q parameter
    const stringifiedState = VCSServicesUtils.getBitbucketStateQueryParam(options?.filter?.state);

    const queryParams: { q?: string; page?: number; pagelen?: number } = {};
    if (options?.filter?.state) queryParams.q = stringifiedState;
    if (options?.pagination?.page) queryParams.page = options?.pagination?.page;
    if (options?.pagination?.perPage) queryParams.pagelen = options?.pagination?.perPage;

    const response = bitbucketListIssuesResponseFactory(issues);

    return BitbucketNock.get(baseUrl, queryParams).reply(200, response);
  }

  listIssuesErrorResponse() {
    const baseUrl = `${this.url}/repositories/${this.user}/${this.repoName}/issues`;
    const response = bitbucketListIssuesErrorResponseFactory();
    return BitbucketNock.get(baseUrl, true).reply(404, response);
  }

  getIssueResponse(issue: Bitbucket.Schema.Issue) {
    const baseUrl = `${this.url}/repositories/${this.user}/${this.repoName}/issues/${issue.id}`;

    return BitbucketNock.get(baseUrl).reply(200, issue);
  }

  listIssueCommentsResponse(issueComments: Bitbucket.Schema.IssueComment[], issueId: number) {
    const baseUrl = `${this.url}/repositories/${this.user}/${this.repoName}/issues/${issueId}/comments`;

    const response = bitbucketListIssueCommentsResponseFactory(issueComments);
    return BitbucketNock.get(baseUrl).reply(200, response);
  }

  listPullCommits(pullCommits: Bitbucket.Schema.Commit[], prNumber: number) {
    const baseUrl = `${this.url}/repositories/${this.user}/${this.repoName}/pullrequests/${prNumber}/commits`;

    const response = bitbucketListPullCommitsResponseFactory(pullCommits);
    return BitbucketNock.get(baseUrl).reply(200, response);
  }

  listCommitsResponse(params?: Partial<BitbucketCommit>) {
    const baseUrl = `${this.url}/repositories/${this.user}/${this.repoName}/commits`;

    const response = bitbucketListCommitResponseFactory(params);
    return BitbucketNock.get(baseUrl).reply(200, response);
  }

  getCommitResponse(commit: Bitbucket.Schema.Commit, commitSha: string) {
    const baseUrl = `${this.url}/repositories/${this.user}/${this.repoName}/commit/${commitSha}`;

    return BitbucketNock.get(baseUrl).reply(200, commit);
  }

  getRepoResponse() {
    const baseUrl = `${this.url}/repositories/${this.user}/${this.repoName}`;

    const response = bitbucketRepoInfoResponseFactory();
    return BitbucketNock.get(baseUrl).reply(200, response);
  }
}
