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
exports.IssueTrackingInspector = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../types");
const cache_1 = require("../scanner/cache");
let IssueTrackingInspector = class IssueTrackingInspector {
    constructor(service) {
        this.service = service;
        this.cache = new cache_1.InMemoryCache();
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    purgeCache() {
        this.cache.purge();
    }
    async listIssues(owner, repo, options) {
        return this.cache.getOrSet(`IssueTrackingInspector:listIssues:${owner}:${repo}:${JSON.stringify(options)}`, async () => {
            return this.service.listIssues(owner, repo, options);
        });
    }
    async getIssue(owner, repo, issueId) {
        return this.cache.getOrSet(`IssueTrackingInspector:getIssue:${owner}:${repo}:${issueId}`, async () => {
            return this.service.getIssue(owner, repo, issueId);
        });
    }
    //TODO add options
    async listIssueComments(owner, repo, issueId) {
        return this.cache.getOrSet(`IssueTrackingInspector:listIssueComments:${owner}:${repo}:${issueId}`, async () => {
            return this.service.listIssueComments(owner, repo, issueId);
        });
    }
};
IssueTrackingInspector = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.Types.IContentRepositoryBrowser)),
    __metadata("design:paramtypes", [Object])
], IssueTrackingInspector);
exports.IssueTrackingInspector = IssueTrackingInspector;
//# sourceMappingURL=IssueTrackingInspector.js.map