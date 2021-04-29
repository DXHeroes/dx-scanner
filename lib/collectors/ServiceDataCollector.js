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
exports.ServiceDataCollector = void 0;
const inversify_1 = require("inversify");
const ContributorsCollector_1 = require("./ContributorsCollector");
const BranchesCollector_1 = require("./BranchesCollector");
let ServiceDataCollector = class ServiceDataCollector {
    //TODO: add tech stack collector
    constructor(contributorsCollector, branchesCollector) {
        this.contributorsCollector = contributorsCollector;
        this.branchesCollector = branchesCollector;
    }
    async collectData(scanningStrategy) {
        // TODO: temporary try/catch until the listBranches is implemented in all VCS connectors
        let branches = { current: 'unknown', default: 'unknown' };
        try {
            branches = await this.branchesCollector.collectData(scanningStrategy);
        }
        catch (_a) { }
        return {
            branches,
            contributors: await this.contributorsCollector.collectData(scanningStrategy),
        };
    }
};
ServiceDataCollector = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(ContributorsCollector_1.ContributorsCollector)),
    __param(1, inversify_1.inject(BranchesCollector_1.BranchesCollector)),
    __metadata("design:paramtypes", [ContributorsCollector_1.ContributorsCollector,
        BranchesCollector_1.BranchesCollector])
], ServiceDataCollector);
exports.ServiceDataCollector = ServiceDataCollector;
//# sourceMappingURL=ServiceDataCollector.js.map