"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BitbucketNock = void 0;
const nock_1 = __importDefault(require("nock"));
const listIssueCommentsResponseFactory_1 = require("../factories/responses/bitbucket/listIssueCommentsResponseFactory");
const listIssuesResponseFactory_1 = require("../factories/responses/bitbucket/listIssuesResponseFactory");
const listPrsResponseFactory_1 = require("../factories/responses/bitbucket/listPrsResponseFactory");
const listPullCommitsResponseFactory_1 = require("../factories/responses/bitbucket/listPullCommitsResponseFactory");
const listRepoCommitsResponseFactory_1 = require("../factories/responses/bitbucket/listRepoCommitsResponseFactory");
const listIssuesErrorResponseFactory_1 = require("../factories/responses/bitbucket/listIssuesErrorResponseFactory");
const VCSServicesUtils_1 = require("../../services/git/VCSServicesUtils");
const getRepoContent_1 = require("../factories/responses/bitbucket/getRepoContent");
class BitbucketNock {
    constructor(user, repoName) {
        (this.user = user), (this.repoName = repoName);
        this.url = 'https://api.bitbucket.org/2.0';
    }
    static get(url, params = {}, persist = true) {
        const urlObj = new URL(url);
        const scope = nock_1.default(urlObj.origin);
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
    listPullRequestsResponse(pullRequests, options) {
        var _a, _b, _c, _d, _e, _f;
        const baseUrl = `${this.url}/repositories/${this.user}/${this.repoName}/pullrequests`;
        const queryParams = {};
        if ((_a = options === null || options === void 0 ? void 0 : options.filter) === null || _a === void 0 ? void 0 : _a.state)
            queryParams.state = (_b = options === null || options === void 0 ? void 0 : options.filter) === null || _b === void 0 ? void 0 : _b.state;
        if ((_c = options === null || options === void 0 ? void 0 : options.pagination) === null || _c === void 0 ? void 0 : _c.page)
            queryParams.page = (_d = options === null || options === void 0 ? void 0 : options.pagination) === null || _d === void 0 ? void 0 : _d.page;
        if ((_e = options === null || options === void 0 ? void 0 : options.pagination) === null || _e === void 0 ? void 0 : _e.perPage)
            queryParams.pagelen = (_f = options === null || options === void 0 ? void 0 : options.pagination) === null || _f === void 0 ? void 0 : _f.perPage;
        const response = listPrsResponseFactory_1.bitbucketListPRsResponseFactory(pullRequests);
        return BitbucketNock.get(baseUrl, queryParams).reply(200, response);
    }
    getPullRequestResponse(pullRequest) {
        const baseUrl = `${this.url}/repositories/${this.user}/${this.repoName}/pullrequests/${pullRequest.id}`;
        return BitbucketNock.get(baseUrl).reply(200, pullRequest);
    }
    getPRsAdditionsAndDeletions(prNumber) {
        const baseUrl = `${this.url}/repositories/${this.user}/${this.repoName}/pullrequests/${prNumber}/diffstat`;
        const response = { values: [{ lines_removed: 1, lines_added: 2 }] };
        return BitbucketNock.get(baseUrl).reply(200, response);
    }
    listIssuesResponse(issues, options) {
        var _a, _b, _c, _d, _e, _f;
        const baseUrl = `${this.url}/repositories/${this.user}/${this.repoName}/issues`;
        // get state for q parameter
        const stringifiedState = VCSServicesUtils_1.VCSServicesUtils.getBitbucketStateQueryParam((_a = options === null || options === void 0 ? void 0 : options.filter) === null || _a === void 0 ? void 0 : _a.state);
        const queryParams = {};
        if ((_b = options === null || options === void 0 ? void 0 : options.filter) === null || _b === void 0 ? void 0 : _b.state)
            queryParams.q = stringifiedState;
        if ((_c = options === null || options === void 0 ? void 0 : options.pagination) === null || _c === void 0 ? void 0 : _c.page)
            queryParams.page = (_d = options === null || options === void 0 ? void 0 : options.pagination) === null || _d === void 0 ? void 0 : _d.page;
        if ((_e = options === null || options === void 0 ? void 0 : options.pagination) === null || _e === void 0 ? void 0 : _e.perPage)
            queryParams.pagelen = (_f = options === null || options === void 0 ? void 0 : options.pagination) === null || _f === void 0 ? void 0 : _f.perPage;
        const response = listIssuesResponseFactory_1.bitbucketListIssuesResponseFactory(issues);
        return BitbucketNock.get(baseUrl, queryParams).reply(200, response);
    }
    listIssuesErrorResponse() {
        const baseUrl = `${this.url}/repositories/${this.user}/${this.repoName}/issues`;
        const response = listIssuesErrorResponseFactory_1.bitbucketListIssuesErrorResponseFactory();
        return BitbucketNock.get(baseUrl, true).reply(404, response);
    }
    getIssueResponse(issue) {
        const baseUrl = `${this.url}/repositories/${this.user}/${this.repoName}/issues/${issue.id}`;
        return BitbucketNock.get(baseUrl).reply(200, issue);
    }
    listIssueCommentsResponse(issueComments, issueId) {
        const baseUrl = `${this.url}/repositories/${this.user}/${this.repoName}/issues/${issueId}/comments`;
        const response = listIssueCommentsResponseFactory_1.bitbucketListIssueCommentsResponseFactory(issueComments);
        return BitbucketNock.get(baseUrl).reply(200, response);
    }
    listPullCommits(pullCommits, prNumber) {
        const baseUrl = `${this.url}/repositories/${this.user}/${this.repoName}/pullrequests/${prNumber}/commits`;
        const response = listPullCommitsResponseFactory_1.bitbucketListPullCommitsResponseFactory(pullCommits);
        return BitbucketNock.get(baseUrl).reply(200, response);
    }
    listCommitsResponse(params) {
        const baseUrl = `${this.url}/repositories/${this.user}/${this.repoName}/commits`;
        const response = listRepoCommitsResponseFactory_1.bitbucketListCommitResponseFactory(params);
        return BitbucketNock.get(baseUrl).reply(200, response);
    }
    getCommitResponse(commit, commitSha) {
        const baseUrl = `${this.url}/repositories/${this.user}/${this.repoName}/commit/${commitSha}`;
        return BitbucketNock.get(baseUrl).reply(200, commit);
    }
    getRepoResponse() {
        const baseUrl = `${this.url}/repositories/${this.user}/${this.repoName}`;
        const response = getRepoContent_1.bitbucketRepoInfoResponseFactory();
        return BitbucketNock.get(baseUrl).reply(200, response);
    }
}
exports.BitbucketNock = BitbucketNock;
//# sourceMappingURL=bitbucketNock.js.map