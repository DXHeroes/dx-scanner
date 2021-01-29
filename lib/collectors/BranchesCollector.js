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
exports.BranchesCollector = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../types");
const services_1 = require("../services");
let BranchesCollector = class BranchesCollector {
    constructor(contentRepositoryBrowser, gitInspector) {
        this.contentRepositoryBrowser = contentRepositoryBrowser;
        this.gitInspector = gitInspector;
    }
    async collectData(scanningStrategy) {
        const ownerAndRepoName = services_1.GitServiceUtils.parseUrl(scanningStrategy.remoteUrl);
        const [branches, status] = await Promise.all([
            this.contentRepositoryBrowser.listBranches(ownerAndRepoName.owner, ownerAndRepoName.repoName),
            this.gitInspector.getStatus(),
        ]);
        const defaultBranch = branches.items.find((branch) => branch.type === 'default');
        return { current: status.current || 'unknown', default: (defaultBranch === null || defaultBranch === void 0 ? void 0 : defaultBranch.name) || 'unknown' };
    }
};
BranchesCollector = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.Types.IContentRepositoryBrowser)),
    __param(1, inversify_1.inject(types_1.Types.IGitInspector)),
    __metadata("design:paramtypes", [Object, Object])
], BranchesCollector);
exports.BranchesCollector = BranchesCollector;
//# sourceMappingURL=BranchesCollector.js.map