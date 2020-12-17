"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitLabIssueState = exports.GitLabPullRequestState = void 0;
var GitLabPullRequestState;
(function (GitLabPullRequestState) {
    GitLabPullRequestState["open"] = "opened";
    GitLabPullRequestState["closed"] = "closed";
    GitLabPullRequestState["merged"] = "merged";
    GitLabPullRequestState["all"] = "all";
})(GitLabPullRequestState = exports.GitLabPullRequestState || (exports.GitLabPullRequestState = {}));
var GitLabIssueState;
(function (GitLabIssueState) {
    GitLabIssueState["open"] = "active";
    GitLabIssueState["closed"] = "closed";
    GitLabIssueState["all"] = "all";
})(GitLabIssueState = exports.GitLabIssueState || (exports.GitLabIssueState = {}));
//# sourceMappingURL=IGitLabService.js.map