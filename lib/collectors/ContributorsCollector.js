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
exports.ContributorsCollector = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../types");
const services_1 = require("../services");
let ContributorsCollector = class ContributorsCollector {
    constructor(contentRepositoryBrowser) {
        this.contentRepositoryBrowser = contentRepositoryBrowser;
    }
    async collectData(scanningStrategy) {
        const ownerAndRepoName = services_1.GitServiceUtils.parseUrl(scanningStrategy.remoteUrl);
        return this.contentRepositoryBrowser.listContributors(ownerAndRepoName.owner, ownerAndRepoName.repoName);
    }
};
ContributorsCollector = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.Types.IContentRepositoryBrowser)),
    __metadata("design:paramtypes", [Object])
], ContributorsCollector);
exports.ContributorsCollector = ContributorsCollector;
//# sourceMappingURL=ContributorsCollector.js.map