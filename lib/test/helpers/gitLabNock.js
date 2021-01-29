"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitLabNock = void 0;
const nock_1 = __importDefault(require("nock"));
const issueCommentsResponseFactory_1 = require("../factories/responses/gitLab/issueCommentsResponseFactory");
const listGroupsResponseFactors_1 = require("../factories/responses/gitLab/listGroupsResponseFactors");
const listProjectsResponseFactory_1 = require("../factories/responses/gitLab/listProjectsResponseFactory");
const listPullCommitsResponseFactory_1 = require("../factories/responses/gitLab/listPullCommitsResponseFactory");
const prResponseFactory_1 = require("../factories/responses/gitLab/prResponseFactory");
const repoCommitResponseFactory_1 = require("../factories/responses/gitLab/repoCommitResponseFactory");
const repoInfoResponseFactory_1 = require("../factories/responses/gitLab/repoInfoResponseFactory");
class GitLabNock {
    constructor(user, repoName, host) {
        this.pagination = { 'x-total': '1', 'x-next-page': '1', 'x-page': '1', 'x-prev-page': '', 'x-per-page': '1', 'x-total-pages': '1' };
        (this.user = user), (this.repoName = repoName);
        this.url = host ? `https://${host}/api/v4` : 'https://gitlab.com/api/v4';
    }
    static get(url, params = {}, persist = true) {
        const urlObj = new URL(url);
        const scope = nock_1.default(urlObj.origin, { encodedQueryParams: true });
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
    searchUser(email) {
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
    listPullRequestsResponse(pullRequests, options) {
        var _a, _b, _c, _d, _e, _f;
        const encodedProjectUrl = encodeURIComponent(`${this.user}/${this.repoName}`);
        const baseUrl = `${this.url}/projects/${encodedProjectUrl}/merge_requests`;
        const queryParams = {};
        if ((_a = options === null || options === void 0 ? void 0 : options.filter) === null || _a === void 0 ? void 0 : _a.state)
            queryParams.state = (_b = options === null || options === void 0 ? void 0 : options.filter) === null || _b === void 0 ? void 0 : _b.state;
        if ((_c = options === null || options === void 0 ? void 0 : options.pagination) === null || _c === void 0 ? void 0 : _c.page) {
            queryParams.page = (_d = options === null || options === void 0 ? void 0 : options.pagination) === null || _d === void 0 ? void 0 : _d.page;
            this.pagination['x-page'] = options.pagination.page.toString();
        }
        if ((_e = options === null || options === void 0 ? void 0 : options.pagination) === null || _e === void 0 ? void 0 : _e.perPage) {
            queryParams.per_page = (_f = options === null || options === void 0 ? void 0 : options.pagination) === null || _f === void 0 ? void 0 : _f.perPage;
            this.pagination['x-page'] = options.pagination.perPage.toString();
        }
        const response = [prResponseFactory_1.gitLabPullRequestResponseFactory(pullRequests[0])];
        return GitLabNock.get(baseUrl, queryParams).reply(200, response, this.pagination);
    }
    getPullRequestResponse(pullRequest, mergeIId) {
        const encodedProjectUrl = encodeURIComponent(`${this.user}/${this.repoName}`);
        const baseUrl = `${this.url}/projects/${encodedProjectUrl}/merge_requests/${mergeIId}`;
        const response = prResponseFactory_1.gitLabPullRequestResponseFactory(pullRequest);
        return GitLabNock.get(baseUrl).reply(200, response, this.pagination);
    }
    listPullCommitsResponse(pullCommits, mergeIId, options) {
        var _a, _b, _c, _d;
        const encodedProjectUrl = encodeURIComponent(`${this.user}/${this.repoName}`);
        const baseUrl = `${this.url}/projects/${encodedProjectUrl}/merge_requests/${mergeIId}/commits`;
        const queryParams = {};
        if ((_a = options === null || options === void 0 ? void 0 : options.pagination) === null || _a === void 0 ? void 0 : _a.page) {
            queryParams.page = (_b = options === null || options === void 0 ? void 0 : options.pagination) === null || _b === void 0 ? void 0 : _b.page;
            this.pagination['x-page'] = options.pagination.page.toString();
        }
        if ((_c = options === null || options === void 0 ? void 0 : options.pagination) === null || _c === void 0 ? void 0 : _c.perPage) {
            queryParams.per_page = (_d = options === null || options === void 0 ? void 0 : options.pagination) === null || _d === void 0 ? void 0 : _d.perPage;
            this.pagination['x-page'] = options.pagination.perPage.toString();
        }
        const response = listPullCommitsResponseFactory_1.gitLabListPullCommitsResponseFactory(pullCommits);
        return GitLabNock.get(baseUrl, queryParams).reply(200, response, this.pagination);
    }
    listRepoCommitsResponse(repoCommits, hasNextPage = true, options) {
        var _a, _b, _c, _d;
        const encodedProjectUrl = encodeURIComponent(`${this.user}/${this.repoName}`);
        const baseUrl = `${this.url}/projects/${encodedProjectUrl}/repository/commits`;
        const queryParams = {};
        const pagination = this.pagination;
        if ((_a = options === null || options === void 0 ? void 0 : options.pagination) === null || _a === void 0 ? void 0 : _a.page) {
            queryParams.page = (_b = options === null || options === void 0 ? void 0 : options.pagination) === null || _b === void 0 ? void 0 : _b.page;
            pagination['x-page'] = options.pagination.page.toString();
        }
        if ((_c = options === null || options === void 0 ? void 0 : options.pagination) === null || _c === void 0 ? void 0 : _c.perPage) {
            queryParams.per_page = (_d = options === null || options === void 0 ? void 0 : options.pagination) === null || _d === void 0 ? void 0 : _d.perPage;
            pagination['x-page'] = options.pagination.perPage.toString();
        }
        if (!hasNextPage) {
            pagination['x-next-page'] = '';
        }
        const response = listPullCommitsResponseFactory_1.gitLabListPullCommitsResponseFactory(repoCommits);
        return GitLabNock.get(baseUrl, queryParams).reply(200, response, pagination);
    }
    getCommitResponse(commit, commitId) {
        const encodedProjectUrl = encodeURIComponent(`${this.user}/${this.repoName}`);
        const baseUrl = `${this.url}/projects/${encodedProjectUrl}/repository/commits/${commitId}`;
        const response = repoCommitResponseFactory_1.gitLabRepoCommitsResponseFactory(commit);
        return GitLabNock.get(baseUrl).reply(200, response);
    }
    getIssueResponse(issue) {
        const encodedProjectUrl = encodeURIComponent(`${this.user}/${this.repoName}`);
        const baseUrl = `${this.url}/projects/${encodedProjectUrl}/issues/${issue.iid}`;
        return GitLabNock.get(baseUrl).reply(200, issue);
    }
    listIssuesResponse(issues, options) {
        var _a, _b, _c, _d, _e;
        const encodedProjectUrl = encodeURIComponent(`${this.user}/${this.repoName}`);
        const baseUrl = `${this.url}/projects/${encodedProjectUrl}/issues`;
        const queryParams = {};
        if ((_a = options === null || options === void 0 ? void 0 : options.pagination) === null || _a === void 0 ? void 0 : _a.page) {
            queryParams.page = (_b = options === null || options === void 0 ? void 0 : options.pagination) === null || _b === void 0 ? void 0 : _b.page;
            this.pagination['x-page'] = options.pagination.page.toString();
        }
        if ((_c = options === null || options === void 0 ? void 0 : options.pagination) === null || _c === void 0 ? void 0 : _c.perPage) {
            queryParams.per_page = (_d = options === null || options === void 0 ? void 0 : options.pagination) === null || _d === void 0 ? void 0 : _d.perPage;
            this.pagination['x-page'] = options.pagination.perPage.toString();
        }
        if ((_e = options === null || options === void 0 ? void 0 : options.filter) === null || _e === void 0 ? void 0 : _e.state)
            queryParams.state = options.filter.state;
        return GitLabNock.get(baseUrl, queryParams).reply(200, issues, this.pagination);
    }
    listIssueCommentsResponse(issueNumber, options) {
        var _a, _b, _c, _d;
        const encodedProjectUrl = encodeURIComponent(`${this.user}/${this.repoName}`);
        const baseUrl = `${this.url}/projects/${encodedProjectUrl}/issues/${issueNumber}/notes`;
        const queryParams = {};
        if ((_a = options === null || options === void 0 ? void 0 : options.pagination) === null || _a === void 0 ? void 0 : _a.page) {
            queryParams.page = (_b = options === null || options === void 0 ? void 0 : options.pagination) === null || _b === void 0 ? void 0 : _b.page;
            this.pagination['x-page'] = options.pagination.page.toString();
        }
        if ((_c = options === null || options === void 0 ? void 0 : options.pagination) === null || _c === void 0 ? void 0 : _c.perPage) {
            queryParams.per_page = (_d = options === null || options === void 0 ? void 0 : options.pagination) === null || _d === void 0 ? void 0 : _d.perPage;
            this.pagination['x-page'] = options.pagination.perPage.toString();
        }
        const response = issueCommentsResponseFactory_1.gitLabIssueCommentsResponseFactory();
        return GitLabNock.get(baseUrl, queryParams).reply(200, [response], this.pagination);
    }
    listPullRequestCommentsResponse(prNumber, options) {
        var _a, _b, _c, _d;
        const encodedProjectUrl = encodeURIComponent(`${this.user}/${this.repoName}`);
        const baseUrl = `${this.url}/projects/${encodedProjectUrl}/merge_requests/${prNumber}/notes`;
        const queryParams = {};
        if ((_a = options === null || options === void 0 ? void 0 : options.pagination) === null || _a === void 0 ? void 0 : _a.page) {
            queryParams.page = (_b = options === null || options === void 0 ? void 0 : options.pagination) === null || _b === void 0 ? void 0 : _b.page;
            this.pagination['x-page'] = options.pagination.page.toString();
        }
        if ((_c = options === null || options === void 0 ? void 0 : options.pagination) === null || _c === void 0 ? void 0 : _c.perPage) {
            queryParams.per_page = (_d = options === null || options === void 0 ? void 0 : options.pagination) === null || _d === void 0 ? void 0 : _d.perPage;
            this.pagination['x-page'] = options.pagination.perPage.toString();
        }
        const response = issueCommentsResponseFactory_1.gitLabIssueCommentsResponseFactory();
        return GitLabNock.get(baseUrl, queryParams).reply(200, [response], this.pagination);
    }
    getRepoResponse(statusCode, project) {
        const encodedProjectUrl = encodeURIComponent(`${this.user}/${this.repoName}`);
        const baseUrl = `${this.url}/projects/${encodedProjectUrl}`;
        const response = repoInfoResponseFactory_1.gitLabRepoInfoResponseFactory(project);
        return GitLabNock.get(baseUrl).reply(statusCode || 200, response, this.pagination);
    }
    listProjects() {
        const baseUrl = `${this.url}/projects`;
        const response = listProjectsResponseFactory_1.gitLabListProjectsResponseFactory();
        return GitLabNock.get(baseUrl).reply(200, response);
    }
    listGroups() {
        const baseUrl = `${this.url}/groups`;
        const response = listGroupsResponseFactors_1.gitLabListGroupsResponseFactory();
        return GitLabNock.get(baseUrl).reply(200, response);
    }
    checkVersion() {
        const baseUrl = `${this.url}/version`;
        return GitLabNock.get(baseUrl);
    }
    listBranchesResponse(issues, options) {
        var _a, _b, _c, _d;
        const encodedProjectUrl = encodeURIComponent(`${this.user}/${this.repoName}`);
        const baseUrl = `${this.url}/projects/${encodedProjectUrl}/repository/branches`;
        const queryParams = {};
        if ((_a = options === null || options === void 0 ? void 0 : options.pagination) === null || _a === void 0 ? void 0 : _a.page) {
            queryParams.page = (_b = options === null || options === void 0 ? void 0 : options.pagination) === null || _b === void 0 ? void 0 : _b.page;
            this.pagination['x-page'] = options.pagination.page.toString();
        }
        if ((_c = options === null || options === void 0 ? void 0 : options.pagination) === null || _c === void 0 ? void 0 : _c.perPage) {
            queryParams.per_page = (_d = options === null || options === void 0 ? void 0 : options.pagination) === null || _d === void 0 ? void 0 : _d.perPage;
            this.pagination['x-page'] = options.pagination.perPage.toString();
        }
        return GitLabNock.get(baseUrl, queryParams).reply(200, issues, this.pagination);
    }
}
exports.GitLabNock = GitLabNock;
//# sourceMappingURL=gitLabNock.js.map