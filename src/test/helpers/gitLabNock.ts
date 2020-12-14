import nock from 'nock';
import { ListGetterOptions } from '../../inspectors';
import { Issue } from '../../services/gitlab/gitlabClient/resources/Issues';
import { Branch } from '../../services/gitlab/gitlabClient/resources/Branches';
import { Commit, MergeRequest } from '../../services/gitlab/gitlabClient/resources/MergeRequests';
import { Project } from '../../services/gitlab/gitlabClient/resources/Projects';
import { GitLabIssueState, GitLabPullRequestState } from '../../services/gitlab/IGitLabService';
import { gitLabIssueCommentsResponseFactory } from '../factories/responses/gitLab/issueCommentsResponseFactory';
import { gitLabListGroupsResponseFactory } from '../factories/responses/gitLab/listGroupsResponseFactors';
import { gitLabListProjectsResponseFactory } from '../factories/responses/gitLab/listProjectsResponseFactory';
import { gitLabListPullCommitsResponseFactory } from '../factories/responses/gitLab/listPullCommitsResponseFactory';
import { gitLabPullRequestResponseFactory } from '../factories/responses/gitLab/prResponseFactory';
import { gitLabRepoCommitsResponseFactory } from '../factories/responses/gitLab/repoCommitResponseFactory';
import { gitLabRepoInfoResponseFactory } from '../factories/responses/gitLab/repoInfoResponseFactory';

export class GitLabNock {
  user: string;
  repoName: string;
  url: string;

  constructor(user: string, repoName: string, host?: string) {
    (this.user = user), (this.repoName = repoName);
    this.url = host ? `https://${host}/api/v4` : 'https://gitlab.com/api/v4';
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
    const url = `${this.url}/users`;
    const response = [
      {
        id: 3045721,
        name: 'Adela',
        username: 'Homolova',
        state: 'active',
        avatar_url: 'https://secure.gravatar.com/avatar/3e007e2a4f00c4a02ba6bc28431f4a20?s=80&d=identicon',
        web_url: 'https://gitlab.com/Homolova',
      },
    ];
    const params = { username: this.user };

    return GitLabNock.get(url, params).reply(200, response);
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
  searchUser(email: string) {
    const url = `${this.url}/users`;

    const response = [
      {
        id: 3045721,
        name: 'Adela',
        username: 'Homolova',
        state: 'active',
        avatar_url: 'https://secure.gravatar.com/avatar/3e007e2a4f00c4a02ba6bc28431f4a20?s=80&d=identicon',
        web_url: 'https://gitlab.com/Homolova',
      },
    ];
    const params = { search: email };

    return GitLabNock.get(url, params).reply(200, response);
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
      per_page?: number;
    } = {};

    if (options?.filter?.state) queryParams.state = options?.filter?.state;
    if (options?.pagination?.page) {
      queryParams.page = options?.pagination?.page;
      this.pagination['x-page'] = options.pagination.page.toString();
    }
    if (options?.pagination?.perPage) {
      queryParams.per_page = options?.pagination?.perPage;
      this.pagination['x-page'] = options.pagination.perPage.toString();
    }

    const response = [gitLabPullRequestResponseFactory(pullRequests[0])];

    return GitLabNock.get(baseUrl, queryParams).reply(200, response, this.pagination);
  }

  getPullRequestResponse(pullRequest: MergeRequest, mergeIId: number) {
    const encodedProjectUrl = encodeURIComponent(`${this.user}/${this.repoName}`);
    const baseUrl = `${this.url}/projects/${encodedProjectUrl}/merge_requests/${mergeIId}`;

    const response = gitLabPullRequestResponseFactory(pullRequest);

    return GitLabNock.get(baseUrl).reply(200, response, this.pagination);
  }

  listPullCommitsResponse(pullCommits: Commit[], mergeIId: number, options?: ListGetterOptions) {
    const encodedProjectUrl = encodeURIComponent(`${this.user}/${this.repoName}`);
    const baseUrl = `${this.url}/projects/${encodedProjectUrl}/merge_requests/${mergeIId}/commits`;

    const queryParams: {
      page?: number;
      per_page?: number;
    } = {};

    if (options?.pagination?.page) {
      queryParams.page = options?.pagination?.page;
      this.pagination['x-page'] = options.pagination.page.toString();
    }
    if (options?.pagination?.perPage) {
      queryParams.per_page = options?.pagination?.perPage;
      this.pagination['x-page'] = options.pagination.perPage.toString();
    }

    const response = gitLabListPullCommitsResponseFactory(pullCommits);
    return GitLabNock.get(baseUrl, queryParams).reply(200, response, this.pagination);
  }

  listRepoCommitsResponse(repoCommits: Commit[], hasNextPage = true, options?: ListGetterOptions) {
    const encodedProjectUrl = encodeURIComponent(`${this.user}/${this.repoName}`);
    const baseUrl = `${this.url}/projects/${encodedProjectUrl}/repository/commits`;

    const queryParams: {
      page?: number;
      per_page?: number;
    } = {};
    const pagination = this.pagination;
    if (options?.pagination?.page) {
      queryParams.page = options?.pagination?.page;
      pagination['x-page'] = options.pagination.page.toString();
    }
    if (options?.pagination?.perPage) {
      queryParams.per_page = options?.pagination?.perPage;
      pagination['x-page'] = options.pagination.perPage.toString();
    }
    if (!hasNextPage) {
      pagination['x-next-page'] = '';
    }

    const response = gitLabListPullCommitsResponseFactory(repoCommits);
    return GitLabNock.get(baseUrl, queryParams).reply(200, response, pagination);
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

  listIssuesResponse(issues: Issue[], options?: ListGetterOptions<{ state: GitLabIssueState }>) {
    const encodedProjectUrl = encodeURIComponent(`${this.user}/${this.repoName}`);
    const baseUrl = `${this.url}/projects/${encodedProjectUrl}/issues`;

    const queryParams: {
      page?: number;
      per_page?: number;
      state?: GitLabIssueState;
    } = {};

    if (options?.pagination?.page) {
      queryParams.page = options?.pagination?.page;
      this.pagination['x-page'] = options.pagination.page.toString();
    }
    if (options?.pagination?.perPage) {
      queryParams.per_page = options?.pagination?.perPage;
      this.pagination['x-page'] = options.pagination.perPage.toString();
    }
    if (options?.filter?.state) queryParams.state = options.filter.state;

    return GitLabNock.get(baseUrl, queryParams).reply(200, issues, this.pagination);
  }

  listIssueCommentsResponse(issueNumber: number, options?: ListGetterOptions) {
    const encodedProjectUrl = encodeURIComponent(`${this.user}/${this.repoName}`);
    const baseUrl = `${this.url}/projects/${encodedProjectUrl}/issues/${issueNumber}/notes`;

    const queryParams: {
      page?: number;
      per_page?: number;
    } = {};

    if (options?.pagination?.page) {
      queryParams.page = options?.pagination?.page;
      this.pagination['x-page'] = options.pagination.page.toString();
    }
    if (options?.pagination?.perPage) {
      queryParams.per_page = options?.pagination?.perPage;
      this.pagination['x-page'] = options.pagination.perPage.toString();
    }

    const response = gitLabIssueCommentsResponseFactory();
    return GitLabNock.get(baseUrl, queryParams).reply(200, [response], this.pagination);
  }

  listPullRequestCommentsResponse(prNumber: number, options?: ListGetterOptions) {
    const encodedProjectUrl = encodeURIComponent(`${this.user}/${this.repoName}`);
    const baseUrl = `${this.url}/projects/${encodedProjectUrl}/merge_requests/${prNumber}/notes`;
    const queryParams: {
      page?: number;
      per_page?: number;
    } = {};

    if (options?.pagination?.page) {
      queryParams.page = options?.pagination?.page;
      this.pagination['x-page'] = options.pagination.page.toString();
    }
    if (options?.pagination?.perPage) {
      queryParams.per_page = options?.pagination?.perPage;
      this.pagination['x-page'] = options.pagination.perPage.toString();
    }

    const response = gitLabIssueCommentsResponseFactory();
    return GitLabNock.get(baseUrl, queryParams).reply(200, [response], this.pagination);
  }

  getRepoResponse(statusCode?: number, project?: Partial<Project>) {
    const encodedProjectUrl = encodeURIComponent(`${this.user}/${this.repoName}`);

    const baseUrl = `${this.url}/projects/${encodedProjectUrl}`;

    const response = gitLabRepoInfoResponseFactory(project);
    return GitLabNock.get(baseUrl).reply(statusCode || 200, response, this.pagination);
  }

  listProjects() {
    const baseUrl = `${this.url}/projects`;
    const response = gitLabListProjectsResponseFactory();

    return GitLabNock.get(baseUrl).reply(200, response);
  }

  listGroups() {
    const baseUrl = `${this.url}/groups`;
    const response = gitLabListGroupsResponseFactory();

    return GitLabNock.get(baseUrl).reply(200, response);
  }

  checkVersion() {
    const baseUrl = `${this.url}/version`;

    return GitLabNock.get(baseUrl);
  }

  listBranchesResponse(issues: Branch[], options?: ListGetterOptions<{ state: GitLabIssueState }>) {
    const encodedProjectUrl = encodeURIComponent(`${this.user}/${this.repoName}`);
    const baseUrl = `${this.url}/projects/${encodedProjectUrl}/repository/branches`;

    const queryParams: {
      page?: number;
      per_page?: number;
    } = {};

    if (options?.pagination?.page) {
      queryParams.page = options?.pagination?.page;
      this.pagination['x-page'] = options.pagination.page.toString();
    }
    if (options?.pagination?.perPage) {
      queryParams.per_page = options?.pagination?.perPage;
      this.pagination['x-page'] = options.pagination.perPage.toString();
    }

    return GitLabNock.get(baseUrl, queryParams).reply(200, issues, this.pagination);
  }
}
