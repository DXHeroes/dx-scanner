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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollaborationInspector = void 0;
const inversify_1 = require("inversify");
const cache_1 = require("../scanner/cache");
const types_1 = require("../types");
let CollaborationInspector = class CollaborationInspector {
    constructor(service) {
        this.service = service;
        this.cache = new cache_1.InMemoryCache();
    }
    purgeCache() {
        this.cache.purge();
    }
    async listPullRequests(owner, repo, options) {
        return this.cache.getOrSet(`CollaborationInspector:listPullRequests:${owner}:${repo}:${JSON.stringify(options)}`, async () => {
            return this.service.listPullRequests(owner, repo, options);
        });
    }
    async getPullRequest(owner, repo, prNumber, withDiffStat) {
        return this.cache.getOrSet(`CollaborationInspector:getPullRequest:${owner}:${repo}:${prNumber}:${withDiffStat}`, async () => {
            return this.service.getPullRequest(owner, repo, prNumber, withDiffStat);
        });
    }
    //TODO add options
    async listPullRequestFiles(owner, repo, prNumber) {
        return this.cache.getOrSet(`CollaborationInspector:listPullRequestFiles:${owner}:${repo}:${prNumber}`, async () => {
            return this.service.listPullRequestFiles(owner, repo, prNumber);
        });
    }
    async listPullCommits(owner, repo, prNumber, options) {
        return this.cache.getOrSet(`CollaborationInspector:listPullCommits:${owner}:${repo}:${prNumber}:${JSON.stringify(options)}`, async () => {
            return this.service.listPullCommits(owner, repo, prNumber, options);
        });
    }
    async listRepoCommits(owner, repo, options) {
        return this.cache.getOrSet(`CollaborationInspector:listRepoCommits:${owner}:${repo}:${JSON.stringify(options)}`, async () => {
            return this.service.listRepoCommits(owner, repo, options);
        });
    }
    async getPullsDiffStat(owner, repo, prNumber) {
        return this.cache.getOrSet(`CollaborationInspector:getPullsDiffStat:${owner}:${repo}:${prNumber}`, async () => {
            return this.service.getPullsDiffStat(owner, repo, prNumber);
        });
    }
};
CollaborationInspector = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.Types.IContentRepositoryBrowser)),
    __metadata("design:paramtypes", [Object])
], CollaborationInspector);
exports.CollaborationInspector = CollaborationInspector;
//# sourceMappingURL=CollaborationInspector.js.map