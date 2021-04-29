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
exports.GitLabService = void 0;
const inversify_1 = require("inversify");
const lodash_1 = __importDefault(require("lodash"));
const util_1 = require("util");
const utils_1 = require("../../detectors/utils");
const cache_1 = require("../../scanner/cache");
const types_1 = require("../../types");
const VCSServicesUtils_1 = require("../git/VCSServicesUtils");
const gitlabUtils_1 = require("./gitlabClient/gitlabUtils");
let GitLabService = class GitLabService {
    constructor(argumentsProvider, repositoryConfig) {
        this.callCount = 0;
        /**
         * Debug GitLab response
         * - count API calls and inform about remaining rate limit
         */
        this.debugGitLabResponse = (response) => {
            this.callCount++;
            this.d(`GitLab API Hit: ${this.callCount}. Remaining ${response.headers['RateLimit-Remaining']} hits.`);
        };
        this.d = utils_1.debugLog('cli:services:git:gitlab-service');
        this.argumentsProvider = argumentsProvider;
        this.repositoryConfig = repositoryConfig;
        this.host = repositoryConfig.host;
        this.cache = new cache_1.InMemoryCache();
        this.client = new gitlabUtils_1.GitLabClient({
            token: this.argumentsProvider.auth,
            host: this.repositoryConfig.baseUrl,
        });
    }
    purgeCache() {
        this.cache.purge();
    }
    async checkVersion() {
        return (await this.client.Version.check()).data;
    }
    getRepo(owner, repo) {
        return this.unwrap(this.client.Projects.get(`${owner}/${repo}`));
    }
    /**
     * Lists all pull requests in the repo.
     */
    async listPullRequests(owner, repo, options) {
        var _a;
        const state = VCSServicesUtils_1.VCSServicesUtils.getGitLabPRState((_a = options === null || options === void 0 ? void 0 : options.filter) === null || _a === void 0 ? void 0 : _a.state);
        const { data, pagination } = await this.unwrap(this.client.MergeRequests.list(`${owner}/${repo}`, {
            pagination: options === null || options === void 0 ? void 0 : options.pagination,
            filter: { state },
        }));
        const user = await this.getUserInfo(owner);
        const items = await Promise.all(data.map(async (val) => {
            var _a, _b;
            const pullRequest = {
                user: {
                    id: val.author.id.toString(),
                    login: val.author.username,
                    url: val.author.web_url,
                },
                title: val.title,
                url: val.web_url,
                body: val.description,
                sha: val.sha,
                createdAt: val.created_at.toString(),
                updatedAt: val.updated_at.toString(),
                closedAt: val.closed_at ? (_a = val.closed_at) === null || _a === void 0 ? void 0 : _a.toString() : null,
                mergedAt: val.merged_at ? (_b = val.merged_at) === null || _b === void 0 ? void 0 : _b.toString() : null,
                state: val.state,
                id: val.iid,
                base: {
                    repo: {
                        url: `${this.host}/${owner}/${repo}`,
                        name: repo,
                        id: val.project_id.toString(),
                        owner: user,
                    },
                },
            };
            // Get number of changes, additions and deletions in PullRequest if the withDiffStat is true
            if (options === null || options === void 0 ? void 0 : options.withDiffStat) {
                //TODO
                // https://gitlab.com/gitlab-org/gitlab/issues/206904
                const lines = await this.getPullsDiffStat(owner, repo, val.iid);
                return Object.assign(Object.assign({}, pullRequest), { lines });
            }
            return pullRequest;
        }));
        const customPagination = this.getPagination(pagination);
        return Object.assign({ items }, customPagination);
    }
    /**
     * Get a single pull request.
     */
    async getPullRequest(owner, repo, prNumber, withDiffStat) {
        var _a, _b;
        const { data } = await this.unwrap(this.client.MergeRequests.get(`${owner}/${repo}`, prNumber));
        const user = await this.getUserInfo(owner);
        const pullRequest = {
            user: {
                id: data.author.id.toString(),
                login: data.author.username,
                url: data.author.web_url,
            },
            title: data.title,
            url: data.web_url,
            sha: data.sha,
            createdAt: data.created_at.toString(),
            updatedAt: data.updated_at.toString(),
            closedAt: data.closed_at ? (_a = data.closed_at) === null || _a === void 0 ? void 0 : _a.toString() : null,
            mergedAt: data.merged_at ? (_b = data.merged_at) === null || _b === void 0 ? void 0 : _b.toString() : null,
            state: data.state,
            id: data.iid,
            base: {
                repo: {
                    url: `${this.host}/${owner}/${repo}`,
                    name: repo,
                    id: data.project_id.toString(),
                    owner: user,
                },
            },
        };
        if (withDiffStat) {
            const lines = await this.getPullsDiffStat(owner, repo, prNumber);
            return Object.assign(Object.assign({}, pullRequest), { lines });
        }
        return pullRequest;
    }
    async listPullRequestFiles(owner, repo, prNumber) {
        throw new Error('Method not implemented yet.');
    }
    async listPullCommits(owner, repo, prNumber, options) {
        const { data, pagination } = await this.unwrap(this.client.MergeRequests.listCommits(`${owner}/${repo}`, prNumber, options === null || options === void 0 ? void 0 : options.pagination));
        const items = await Promise.all(data.map(async (val) => {
            const commitDetail = await this.unwrap(this.client.Commits.get(`${owner}/${repo}`, val.id));
            const commit = {
                sha: val.id,
                commit: {
                    url: `${this.host}/${owner}/${repo}/merge_requests/${prNumber}/diffs?commit_id=${val.id}`,
                    message: val.message,
                    author: {
                        name: val.author_name,
                        email: val.author_email,
                        date: val.created_at.toString(),
                    },
                    tree: {
                        sha: commitDetail.data.parent_ids[0],
                        url: `${this.host}/${owner}/${repo}/merge_requests/${prNumber}/diffs?commit_id=${commitDetail.data.parent_ids[0]}`,
                    },
                    //TODO
                    verified: false,
                },
            };
            return commit;
        }));
        const customPagination = this.getPagination(pagination);
        return Object.assign({ items }, customPagination);
    }
    async listIssues(owner, repo, options) {
        var _a;
        const state = VCSServicesUtils_1.VCSServicesUtils.getGitLabIssueState((_a = options === null || options === void 0 ? void 0 : options.filter) === null || _a === void 0 ? void 0 : _a.state);
        const { data, pagination } = await this.unwrap(this.client.Issues.list(`${owner}/${repo}`, {
            pagination: options === null || options === void 0 ? void 0 : options.pagination,
            filter: { state },
        }));
        const user = await this.getUserInfo(owner);
        const items = data.map((val) => {
            var _a;
            return ({
                user: user,
                url: val.web_url,
                body: val.description,
                createdAt: val.created_at.toString(),
                updatedAt: val.updated_at.toString(),
                closedAt: val.closed_at ? (_a = val.closed_at) === null || _a === void 0 ? void 0 : _a.toString() : null,
                state: val.state,
                id: val.iid,
            });
        });
        const customPagination = this.getPagination(pagination);
        return Object.assign({ items }, customPagination);
    }
    async getIssue(owner, repo, issueNumber) {
        const { data } = await this.unwrap(this.client.Issues.get(`${owner}/${repo}`, issueNumber));
        return {
            id: data.iid,
            user: {
                login: data.author.username,
                id: data.author.id.toString(),
                url: data.author.web_url,
            },
            url: data.web_url,
            body: data.description,
            createdAt: data.created_at.toString(),
            updatedAt: data.updated_at.toString(),
            closedAt: data.closed_at ? data.closed_at.toString() : null,
            state: data.state,
        };
    }
    async listIssueComments(owner, repo, issueNumber, options) {
        const { data, pagination } = await this.unwrap(this.client.Issues.listComments(`${owner}/${repo}`, issueNumber, options === null || options === void 0 ? void 0 : options.pagination));
        const items = data.map((val) => ({
            user: {
                id: val.author.id.toString(),
                login: val.author.username,
                url: val.author.web_url,
            },
            url: `${this.host}/projects/${owner}/${repo}/notes/${val.id}`,
            // https://docs.gitlab.com/ee/api/notes.html
            body: val.body,
            createdAt: val.created_at.toString(),
            updatedAt: val.updated_at.toString(),
            authorAssociation: val.author.username,
            id: val.id,
        }));
        const customPagination = this.getPagination(pagination);
        return Object.assign({ items }, customPagination);
    }
    async listBranches(owner, repo, options) {
        const { data, pagination } = await this.unwrap(this.client.Branches.list(`${owner}/${repo}`, options === null || options === void 0 ? void 0 : options.pagination));
        const customPagination = this.getPagination(pagination);
        const items = data.map((val) => (Object.assign(Object.assign({}, val), { type: val.default ? 'default' : 'unknown' })));
        return Promise.resolve(Object.assign({ items }, customPagination));
    }
    async listPullRequestReviews(owner, repo, prNumber) {
        throw new Error('Method not implemented yet.');
    }
    async listRepoCommits(owner, repo, options) {
        const { data, pagination } = await this.unwrap(this.client.Commits.list(`${owner}/${repo}`, options === null || options === void 0 ? void 0 : options.pagination));
        const items = data.map((val) => {
            return {
                sha: val.id,
                url: `${this.host}/projects/${owner}/${repo}/repository/commits/${val.short_id}`,
                message: val.message,
                author: {
                    name: val.author_name,
                    email: val.author_email,
                    date: val.committed_date.toString(),
                },
                tree: {
                    sha: val.parent_ids[0],
                    url: `${this.host}/projects/${owner}/${repo}/repository/commits/${val.parent_ids[0]}`,
                },
                // TODO
                verified: false,
            };
        });
        const customPagination = this.getPagination(pagination);
        return Object.assign({ items }, customPagination);
    }
    async getCommit(owner, repo, commitSha) {
        const { data } = await this.unwrap(this.client.Commits.get(`${owner}/${repo}`, commitSha));
        return {
            sha: data.id,
            url: `${this.host}/projects/${owner}/${repo}/repository/commits/${data.short_id}`,
            message: data.message,
            author: {
                name: data.author_name,
                email: data.author_email,
                date: data.committed_date.toString(),
            },
            tree: {
                sha: data.parent_ids[0],
                url: `${this.host}/projects/${owner}/${repo}/repository/commits/${data.parent_ids[0]}`,
            },
            // TODO
            verified: false,
        };
    }
    /**
     * List Comments for a Pull Request
     */
    async listPullRequestComments(owner, repo, prNumber, options) {
        const { data, pagination } = await this.unwrap(this.client.MergeRequests.listComments(`${owner}/${repo}`, prNumber, options === null || options === void 0 ? void 0 : options.pagination));
        const items = data.map((val) => ({
            user: { id: val.author.id.toString(), login: val.author.username, url: val.author.web_url },
            id: val.id,
            url: `${this.host}/projects/${owner}/${repo}/merge_requests/${prNumber}/notes`,
            body: val.body,
            createdAt: val.created_at.toString(),
            updatedAt: val.updated_at.toString(),
            authorAssociation: val.author.username,
        }));
        const customPagination = this.getPagination(pagination);
        return Object.assign({ items }, customPagination);
    }
    /**
     * Add Comment to a Pull Request
     */
    async createPullRequestComment(owner, repo, prNumber, body) {
        const { data } = await this.unwrap(this.client.MergeRequests.createComment(`${owner}/${repo}`, prNumber, body));
        return {
            user: { id: `${data.author.id}`, login: data.author.username, url: data.author.web_url },
            id: data.id,
            url: `${this.host}/projects/${owner}/${repo}/merge_requests/${prNumber}/notes`,
            body: data.body,
            createdAt: data.created_at.toString(),
            updatedAt: data.updated_at.toString(),
        };
    }
    /**
     * Update Comment on a Pull Request
     */
    async updatePullRequestComment(owner, repo, commentId, body, pullRequestId) {
        const { data } = await this.unwrap(this.client.MergeRequests.updateComment(`${owner}/${repo}`, pullRequestId, body, commentId));
        return {
            user: { id: `${data.author.id}`, login: data.author.username, url: data.author.web_url },
            id: data.id,
            url: `${this.host}/projects/${owner}/${repo}/merge_requests/${pullRequestId}/notes`,
            body: data.body,
            createdAt: data.created_at.toString(),
            updatedAt: data.updated_at.toString(),
        };
    }
    async listRepos() {
        const { data } = await this.unwrap(this.client.Projects.list());
        return data;
    }
    async listGroups() {
        const { data } = await this.unwrap(this.client.Users.listGroups());
        return data;
    }
    async listContributors(owner, repo, options) {
        const contributors = await this.getAllContributors(`${owner}/${repo}`, options === null || options === void 0 ? void 0 : options.pagination);
        //get user info and create contributor object
        return Promise.all(contributors
            //filter duplicate committer names or committer emails - we want to make sure that we don't count some contributor twice
            .filter((contributor, index, array) => array.findIndex((c) => {
            return c.name === contributor.name || c.email === contributor.email;
        }) === index)
            //get user info and create contributor object
            .map(async (contributor) => {
            return {
                user: (await this.searchUser(contributor.email, contributor.name)) || {
                    login: contributor.name,
                },
                //count real number of commits
                contributions: contributors.filter((c) => c.name === contributor.name).reduce((sum, c) => sum + c.commits, 0),
            };
        }));
    }
    async getAllContributors(projectId, pagination) {
        let response = await this.unwrap(this.client.Contributors.list(projectId, pagination));
        let data = response.data;
        while (response.pagination.next) {
            const updatedPagination = lodash_1.default.merge(pagination, { page: response.pagination.next });
            response = await this.unwrap(this.client.Contributors.list(projectId, updatedPagination));
            data = data.concat(response.data);
        }
        return data;
    }
    async listContributorsStats(owner, repo) {
        throw new Error('Method not implemented yet.');
    }
    async getRepoContent(owner, repo, path) {
        throw new Error('Method not implemented yet.');
    }
    async getPullsDiffStat(owner, repo, prNumber) {
        throw new Error('Method not implemented yet for GitLab.');
    }
    async getUserInfo(owner) {
        let userInfo;
        try {
            userInfo = await this.unwrap(this.client.Users.getUser(owner));
            return {
                id: userInfo.data[0].id.toString(),
                login: userInfo.data[0].username,
                url: userInfo.data[0].web_url,
            };
        }
        catch (error) {
            userInfo = await this.unwrap(this.client.Users.getGroup(owner));
            return {
                id: userInfo.data.id.toString(),
                login: userInfo.data.name,
                url: userInfo.data.web_url,
            };
        }
    }
    async searchUser(email, name) {
        let userInfo;
        try {
            userInfo = await this.unwrap(this.client.Users.searchUsersByEmail(email));
            if (userInfo.data.length === 0) {
                userInfo = await this.unwrap(this.client.Users.searchUsersByName(name));
            }
            return {
                id: userInfo.data[0].id.toString(),
                login: userInfo.data[0].username,
                url: userInfo.data[0].web_url,
            };
        }
        catch (error) {
            return;
        }
    }
    getPagination(pagination) {
        const hasNextPage = !!pagination.next;
        const hasPreviousPage = !!pagination.previous;
        const page = pagination.current;
        const perPage = pagination.perPage;
        let totalCount = pagination.total;
        if (Number.isNaN(totalCount)) {
            // If the number of resources is more than 10,000, the X-Total is not present in the response headers.
            // https://docs.gitlab.com/ee/api/#other-pagination-headers
            totalCount = 10000;
        }
        return { totalCount, hasNextPage, hasPreviousPage, page, perPage };
    }
    /**
     * Debug GitLab request promise
     */
    unwrap(clientPromise) {
        return clientPromise
            .then((response) => {
            this.debugGitLabResponse(response);
            return response;
        })
            .catch((error) => {
            if (error.response) {
                this.d(`${error.response.status} => ${util_1.inspect(error.response.data)}`);
            }
            else {
                this.d(util_1.inspect(error));
            }
            throw error;
        });
    }
};
GitLabService = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.Types.ArgumentsProvider)),
    __param(1, inversify_1.inject(types_1.Types.RepositoryConfig)),
    __metadata("design:paramtypes", [Object, Object])
], GitLabService);
exports.GitLabService = GitLabService;
//# sourceMappingURL=GitLabService.js.map