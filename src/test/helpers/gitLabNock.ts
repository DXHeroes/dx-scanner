/* eslint-disable @typescript-eslint/camelcase */
import nock from 'nock';
import { ListGetterOptions, PaginationParams } from '../../inspectors';
import { MergeRequest, Commit } from '../../services/gitlab/gitlabClient/resources/MergeRequests';
import { GitLabPullRequestState } from '../../services/gitlab/IGitLabService';
import { gitLabPullRequestResponseFactory } from '../factories/responses/gitLab/prResponseFactory';
import { gitLabCommitsResponseFactory } from '../factories/responses/gitLab/commitsFactory';
import { gitLabRepoCommitsResponseFactory } from '../factories/responses/gitLab/repoCommitResponseFactory';
import { gitLabListPullCommitsResponseFactory } from '../factories/responses/gitLab/listPullCommitsResponseFactory';
import { Issue } from '../../services/gitlab/gitlabClient/resources/Issues';

export class GitLabNock {
  user: string;
  repoName: string;
  url: string;

  constructor(user: string, repoName: string) {
    (this.user = user), (this.repoName = repoName);
    this.url = 'https://gitlab.com/api/v4';
  }

  private pagination = { 'x-total': '1', 'x-next-page': '1', 'x-page': '1', 'x-prev-page': '', 'x-per-page': '1', 'x-total-pages': '1' };

  private static get(url: string, params: nock.DataMatcherMap = {}, persist = true): nock.Interceptor {
    const urlObj = new URL(url);

    const scope = nock(urlObj.origin, { encodedQueryParams: true });

    if (persist) {
      scope.persist();
    }

    const interceptor = scope.get(urlObj.pathname);
    if (Object.keys(params)) {
      interceptor.query(params);
    }

    return interceptor;
  }

  getUserInfo() {
    const url = `${this.url}/users?username=${this.user}`;

    const response = {
      id: 9970,
      name: this.user,
      web_url: `https://gitlab.com/groups/${this.user}`,
    };

    return GitLabNock.get(url).reply(200, response);
  }

  getGroupInfo() {
    const url = `${this.url}/groups/${this.user}`;

    const response = {
      id: 9970,
      name: this.user,
      web_url: `https://gitlab.com/groups/${this.user}`,
    };

    return GitLabNock.get(url).reply(200, response);
  }

  listPullRequestsResponse(
    pullRequests: MergeRequest[],
    options?: ListGetterOptions<{ state?: GitLabPullRequestState | GitLabPullRequestState[] }>,
  ) {
    const encodedProjectUrl = encodeURIComponent(`${this.user}/${this.repoName}`);
    const baseUrl = `${this.url}/projects/${encodedProjectUrl}/merge_requests`;

    const queryParams: {
      state?: GitLabPullRequestState | GitLabPullRequestState[];
      page?: number;
      pagelen?: number;
    } = {};

    if (options?.filter?.state) queryParams.state = options?.filter?.state;
    if (options?.pagination?.page) queryParams.page = options?.pagination?.page;
    if (options?.pagination?.perPage) queryParams.pagelen = options?.pagination?.perPage;

    const response = [gitLabPullRequestResponseFactory(pullRequests[0])];

    return GitLabNock.get(baseUrl, queryParams).reply(200, response, this.pagination);
  }

  getPullRequestResponse(pullRequest: MergeRequest, mergeIId: number) {
    const encodedProjectUrl = encodeURIComponent(`${this.user}/${this.repoName}`);
    const baseUrl = `${this.url}/projects/${encodedProjectUrl}/merge_requests/${mergeIId}`;

    const response = gitLabPullRequestResponseFactory(pullRequest);

    return GitLabNock.get(baseUrl).reply(200, response, this.pagination);
  }

  listPullCommitsResponse(pullCommits: Commit[], mergeIId: number) {
    const encodedProjectUrl = encodeURIComponent(`${this.user}/${this.repoName}`);

    const baseUrl = `${this.url}/projects/${encodedProjectUrl}/merge_requests/${mergeIId}/commits`;

    const response = gitLabListPullCommitsResponseFactory(pullCommits);
    return GitLabNock.get(baseUrl).reply(200, response, this.pagination);
  }

  listRepoCommitsResponse(repoCommits: Commit[]) {
    const encodedProjectUrl = encodeURIComponent(`${this.user}/${this.repoName}`);

    const baseUrl = `${this.url}/projects/${encodedProjectUrl}/repository/commits`;

    const response = gitLabListPullCommitsResponseFactory(repoCommits);
    return GitLabNock.get(baseUrl).reply(200, response, this.pagination);
  }

  getCommitResponse(commit: Commit, commitId: string) {
    const encodedProjectUrl = encodeURIComponent(`${this.user}/${this.repoName}`);

    const baseUrl = `${this.url}/projects/${encodedProjectUrl}/repository/commits/${commitId}`;

    const response = gitLabRepoCommitsResponseFactory(commit);
    return GitLabNock.get(baseUrl).reply(200, response);
  }

  getIssueResponse(issue: Issue) {
    const encodedProjectUrl = encodeURIComponent(`${this.user}/${this.repoName}`);

    const baseUrl = `${this.url}/projects/${encodedProjectUrl}/issues/${issue.iid}`;

    return GitLabNock.get(baseUrl).reply(200, issue);
  }

  listIssuesResponse(issues: Issue[]) {
    const encodedProjectUrl = encodeURIComponent(`${this.user}/${this.repoName}`);

    const baseUrl = `${this.url}/projects/${encodedProjectUrl}/issues`;

    return GitLabNock.get(baseUrl).reply(200, issues, this.pagination);
  }
}
