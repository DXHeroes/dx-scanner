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
exports.GitHubService = void 0;
const graphql_1 = require("@octokit/graphql");
const rest_1 = require("@octokit/rest");
const debug_1 = __importDefault(require("debug"));
const inversify_1 = require("inversify");
const util_1 = require("util");
const delay_1 = require("../../lib/delay");
const errors_1 = require("../../lib/errors");
const InMemoryCache_1 = require("../../scanner/cache/InMemoryCache");
const types_1 = require("../../types");
const listPullRequests_1 = require("./gqlQueries/listPullRequests");
const model_1 = require("./model");
const VCSServicesUtils_1 = require("./VCSServicesUtils");
const debug = debug_1.default('cli:services:git:github-service');
let GitHubService = class GitHubService {
    constructor(argumentsProvider, repositoryConfig) {
        this.callCount = 0;
        /**
         * Debug GitHub REST response
         * - count API calls and inform about remaining rate limit
         */
        this.debugGitHubResponse = (response) => {
            this.callCount++;
            debug(`GitHub API Hit: ${this.callCount}. Remaining ${response.headers['x-ratelimit-remaining']} hits. (${response.headers.link})`);
        };
        /**
         * Debug GitHub GQL response
         * - count API calls and inform about remaining rate limit
         */
        this.debugGitHubGqlResponse = (rateLimit) => {
            this.callCount += rateLimit.cost;
            debug(`GitHub API Hit: ${this.callCount}. Remaining ${rateLimit.remaining} hits. Reset at ${rateLimit.resetAt}`);
        };
        this.cache = new InMemoryCache_1.InMemoryCache();
        this.repositoryConfig = repositoryConfig;
        this.client = new rest_1.Octokit({
            auth: argumentsProvider.auth,
        });
        this.graphqlWithAuth = graphql_1.graphql.defaults({ headers: { authorization: `token ${argumentsProvider.auth}` } });
    }
    purgeCache() {
        this.cache.purge();
    }
    /**
     * The parent and source objects are present when the repository is a fork.
     *
     * 'parent' is the repository this repository was forked from.
     * 'source' is the ultimate source for the network.
     */
    getRepo(owner, repo) {
        return this.unwrap(this.client.repos.get({ owner, repo }));
    }
    /**
     * Lists all pull requests in the repo using GraphQL.
     */
    async listPullRequests(owner, repo, options) {
        var _a, _b;
        const state = VCSServicesUtils_1.VCSServicesUtils.getGithubGqlPRState((_a = options === null || options === void 0 ? void 0 : options.filter) === null || _a === void 0 ? void 0 : _a.state);
        let hasNextPage = true;
        let pullRequests;
        let items = [];
        const lastMonth = new Date();
        lastMonth.setMonth(new Date().getMonth() - 1);
        const queryParams = {
            count: ((_b = options === null || options === void 0 ? void 0 : options.pagination) === null || _b === void 0 ? void 0 : _b.perPage) || 100,
        };
        while (hasNextPage) {
            const { search } = await this.unwrapGql(this.graphqlWithAuth(listPullRequests_1.listPullRequestsQuery(listPullRequests_1.generateSearchQuery(owner, repo, lastMonth, state)), Object.assign({}, queryParams)));
            pullRequests = search;
            const prs = pullRequests.edges.map((pr) => {
                var _a, _b, _c, _d;
                const pullRequest = {
                    user: {
                        // author can be null if the user have been deleted
                        id: (_a = pr.node.author) === null || _a === void 0 ? void 0 : _a.id,
                        login: (_b = pr.node.author) === null || _b === void 0 ? void 0 : _b.login,
                        url: (_c = pr.node.author) === null || _c === void 0 ? void 0 : _c.url,
                    },
                    title: pr.node.title,
                    url: pr.node.url,
                    sha: ((_d = pr.node.mergeCommit) === null || _d === void 0 ? void 0 : _d.id) || null,
                    createdAt: pr.node.createdAt,
                    updatedAt: pr.node.updatedAt,
                    closedAt: pr.node.closedAt,
                    mergedAt: pr.node.mergedAt,
                    state: pr.node.state,
                    id: pr.node.number,
                    base: {
                        repo: {
                            url: pr.node.baseRepository.url,
                            name: pr.node.baseRepository.name,
                            id: pr.node.baseRepository.id,
                            owner: {
                                url: pr.node.baseRepository.owner.url,
                                id: pr.node.baseRepository.owner.id,
                                login: pr.node.baseRepository.owner.login,
                            },
                        },
                    },
                    lines: { additions: pr.node.additions, deletions: pr.node.deletions, changes: pr.node.additions + pr.node.deletions },
                };
                return pullRequest;
            });
            hasNextPage = pullRequests.pageInfo.hasNextPage;
            queryParams.startCursor = pullRequests.pageInfo.endCursor;
            items = items.concat(prs);
        }
        const pagination = this.getPagination(items.length, undefined, pullRequests.pageInfo.hasNextPage, pullRequests.pageInfo.hasPreviousPage);
        return Object.assign({ items }, pagination);
    }
    /**
     * Get a single pull request.
     */
    async getPullRequest(owner, repo, prNumber, withDiffStat) {
        const response = await this.unwrap(this.client.pulls.get({ owner, repo, pull_number: prNumber }));
        const pullRequest = {
            user: {
                id: response.data.user.id.toString(),
                login: response.data.user.login,
                url: response.data.user.url,
            },
            title: response.data.title,
            url: response.data.url,
            body: response.data.body,
            sha: response.data.merge_commit_sha,
            createdAt: response.data.created_at,
            updatedAt: response.data.updated_at,
            closedAt: response.data.closed_at,
            mergedAt: response.data.merged_at,
            state: response.data.state,
            id: response.data.number,
            base: {
                repo: {
                    url: response.data.base.repo.url,
                    name: response.data.base.repo.name,
                    id: response.data.base.repo.id.toString(),
                    owner: {
                        url: response.data.base.repo.owner.url,
                        id: response.data.base.repo.owner.id.toString(),
                        login: response.data.base.repo.owner.login,
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
    /**
     * Lists all reviews on pull request in the repo.
     */
    async listPullRequestReviews(owner, repo, prNumber) {
        const { data, headers } = await this.unwrap(this.client.pulls.listReviews({ owner, repo, pull_number: prNumber }));
        const items = data.map((val) => ({
            user: {
                id: val.user.id.toString(),
                login: val.user.login,
                url: val.user.url,
            },
            id: val.id,
            body: val.body,
            state: val.state,
            url: val.pull_request_url,
        }));
        const pagination = this.getPagination(data.length, headers.link);
        return Object.assign({ items }, pagination);
    }
    /**
     * Lists commits in the repository.
     *
     * The response will include a verification object that describes the result of verifying the commit's signature.
     * To see the included fields in the verification object see https://octokit.github.io/rest.js/#pagination.
     *
     * Sha can be SHA or branch name.
     */
    async listRepoCommits(owner, repo, options) {
        const { data, headers } = await this.unwrap(this.client.repos.listCommits(Object.assign({ owner,
            repo }, options === null || options === void 0 ? void 0 : options.pagination)));
        const items = data.map((val) => ({
            sha: val.sha,
            url: val.url,
            message: val.commit.message,
            author: {
                name: val.commit.author.name,
                email: val.commit.author.email,
                date: val.commit.author.date,
            },
            tree: {
                sha: val.commit.tree.sha,
                url: val.commit.tree.url,
            },
            verified: val.commit.verification.verified,
        }));
        const pagination = this.getPagination(data.length, headers.link);
        return Object.assign({ items }, pagination);
    }
    /**
     * Get the Commit of the given commit_sha in the repo.
     */
    async getCommit(owner, repo, commitSha) {
        const response = await this.unwrap(this.client.git.getCommit({ owner, repo, commit_sha: commitSha }));
        return {
            sha: response.data.sha,
            url: response.data.url,
            message: response.data.message,
            author: {
                name: response.data.author.name,
                email: response.data.author.email,
                date: response.data.author.date,
            },
            tree: {
                sha: response.data.tree.sha,
                url: response.data.tree.url,
            },
            verified: response.data.verification.verified,
        };
    }
    /**
     * Lists contributors to the specified repository and sorts them by the number of commits per contributor in descending order.
     */
    async listContributors(owner, repo) {
        const contributors = await this.client.paginate(this.client.repos.listContributors, { owner, repo }, (response) => {
            this.debugGitHubResponse(response);
            return response.data;
        });
        return contributors.map((contributor) => ({
            user: {
                id: contributor.id.toString(),
                login: contributor.login,
                url: contributor.url,
            },
            contributions: contributor.contributions,
        }));
    }
    /**
     * total - The Total number of commits authored by the contributor.
     *  Weekly Hash (weeks array):
     *
     *    w - Start of the week, given as a Unix timestamp.
     *    a - Number of additions
     *    d - Number of deletions
     *    c - Number of commits
     */
    async listContributorsStats(owner, repo) {
        // Wait for GitHub stats to be recomputed
        await this.unwrap(this.client.repos.getContributorsStats({ owner, repo }).then((r) => {
            if (r.status === 202) {
                debug('Waiting for GitHub stats to be recomputed');
                return delay_1.delay(10000).then(() => r);
            }
            else {
                return r;
            }
        }));
        const { data, headers } = await this.unwrap(this.client.repos.getContributorsStats({ owner, repo }));
        const items = data.map((val) => ({
            author: {
                id: val.author.id.toString(),
                login: val.author.login,
                url: val.author.url,
            },
            total: val.total,
            weeks: val.weeks.map((val) => ({
                startOfTheWeek: val.w,
                additions: val.a,
                deletions: val.d,
                commits: val.c,
            })),
        }));
        const pagination = this.getPagination(data.length, headers.link);
        return Object.assign({ items }, pagination);
    }
    /**
     * Gets the contents of a file or directory in a repository.
     */
    async getRepoContent(owner, repo, path) {
        const key = `${owner}:${repo}:content:${path}`;
        return this.cache.getOrSet(key, async () => {
            let response;
            try {
                response = await this.unwrap(this.client.repos.getContent({ owner, repo, path }));
            }
            catch (e) {
                if (e.name !== 'HttpError' || e.status !== 404) {
                    throw e;
                }
                return null;
            }
            if (Array.isArray(response.data)) {
                return response.data.map((item) => ({
                    name: item.name,
                    path: item.path,
                    sha: item.sha,
                    size: item.size,
                    type: item.type,
                }));
            }
            else if (response.data.type === model_1.RepoContentType.file) {
                return {
                    name: response.data.name,
                    path: response.data.path,
                    size: response.data.size,
                    sha: response.data.sha,
                    type: response.data.type,
                    content: response.data.content,
                    encoding: response.data.encoding,
                };
            }
            else if (response.data.type === model_1.RepoContentType.symlink) {
                return {
                    name: response.data.name,
                    path: response.data.path,
                    size: response.data.size,
                    sha: response.data.sha,
                    type: response.data.type,
                    target: `${response.data.target}`,
                };
            }
            else {
                throw errors_1.ErrorFactory.newInternalError('Unexpected response');
            }
        });
    }
    /**
     * List all issues in the repo.
     */
    async listIssues(owner, repo, options) {
        var _a, _b, _c;
        const params = { owner, repo };
        const state = VCSServicesUtils_1.VCSServicesUtils.getGithubIssueState((_a = options === null || options === void 0 ? void 0 : options.filter) === null || _a === void 0 ? void 0 : _a.state);
        if ((_b = options === null || options === void 0 ? void 0 : options.pagination) === null || _b === void 0 ? void 0 : _b.page)
            params.page = options.pagination.page;
        if ((_c = options === null || options === void 0 ? void 0 : options.pagination) === null || _c === void 0 ? void 0 : _c.perPage)
            params.per_page = options.pagination.perPage;
        if (state)
            params.state = state;
        const { data, headers } = await this.unwrap(this.client.issues.listForRepo(params));
        const items = data.map((val) => ({
            user: {
                id: val.user.id.toString(),
                login: val.user.login,
                url: val.user.url,
            },
            url: val.url,
            body: val.body,
            createdAt: val.created_at,
            updatedAt: val.updated_at,
            closedAt: val.closed_at,
            state: val.state,
            id: val.id,
            pullRequestUrl: val.pull_request && val.pull_request.url,
        }));
        const pagination = this.getPagination(data.length, headers.link);
        return Object.assign({ items }, pagination);
    }
    /**
     * Get a single issue in the repo.
     */
    async getIssue(owner, repo, issueNumber) {
        const response = await this.unwrap(this.client.issues.get({ owner, repo, issue_number: issueNumber }));
        return {
            id: response.data.id,
            user: {
                login: response.data.user.login,
                id: response.data.user.id.toString(),
                url: response.data.user.url,
            },
            url: response.data.url,
            body: response.data.body,
            createdAt: response.data.created_at,
            updatedAt: response.data.updated_at,
            closedAt: response.data.closed_at,
            state: response.data.state,
        };
    }
    /**
     * Get All Comments for an Issue
     */
    async listIssueComments(owner, repo, issueNumber, options) {
        var _a, _b;
        const params = { owner, repo, issue_number: issueNumber };
        if ((_a = options === null || options === void 0 ? void 0 : options.pagination) === null || _a === void 0 ? void 0 : _a.page)
            params.page = options.pagination.page;
        if ((_b = options === null || options === void 0 ? void 0 : options.pagination) === null || _b === void 0 ? void 0 : _b.perPage)
            params.per_page = options.pagination.perPage;
        const { data, headers } = await this.unwrap(this.client.issues.listComments(params));
        const items = data.map((val) => ({
            user: {
                id: val.user.id.toString(),
                login: val.user.login,
                url: val.user.url,
            },
            url: val.url,
            body: val.body,
            createdAt: val.created_at,
            updatedAt: val.updated_at,
            authorAssociation: val.user.login,
            id: val.id,
        }));
        const pagination = this.getPagination(data.length, headers.link);
        return Object.assign({ items }, pagination);
    }
    async listBranches(owner, repo, options) {
        const [branchesResponse, repoResponse] = await Promise.all([
            this.unwrap(this.client.repos.listBranches({ owner, repo })),
            this.unwrap(this.client.repos.get({ owner, repo })),
        ]);
        const { data, headers } = branchesResponse;
        const items = data.map((val) => ({
            name: val.name,
            type: repoResponse.data.default_branch === val.name ? 'default' : 'unknown',
        }));
        const pagination = this.getPagination(data.length, headers.link);
        return Object.assign({ items }, pagination);
    }
    /**
     * Lists all pull request files.
     */
    async listPullRequestFiles(owner, repo, prNumber) {
        const { data, headers } = await this.unwrap(this.client.pulls.listFiles({ owner, repo, pull_number: prNumber }));
        const items = data.map((val) => ({
            sha: val.sha,
            fileName: val.filename,
            status: val.status,
            additions: val.additions,
            deletions: val.deletions,
            changes: val.changes,
            contentsUrl: val.contents_url,
        }));
        const pagination = this.getPagination(data.length, headers.link);
        return Object.assign({ items }, pagination);
    }
    /**
     * Lists commits on a pull request.
     */
    async listPullCommits(owner, repo, prNumber, options) {
        var _a, _b;
        const params = { owner, repo, pull_number: prNumber };
        if ((_a = options === null || options === void 0 ? void 0 : options.pagination) === null || _a === void 0 ? void 0 : _a.page)
            params.page = options.pagination.page;
        if ((_b = options === null || options === void 0 ? void 0 : options.pagination) === null || _b === void 0 ? void 0 : _b.perPage)
            params.per_page = options.pagination.perPage;
        const { data, headers } = await this.unwrap(this.client.pulls.listCommits(params));
        const items = data.map((val) => ({
            sha: val.sha,
            commit: {
                url: val.commit.url,
                message: val.commit.message,
                author: {
                    name: val.commit.author.name,
                    email: val.commit.author.email,
                    date: val.commit.author.date,
                },
                tree: {
                    sha: val.commit.tree.sha,
                    url: val.commit.tree.url,
                },
                verified: val.commit.verification.verified,
            },
        }));
        const pagination = this.getPagination(data.length, headers.link);
        return Object.assign({ items }, pagination);
    }
    /**
     * List Comments for a Pull Request
     */
    async listPullRequestComments(owner, repo, prNumber, options) {
        var _a, _b;
        const params = { owner, repo, issue_number: prNumber };
        if ((_a = options === null || options === void 0 ? void 0 : options.pagination) === null || _a === void 0 ? void 0 : _a.page)
            params.page = options.pagination.page;
        if ((_b = options === null || options === void 0 ? void 0 : options.pagination) === null || _b === void 0 ? void 0 : _b.perPage)
            params.per_page = options.pagination.perPage;
        // use issues.listComments to list comments for a pull request
        const { data, headers } = await this.unwrap(this.client.issues.listComments(params));
        const items = data.map((comment) => ({
            user: { id: comment.user.id.toString(), login: comment.user.login, url: comment.user.url },
            id: comment.id,
            url: comment.url,
            body: comment.body,
            createdAt: comment.created_at,
            updatedAt: comment.updated_at,
            authorAssociation: comment.user.login,
        }));
        const pagination = this.getPagination(data.length, headers.link);
        return Object.assign({ items }, pagination);
    }
    /**
     * Add Comment to a Pull Request
     */
    async createPullRequestComment(owner, repo, prNumber, body) {
        const response = await this.client.issues.createComment({
            owner,
            repo,
            issue_number: prNumber,
            body,
        });
        const comment = response.data;
        return {
            user: { id: comment.user.id.toString(), login: comment.user.login, url: comment.user.url },
            id: comment.id,
            url: comment.url,
            body: comment.body,
            createdAt: comment.created_at,
            updatedAt: comment.updated_at,
        };
    }
    /**
     * Update Comment on a Pull Request
     */
    async updatePullRequestComment(owner, repo, commentId, body) {
        const response = await this.client.issues.updateComment({
            owner,
            repo,
            comment_id: commentId,
            body,
        });
        const comment = response.data;
        return {
            user: { id: comment.user.id.toString(), login: comment.user.login, url: comment.user.url },
            id: comment.id,
            url: comment.url,
            body: comment.body,
            createdAt: comment.created_at,
            updatedAt: comment.updated_at,
        };
    }
    /**
     * Add additions, deletions and changes of pull request when the getPullRequests() is called with withDiffStat = true
     */
    async getPullsDiffStat(owner, repo, prNumber) {
        const response = await this.unwrap(this.client.pulls.get({ owner, repo, pull_number: prNumber }));
        return {
            additions: response.data.additions,
            deletions: response.data.deletions,
            changes: response.data.additions + response.data.deletions,
        };
    }
    getPagination(totalCount, link, hasNextPage, hasPreviousPage) {
        const parsedLink = VCSServicesUtils_1.VCSServicesUtils.parseGitHubHeaderLink(link);
        if (!parsedLink) {
            return {
                totalCount,
                hasNextPage: hasNextPage ? hasNextPage : false,
                hasPreviousPage: hasPreviousPage ? hasPreviousPage : false,
                page: 1,
                perPage: totalCount,
            };
        }
        else {
            return {
                totalCount: parsedLink.totalCount,
                hasNextPage: !!parsedLink.next,
                hasPreviousPage: !!parsedLink.prev,
                page: parsedLink.page,
                perPage: parsedLink.perPage,
            };
        }
    }
    /**
     * Debug GitHub request promise
     */
    unwrap(clientPromise) {
        return clientPromise
            .then((response) => {
            this.debugGitHubResponse(response);
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
    /**
     * Debug GitHub GQL request promise
     */
    unwrapGql(gqlPromise) {
        return gqlPromise
            .then((response) => {
            this.debugGitHubGqlResponse(response.rateLimit);
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
};
GitHubService = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.Types.ArgumentsProvider)),
    __param(1, inversify_1.inject(types_1.Types.RepositoryConfig)),
    __metadata("design:paramtypes", [Object, Object])
], GitHubService);
exports.GitHubService = GitHubService;
//# sourceMappingURL=GitHubService.js.map