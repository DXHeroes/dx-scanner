"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BitbucketIssueState = exports.BitbucketPullRequestState = void 0;
var BitbucketPullRequestState;
(function (BitbucketPullRequestState) {
    BitbucketPullRequestState["open"] = "OPEN";
    BitbucketPullRequestState["closed"] = "MERGED";
    BitbucketPullRequestState["declined"] = "DECLINED";
    BitbucketPullRequestState["superseded"] = "SUPERSEDED";
})(BitbucketPullRequestState = exports.BitbucketPullRequestState || (exports.BitbucketPullRequestState = {}));
var BitbucketIssueState;
(function (BitbucketIssueState) {
    BitbucketIssueState["new"] = "new";
    BitbucketIssueState["closed"] = "closed";
    BitbucketIssueState["duplicate"] = "duplicate";
    BitbucketIssueState["resolved"] = "resolved";
    BitbucketIssueState["invalid"] = "invalid";
})(BitbucketIssueState = exports.BitbucketIssueState || (exports.BitbucketIssueState = {}));
//# sourceMappingURL=IBitbucketService.js.map