"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitHubIssueState = exports.GitHubGqlPullRequestState = exports.GitHubPullRequestState = void 0;
var GitHubPullRequestState;
(function (GitHubPullRequestState) {
    GitHubPullRequestState["open"] = "open";
    GitHubPullRequestState["closed"] = "closed";
    GitHubPullRequestState["all"] = "all";
})(GitHubPullRequestState = exports.GitHubPullRequestState || (exports.GitHubPullRequestState = {}));
var GitHubGqlPullRequestState;
(function (GitHubGqlPullRequestState) {
    GitHubGqlPullRequestState["open"] = "is:open";
    GitHubGqlPullRequestState["closed"] = "is:closed";
    GitHubGqlPullRequestState["all"] = "";
})(GitHubGqlPullRequestState = exports.GitHubGqlPullRequestState || (exports.GitHubGqlPullRequestState = {}));
var GitHubIssueState;
(function (GitHubIssueState) {
    GitHubIssueState["open"] = "open";
    GitHubIssueState["closed"] = "closed";
    GitHubIssueState["all"] = "all";
})(GitHubIssueState = exports.GitHubIssueState || (exports.GitHubIssueState = {}));
//# sourceMappingURL=IGitHubService.js.map