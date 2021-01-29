"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VCSServicesUtils = void 0;
const qs_1 = __importDefault(require("qs"));
const inspectors_1 = require("../../inspectors");
const ICollaborationInspector_1 = require("../../inspectors/ICollaborationInspector");
const IBitbucketService_1 = require("../bitbucket/IBitbucketService");
const IGitLabService_1 = require("../gitlab/IGitLabService");
const IGitHubService_1 = require("./IGitHubService");
class VCSServicesUtils {
}
exports.VCSServicesUtils = VCSServicesUtils;
VCSServicesUtils.getGithubPRState = (state) => {
    switch (state) {
        case ICollaborationInspector_1.PullRequestState.open:
            return IGitHubService_1.GitHubPullRequestState.open;
        case ICollaborationInspector_1.PullRequestState.closed:
            return IGitHubService_1.GitHubPullRequestState.closed;
        case ICollaborationInspector_1.PullRequestState.all:
            return IGitHubService_1.GitHubPullRequestState.all;
        default:
            return undefined;
    }
};
// GitHub Graphql API has a different params for PR state than REST API
VCSServicesUtils.getGithubGqlPRState = (state) => {
    switch (state) {
        case ICollaborationInspector_1.PullRequestState.open:
            return IGitHubService_1.GitHubGqlPullRequestState.open;
        case ICollaborationInspector_1.PullRequestState.closed:
            return IGitHubService_1.GitHubGqlPullRequestState.closed;
        case ICollaborationInspector_1.PullRequestState.all:
            return IGitHubService_1.GitHubGqlPullRequestState.all;
        default:
            return IGitHubService_1.GitHubGqlPullRequestState.all;
    }
};
VCSServicesUtils.getBitbucketPRState = (state) => {
    switch (state) {
        case ICollaborationInspector_1.PullRequestState.open:
            return IBitbucketService_1.BitbucketPullRequestState.open;
        case ICollaborationInspector_1.PullRequestState.closed:
            return IBitbucketService_1.BitbucketPullRequestState.closed;
        case ICollaborationInspector_1.PullRequestState.all:
            return [IBitbucketService_1.BitbucketPullRequestState.open, IBitbucketService_1.BitbucketPullRequestState.closed, IBitbucketService_1.BitbucketPullRequestState.declined];
        default:
            return undefined;
    }
};
VCSServicesUtils.getGitLabPRState = (state) => {
    switch (state) {
        case ICollaborationInspector_1.PullRequestState.open:
            return IGitLabService_1.GitLabPullRequestState.open;
        case ICollaborationInspector_1.PullRequestState.closed:
            return [IGitLabService_1.GitLabPullRequestState.closed, IGitLabService_1.GitLabPullRequestState.merged];
        case ICollaborationInspector_1.PullRequestState.all:
            return IGitLabService_1.GitLabPullRequestState.all;
        default:
            return undefined;
    }
};
VCSServicesUtils.getGitLabIssueState = (state) => {
    switch (state) {
        case inspectors_1.IssueState.open:
            return IGitLabService_1.GitLabIssueState.open;
        case inspectors_1.IssueState.closed:
            return IGitLabService_1.GitLabIssueState.closed;
        case inspectors_1.IssueState.all:
            return IGitLabService_1.GitLabIssueState.all;
        default:
            return undefined;
    }
};
VCSServicesUtils.getGithubIssueState = (state) => {
    switch (state) {
        case inspectors_1.IssueState.open:
            return IGitHubService_1.GitHubIssueState.open;
        case inspectors_1.IssueState.closed:
            return IGitHubService_1.GitHubIssueState.closed;
        case inspectors_1.IssueState.all:
            return IGitHubService_1.GitHubIssueState.all;
        default:
            return undefined;
    }
};
VCSServicesUtils.getBitbucketIssueState = (state) => {
    switch (state) {
        case inspectors_1.IssueState.open:
            return IBitbucketService_1.BitbucketIssueState.new;
        case inspectors_1.IssueState.closed:
            return IBitbucketService_1.BitbucketIssueState.resolved;
        case inspectors_1.IssueState.all:
            return [IBitbucketService_1.BitbucketIssueState.new, IBitbucketService_1.BitbucketIssueState.resolved, IBitbucketService_1.BitbucketIssueState.closed];
        default:
            return undefined;
    }
};
VCSServicesUtils.getBitbucketStateQueryParam = (state) => {
    if (!state) {
        return;
    }
    // put state in quotation marks because of Bitbucket API https://developer.atlassian.com/bitbucket/api/2/reference/meta/filtering#query-issues
    let quotedState = `"${state}"`;
    if (Array.isArray(state)) {
        quotedState = state.map((state) => {
            return `"${state}"`;
        });
    }
    // get q parameter
    return qs_1.default.stringify({ state: quotedState }, {
        addQueryPrefix: false,
        encode: false,
        arrayFormat: 'repeat',
        delimiter: '+OR+',
    });
};
VCSServicesUtils.parseGitHubHeaderLink = (link) => {
    if (!link) {
        return undefined;
    }
    let parsedLinks, parsedHeaderLink;
    let prev, next, last;
    let page, perPage;
    const links = link.split(',');
    links.forEach((link) => {
        var _a;
        const iterator = linkGenerator();
        let current = iterator.next();
        // iterate with prev, next, last through one link
        while (!current.done) {
            const val = link.match(current.value.link);
            if (val) {
                // get url without brackets
                const values = (_a = val['input']) === null || _a === void 0 ? void 0 : _a.match(/\s*<?([^>]*)>(.*)/);
                const url = values ? values[1] : undefined;
                // save url to the right key (prev, next or last)
                const parsedLink = { [current.value.link]: url };
                // get query string
                const query = url ? url.split('?')[1] : undefined;
                if (query) {
                    // parse query to get params
                    const queryParams = qs_1.default.parse(query);
                    //Requests that return multiple items will be paginated to 30 items by default. https://developer.github.com/v3/#pagination
                    perPage = Number(queryParams['per_page']) || 30;
                    page = Number(queryParams['page']) || 1;
                }
                if (current.value.link === 'prev')
                    prev = page;
                if (current.value.link === 'next')
                    next = page;
                if (current.value.link === 'last')
                    last = page;
                parsedLinks = Object.assign(Object.assign({}, parsedLink), parsedLinks);
            }
            current = iterator.next();
        }
        const totalCount = (last || prev) * perPage;
        parsedHeaderLink = Object.assign({ totalCount, page: +next - 1 || +prev + 1, perPage }, parsedLinks);
    });
    return parsedHeaderLink;
};
const linkGenerator = function* () {
    yield { link: 'prev' };
    yield { link: 'next' };
    yield { link: 'last' };
    return;
};
//# sourceMappingURL=VCSServicesUtils.js.map