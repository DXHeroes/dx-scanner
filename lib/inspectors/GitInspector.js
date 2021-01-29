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
exports.GitInspector = void 0;
const errors_1 = require("../lib/errors");
const promise_1 = __importDefault(require("simple-git/promise"));
const lodash_1 = require("lodash");
const inversify_1 = require("inversify");
const types_1 = require("../types");
const Paginated_1 = require("./common/Paginated");
/**
 * A Git repository inspector.
 */
let GitInspector = class GitInspector {
    /**
     * Create an instance of GitInspector.
     *
     * @param repoPath A path to the repository to be inspected.
     */
    constructor(repoPath) {
        this.git = promise_1.default(repoPath);
    }
    /**
     * Get commits in the repository.
     *
     * @param options Options specifying a subset of all the repository commits.
     * @returns The specified commits.
     * @throws Throws an arror if there are no commits in the repository (the path does not exist, the path is not a repository, no commits in the repository) or if sorting is required.
     */
    async getCommits(options) {
        if (options.sort !== undefined) {
            throw errors_1.ErrorFactory.newInternalError('sorting not implemented');
        }
        const logOptions = {
            multiLine: 'true',
        };
        if (options.filter !== undefined) {
            if (options.filter.author !== undefined) {
                logOptions['--author'] = options.filter.author;
            }
            if (options.filter.since !== undefined) {
                logOptions['--since'] = options.filter.since.toString();
            }
            if (options.filter.until !== undefined) {
                logOptions['--until'] = options.filter.until.toString();
            }
        }
        // a workaround for https://github.com/steveukx/git-js/issues/389
        if (options.filter !== undefined) {
            if (options.filter.sha !== undefined) {
                logOptions[`${options.filter.sha}...HEAD`] = null;
            }
            if (options.filter.path !== undefined) {
                logOptions['--'] = null;
                logOptions[options.filter.path] = null;
            }
        }
        const log = await this.git.log(logOptions);
        return Paginated_1.paginate(log.all.map((commit) => {
            return {
                sha: commit.hash,
                date: new Date(commit.date),
                message: commit.body,
                author: { name: commit.author_name, email: commit.author_email },
                commiter: undefined,
            };
        }), options.pagination);
    }
    /**
     * Get authors in the repository.
     *
     * @param options Options specifying a subset of all the repository authors.
     * @returns The specified authors.
     * @throws Throws an arror if there are no commits in the repository (the path does not exist, the path is not a repository, no commits in the repository) or if filtering or sorting is required.
     */
    async getAuthors(options) {
        if (options.filter !== undefined || options.sort !== undefined) {
            throw errors_1.ErrorFactory.newInternalError('filtering and sorting not implemented');
        }
        const commits = await this.getCommits({});
        const items = lodash_1.uniqWith(commits.items.map((commit) => commit.author), lodash_1.isEqual);
        return Paginated_1.paginate(items, options.pagination);
    }
    /**
     * Get tags in the repository.
     *
     * @returns The tags.
     * @throws Throws an error if there is no repository (the path does not exist, the path is not a repository).
     */
    async getAllTags() {
        const tags = await this.git.tags();
        return Promise.all(tags.all.map(async (tag) => {
            return {
                tag,
                commit: await this.git.revparse([tag]),
            };
        }));
    }
    async getStatus() {
        return this.git.status();
    }
};
GitInspector = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.Types.RepositoryPath)),
    __metadata("design:paramtypes", [String])
], GitInspector);
exports.GitInspector = GitInspector;
//# sourceMappingURL=GitInspector.js.map