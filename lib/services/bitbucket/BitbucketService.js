"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BitbucketService = void 0;
const bitbucket_1 = require("bitbucket");
const colors_1 = require("colors");
const debug_1 = __importDefault(require("debug"));
const git_url_parse_1 = __importDefault(require("git-url-parse"));
const inversify_1 = require("inversify");
const util_1 = require("util");
const axios_1 = __importDefault(require("axios"));
const qs_1 = __importDefault(require("qs"));
const types_1 = require("../../types");
const VCSServicesUtils_1 = require("../git/VCSServicesUtils");
const cache_1 = require("../../scanner/cache");
const IBitbucketService_1 = require("./IBitbucketService");
const debug = debug_1.default('cli:services:git:bitbucket-service');
let BitbucketService = class BitbucketService {
    constructor(argumentsProvider, repositoryConfig) {
        this.callCount = 0;
        this.authenticated = false;
        this.debugBitbucketResponse = (response) => {
            this.callCount++;
            debug(colors_1.grey(`Bitbucket API Hit: ${this.callCount}. Remaining ${response.headers['x-ratelimit-remaining']} hits. (${response.headers.link})`));
        };
        this.extractEmailFromString = (text) => {
            const emailRegex = /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/gim;
            const email = text.match(emailRegex);
            if (email)
                return email[0];
            return undefined;
        };
        this.cache = new cache_1.InMemoryCache();
        this.argumentsProvider = argumentsProvider;
        this.repositoryConfig = repositoryConfig;
        this.client = bitbucket_1.Bitbucket({
            notice: false,
        });
    }
    purgeCache() {
        this.cache.purge();
    }
    authenticate() {
        if (this.authenticated || !this.argumentsProvider.auth)
            return;
        let username;
        let password;
        if (this.argumentsProvider.auth && this.argumentsProvider.auth.includes(':')) {
            username = this.argumentsProvider.auth.split(':')[0];
            password = this.argumentsProvider.auth.split(':')[1];
        }
        else {
            username = git_url_parse_1.default(this.argumentsProvider.uri).owner;
            password = this.argumentsProvider.auth;
        }
        let auth;
        if (this.argumentsProvider.auth) {
            auth = { username, password };
            this.client = bitbucket_1.Bitbucket({
                notice: false,
                auth,
            });
            this.authenticated = true; // set authentication to instance
        }
    }
    getRepo(owner, repo) {
        this.authenticate();
        const params = {
            repo_slug: repo,
            workspace: owner,
        };
        return this.unwrap(this.client.repositories.get(params));
    }
    async listPullRequests(owner, repo, options) {
        var _a, _b, _c, _d;
        this.authenticate();
        const apiUrl = `https://api.bitbucket.org/2.0/repositories/${owner}/${repo}/pullrequests`;
        const ownerUrl = `https://bitbucket.org/${owner}`;
        let state;
        if ((_a = options === null || options === void 0 ? void 0 : options.filter) === null || _a === void 0 ? void 0 : _a.state) {
            state = VCSServicesUtils_1.VCSServicesUtils.getBitbucketPRState(options.filter.state);
        }
        const ownerId = `${(_b = (await this.unwrap(this.client.repositories.get({ repo_slug: repo, workspace: owner }))).data.owner) === null || _b === void 0 ? void 0 : _b.uuid}`;
        const response = await this.unwrap(axios_1.default.get(apiUrl, {
            params: { state, page: (_c = options === null || options === void 0 ? void 0 : options.pagination) === null || _c === void 0 ? void 0 : _c.page, pagelen: (_d = options === null || options === void 0 ? void 0 : options.pagination) === null || _d === void 0 ? void 0 : _d.perPage },
            paramsSerializer: function (params) {
                return qs_1.default.stringify(params, { arrayFormat: 'repeat', encode: false });
            },
        }));
        const items = await Promise.all(response.data.values.map(async (val) => {
            var _a, _b;
            const pullRequest = {
                user: {
                    id: val.author.uuid,
                    login: val.author.nickname,
                    url: val.author.links.html.href,
                },
                title: val.title,
                url: val.links.html.href,
                body: val.summary.markup,
                sha: (_b = (_a = val.source) === null || _a === void 0 ? void 0 : _a.commit) === null || _b === void 0 ? void 0 : _b.hash,
                createdAt: val.created_on,
                updatedAt: val.updated_on,
                closedAt: val.state === IBitbucketService_1.BitbucketPullRequestState.closed || val.state === IBitbucketService_1.BitbucketPullRequestState.declined ? val.updated_on : null,
                mergedAt: val.state === IBitbucketService_1.BitbucketPullRequestState.closed ? val.updated_on : null,
                state: val.state,
                id: val.id,
                base: {
                    repo: {
                        url: val.destination.repository.links.html.href,
                        name: val.destination.repository.name,
                        id: val.destination.repository.uuid,
                        owner: {
                            login: owner,
                            id: ownerId,
                            url: ownerUrl,
                        },
                    },
                },
            };
            // Get number of changes, additions and deletions in PullRequest if the withDiffStat is true
            if (options === null || options === void 0 ? void 0 : options.withDiffStat) {
                const lines = await this.getPullsDiffStat(owner, repo, val.id);
                return Object.assign(Object.assign({}, pullRequest), { lines });
            }
            return pullRequest;
        }));
        const pagination = this.getPagination(response.data);
        return Object.assign({ items }, pagination);
    }
    async getPullRequest(owner, repo, prNumber, withDiffStat) {
        var _a;
        this.authenticate();
        const params = {
            pull_request_id: prNumber,
            repo_slug: repo,
            workspace: owner,
        };
        const ownerUrl = `https://bitbucket.org/${owner}`;
        const ownerId = `${(_a = (await this.unwrap(this.client.repositories.get({ repo_slug: repo, workspace: owner }))).data.owner) === null || _a === void 0 ? void 0 : _a.uuid}`;
        const response = await this.unwrap(this.client.pullrequests.get(params));
        const pullRequest = {
            user: {
                id: response.data.author.uuid,
                login: response.data.author.nickname,
                url: response.data.author.links.html.href,
            },
            title: response.data.title,
            url: response.data.links.html.href,
            body: response.data.summary.raw,
            sha: response.data.source.commit.hash,
            createdAt: response.data.created_on,
            updatedAt: response.data.updated_on,
            closedAt: response.data.state === IBitbucketService_1.BitbucketPullRequestState.closed || response.data.state === IBitbucketService_1.BitbucketPullRequestState.declined
                ? response.data.updated_on
                : null,
            mergedAt: response.data.state === IBitbucketService_1.BitbucketPullRequestState.closed ? response.data.updated_on : null,
            state: response.data.state,
            id: response.data.id,
            base: {
                repo: {
                    url: response.data.destination.repository.links.html.href,
                    name: response.data.destination.repository.name,
                    id: response.data.destination.repository.uuid,
                    owner: {
                        login: owner,
                        id: ownerId,
                        url: ownerUrl,
                    },
                },
            },
        };
        // Get number of changes, additions and deletions in PullRequest if the withDiffStat is true
        if (withDiffStat) {
            const lines = await this.getPullsDiffStat(owner, repo, prNumber);
            return Object.assign(Object.assign({}, pullRequest), { lines });
        }
        return pullRequest;
    }
    async listPullRequestFiles(owner, repo, prNumber) {
        this.authenticate();
        throw new Error('Method not implemented yet.');
    }
    async listPullCommits(owner, repo, prNumber, options) {
        var _a, _b;
        this.authenticate();
        const params = {
            pull_request_id: prNumber.toString(),
            repo_slug: repo,
            workspace: owner,
        };
        if ((_a = options === null || options === void 0 ? void 0 : options.pagination) === null || _a === void 0 ? void 0 : _a.page) {
            params.page = options.pagination.page.toString();
        }
        if ((_b = options === null || options === void 0 ? void 0 : options.pagination) === null || _b === void 0 ? void 0 : _b.perPage) {
            params.pagelen = options.pagination.perPage;
        }
        const response = await this.unwrap(this.client.pullrequests.listCommits(params));
        const items = response.data.values.map((val) => {
            const commitUrl = `https://bitbucket.org/${val.repository.full_name}/commits/${val.hash}`;
            return {
                sha: val.hash,
                commit: {
                    url: commitUrl,
                    message: val.message,
                    author: {
                        name: val.author.raw,
                        email: this.extractEmailFromString(val.author.raw) || '',
                        date: val.date,
                    },
                    tree: {
                        sha: val.hash,
                        url: commitUrl,
                    },
                    //TODO
                    verified: false,
                },
            };
        });
        const pagination = this.getPagination(response.data);
        return Object.assign({ items }, pagination);
    }
    async listIssues(owner, repo, options) {
        var _a, _b, _c, _d, _e, _f;
        this.authenticate();
        const apiUrl = `https://api.bitbucket.org/2.0/repositories/${owner}/${repo}/issues`;
        const state = VCSServicesUtils_1.VCSServicesUtils.getBitbucketIssueState((_a = options === null || options === void 0 ? void 0 : options.filter) === null || _a === void 0 ? void 0 : _a.state);
        // get state for q parameter
        const stringifiedState = VCSServicesUtils_1.VCSServicesUtils.getBitbucketStateQueryParam(state);
        const params = {
            q: stringifiedState,
            page: (_b = options === null || options === void 0 ? void 0 : options.pagination) === null || _b === void 0 ? void 0 : _b.page,
            pagelen: (_c = options === null || options === void 0 ? void 0 : options.pagination) === null || _c === void 0 ? void 0 : _c.perPage,
        };
        let response;
        try {
            response = await this.unwrap(axios_1.default.get(apiUrl, {
                params,
                paramsSerializer: qs_1.default.stringify,
            }));
        }
        catch (err) {
            const errorMessage = (_f = (_e = (_d = err === null || err === void 0 ? void 0 : err.response) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.error) === null || _f === void 0 ? void 0 : _f.message;
            if (errorMessage === 'Repository has no issue tracker.') {
                return {
                    items: [],
                    totalCount: 0,
                    hasNextPage: false,
                    hasPreviousPage: false,
                    page: 1,
                    perPage: 0,
                };
            }
            throw err;
        }
        const items = response.data.values.map((val) => ({
            user: {
                id: val.reporter.uuid,
                login: val.reporter.nickname,
                url: val.reporter.links.html.href,
            },
            url: val.repository.links.html.href,
            body: val.content.raw,
            createdAt: val.created_on,
            updatedAt: val.updated_on,
            closedAt: val.state === IBitbucketService_1.BitbucketIssueState.resolved || val.state === IBitbucketService_1.BitbucketIssueState.closed ? val.updated_on : null,
            state: val.state,
            id: val.id,
        }));
        const pagination = this.getPagination(response.data);
        return Object.assign({ items }, pagination);
    }
    async getIssue(owner, repo, issueNumber) {
        this.authenticate();
        const params = {
            issue_id: issueNumber.toString(),
            repo_slug: repo,
            workspace: owner,
        };
        const response = await this.unwrap(this.client.issue_tracker.get(params));
        return {
            id: response.data.id,
            user: {
                login: response.data.reporter.nickname,
                id: response.data.reporter.uuid,
                url: response.data.reporter.links.html.href,
            },
            url: response.data.links.html.href,
            body: response.data.content.raw,
            createdAt: response.data.created_on,
            updatedAt: response.data.updated_on,
            closedAt: response.data.state === IBitbucketService_1.BitbucketIssueState.resolved || response.data.state === IBitbucketService_1.BitbucketIssueState.closed
                ? response.data.updated_on
                : null,
            state: response.data.state,
        };
    }
    async listIssueComments(owner, repo, issueNumber) {
        this.authenticate();
        const params = {
            issue_id: issueNumber.toString(),
            repo_slug: repo,
            workspace: owner,
        };
        const response = (await this.unwrap(this.client.issue_tracker.listComments(params)));
        const items = response.data.values.map((val) => ({
            user: {
                id: val.user.uuid,
                login: val.user.nickname,
                url: val.user.links.html.href,
            },
            url: val.links.html.href,
            body: val.content.raw,
            createdAt: val.created_on,
            updatedAt: val.updated_on,
            authorAssociation: val.user.username,
            id: val.id,
        }));
        const pagination = this.getPagination(response.data);
        return Object.assign({ items }, pagination);
    }
    async listBranches(owner, repo, options) {
        var _a, _b, _c, _d, _e;
        this.authenticate();
        const [responseBranches, responseBranchingModel] = await Promise.all([
            this.client.refs.listBranches({
                repo_slug: repo,
                workspace: owner,
                page: (_b = (_a = options === null || options === void 0 ? void 0 : options.pagination) === null || _a === void 0 ? void 0 : _a.page) === null || _b === void 0 ? void 0 : _b.toString(),
                pagelen: (_c = options === null || options === void 0 ? void 0 : options.pagination) === null || _c === void 0 ? void 0 : _c.perPage,
            }),
            this.client.branching_model.get({
                repo_slug: repo,
                workspace: owner,
            }),
        ]);
        const items = ((_d = responseBranches.data.values) === null || _d === void 0 ? void 0 : _d.map((val) => {
            var _a, _b;
            return ({
                name: val.name || '',
                type: val.name === ((_b = (_a = responseBranchingModel.data.development) === null || _a === void 0 ? void 0 : _a.branch) === null || _b === void 0 ? void 0 : _b.name) ? 'default' : 'unknown',
            });
        })) || [];
        const pagination = this.getPagination(Object.assign(Object.assign({}, responseBranches.data), { values: (_e = responseBranches.data.values) === null || _e === void 0 ? void 0 : _e.filter(Boolean) }));
        return Object.assign({ items }, pagination);
    }
    async listPullRequestReviews(owner, repo, prNumber) {
        this.authenticate();
        throw new Error('Method not implemented yet.');
    }
    async listRepoCommits(owner, repo, options) {
        var _a, _b;
        this.authenticate();
        const params = {
            repo_slug: repo,
            workspace: owner,
        };
        if ((_a = options === null || options === void 0 ? void 0 : options.pagination) === null || _a === void 0 ? void 0 : _a.page)
            params.page = options.pagination.page.toString();
        if ((_b = options === null || options === void 0 ? void 0 : options.pagination) === null || _b === void 0 ? void 0 : _b.perPage)
            params.pagelen = options.pagination.perPage;
        const response = await this.unwrap(this.client.repositories.listCommits(params));
        const items = response.data.values.map((val) => {
            return {
                sha: val.hash,
                url: `https://bitbucket.org/${val.repository.full_name}/commits/${val.hash}`,
                message: val.message,
                author: {
                    name: val.author.user.nickname,
                    email: this.extractEmailFromString(val.author.raw) || '',
                    date: val.date,
                },
                tree: {
                    sha: val.parents[0].hash,
                    url: `https://bitbucket.org/${val.repository.full_name}/commits/${val.parents[0].hash}`,
                },
                // TODO
                verified: false,
            };
        });
        const pagination = this.getPagination(response.data);
        return Object.assign({ items }, pagination);
    }
    async getCommit(owner, repo, commitSha) {
        this.authenticate();
        const params = {
            node: commitSha,
            repo_slug: repo,
            workspace: owner,
        };
        const response = await this.unwrap(this.client.commits.get(params));
        return {
            sha: response.data.hash,
            url: `https://bitbucket.org/${response.data.repository.full_name}/commits/${response.data.hash}`,
            message: response.data.message,
            author: {
                name: response.data.author.user.nickname,
                email: this.extractEmailFromString(response.data.author.raw) || '',
                date: response.data.date,
            },
            tree: {
                sha: response.data.parents[0].hash,
                url: `https://bitbucket.org/${response.data.repository.full_name}/commits/${response.data.parents[0].hash}`,
            },
            // TODO
            verified: false,
        };
    }
    /**
     * List Comments for a Pull Request
     */
    async listPullRequestComments(owner, repo, prNumber, options) {
        var _a, _b;
        this.authenticate();
        const response = await this.client.pullrequests.listComments({
            pull_request_id: prNumber,
            repo_slug: repo,
            workspace: owner,
            page: `${(_a = options === null || options === void 0 ? void 0 : options.pagination) === null || _a === void 0 ? void 0 : _a.page}`,
            pagelen: (_b = options === null || options === void 0 ? void 0 : options.pagination) === null || _b === void 0 ? void 0 : _b.perPage,
        });
        const items = response.data.values.map((comment) => ({
            user: { id: comment.user.uuid, login: comment.user.username, url: comment.user.website },
            id: comment.id,
            url: comment.links.html.href,
            body: comment.content.markup,
            createdAt: comment.created_on,
            updatedAt: comment.updated_on,
            authorAssociation: comment.user.username,
        }));
        const pagination = this.getPagination(response.data);
        return Object.assign({ items }, pagination);
    }
    /**
     * Add Comment to a Pull Request
     */
    async createPullRequestComment(owner, repo, prNumber, body) {
        this.authenticate();
        const response = await this.unwrap(this.client.pullrequests.createComment({
            pull_request_id: prNumber,
            repo_slug: repo,
            workspace: owner,
            _body: { type: 'pullrequest_comment', content: { raw: body, markup: 'markdown' } },
        }));
        const comment = response.data;
        return {
            user: { id: `${comment.user.id}`, login: comment.user.username, url: comment.user.links.html.href },
            id: comment.id,
            url: comment.links.html.href,
            body: comment.content.raw,
            createdAt: comment.created_on,
            updatedAt: comment.updated_on,
        };
    }
    /**
     * Update Comment on a Pull Request
     */
    async updatePullRequestComment(owner, repo, commentId, body, pullRequestId) {
        this.authenticate();
        const response = await this.unwrap(this.client.pullrequests.updateComment({
            pull_request_id: `${pullRequestId}`,
            comment_id: `${commentId}`,
            repo_slug: repo,
            workspace: owner,
            _body: { type: 'pullrequest_comment', content: { raw: body, markup: 'markdown' } },
        }));
        const comment = response.data;
        return {
            user: { id: `${comment.user.id}`, login: comment.user.username, url: comment.user.website },
            id: comment.id,
            url: comment.links.html.href,
            body: comment.content.markup,
            createdAt: comment.created_on,
            updatedAt: comment.updated_on,
        };
    }
    async listContributors(owner, repo) {
        this.authenticate();
        const params = {
            repo_slug: repo,
            workspace: owner,
        };
        const commits = await this.paginateCommits(params);
        return (commits
            //filter duplicate committer names
            .filter((commit, index, array) => array.findIndex((t) => { var _a, _b, _c, _d; return ((_b = (_a = t.author) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.nickname) === ((_d = (_c = commit.author) === null || _c === void 0 ? void 0 : _c.user) === null || _d === void 0 ? void 0 : _d.nickname); }) === index)
            //create contributor object
            .map((commit) => {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            return {
                user: {
                    id: ((_b = (_a = commit.author) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.uuid) || '',
                    url: ((_f = (_e = (_d = (_c = commit.author) === null || _c === void 0 ? void 0 : _c.user) === null || _d === void 0 ? void 0 : _d.links) === null || _e === void 0 ? void 0 : _e.html) === null || _f === void 0 ? void 0 : _f.href) || '',
                    login: ((_h = (_g = commit.author) === null || _g === void 0 ? void 0 : _g.user) === null || _h === void 0 ? void 0 : _h.nickname) || '',
                },
                contributions: commits.filter((value) => { var _a, _b, _c, _d; return ((_b = (_a = value.author) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.nickname) === ((_d = (_c = commit.author) === null || _c === void 0 ? void 0 : _c.user) === null || _d === void 0 ? void 0 : _d.nickname); }).length,
            };
        }));
    }
    async listContributorsStats(owner, repo) {
        this.authenticate();
        throw new Error('Method not implemented yet.');
    }
    async getRepoContent(owner, repo, path) {
        this.authenticate();
        throw new Error('Method not implemented yet.');
    }
    /**
     * Add additions, deletions and changes of pull request when the getPullRequests() is called with withDiffStat = true
     */
    async getPullsDiffStat(owner, repo, prNumber) {
        const diffStatData = (await this.unwrap(this.client.pullrequests.getDiffStat({ repo_slug: repo, workspace: owner, pull_request_id: prNumber.toString() }))).data;
        let linesRemoved = 0, linesAdded = 0;
        diffStatData.values.forEach((val) => {
            linesRemoved += val.lines_removed;
            linesAdded += val.lines_added;
        });
        return {
            additions: linesAdded,
            deletions: linesRemoved,
            changes: linesAdded + linesRemoved,
        };
    }
    async paginateCommits(params) {
        let response = await this.unwrap(this.client.repositories.listCommits(params));
        let values = response.data.values;
        while (this.client.hasNextPage(response.data)) {
            response = await this.unwrap(this.client.request(response.data.next, params));
            values = values.concat(response.data.values);
        }
        return values;
    }
    unwrap(clientPromise) {
        return clientPromise
            .then((response) => {
            this.debugBitbucketResponse(response);
            return response;
        })
            .catch((error) => {
            if (error.response) {
                debug(`${error.response.status} => ${util_1.inspect(error.response.data)}`);
            }
            else {
                debug(util_1.inspect(error));
            }
            throw error;
        });
    }
    getPagination(data) {
        const hasNextPage = !!data.next;
        const hasPreviousPage = !!data.previous;
        const page = data.page;
        const perPage = data.values && data.values.length;
        const totalCount = data.values && data.values.length;
        return { totalCount, hasNextPage, hasPreviousPage, page, perPage };
    }
};
BitbucketService = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.Types.ArgumentsProvider)),
    __param(1, inversify_1.inject(types_1.Types.RepositoryConfig)),
    __metadata("design:paramtypes", [Object, Object])
], BitbucketService);
exports.BitbucketService = BitbucketService;
//# sourceMappingURL=BitbucketService.js.map