"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
exports.LinterIssueSeverity = exports.UpdatedDependencySeverity = exports.SecurityIssueSeverity = exports.DashboardReporter = void 0;
const axios_1 = __importDefault(require("axios"));
const inversify_1 = require("inversify");
const uuid = __importStar(require("uuid"));
const _1 = require(".");
const types_1 = require("../types");
const services_1 = require("../services");
const ServiceDataCollector_1 = require("../collectors/ServiceDataCollector");
const utils_1 = require("../detectors/utils");
const debug_1 = __importDefault(require("debug"));
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
const pjson = require('../../package.json');
let DashboardReporter = class DashboardReporter {
    constructor(argumentsProvider, scanningStrategy, dataCollector) {
        this.argumentsProvider = argumentsProvider;
        this.scanningStrategy = scanningStrategy;
        this.dataCollector = dataCollector;
        this.d = utils_1.debugLog('DashboardReporter');
    }
    async report(practicesAndComponents) {
        const reportData = await this.buildReport(practicesAndComponents);
        try {
            // send data
            await axios_1.default.post(`${this.argumentsProvider.apiUrl}/data-report`, reportData, {
                headers: this.argumentsProvider.apiToken && { Authorization: this.argumentsProvider.apiToken },
            });
            debug_1.default.log('You can see DX data in your DX account now.\n');
        }
        catch (error) {
            this.d(error);
            debug_1.default.log('Your DX data has not been sent to your account.\n');
        }
    }
    async buildReport(practicesAndComponents) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        const componentsWithPractices = _1.ReporterUtils.getComponentsWithPractices(practicesAndComponents, this.scanningStrategy);
        const dxScore = _1.ReporterUtils.computeDXScore(practicesAndComponents, this.scanningStrategy);
        const report = {
            componentsWithDxScore: [],
            collectorsData: await ((_a = this.dataCollector) === null || _a === void 0 ? void 0 : _a.collectData(this.scanningStrategy)),
            version: pjson.version,
            id: uuid.v4(),
            dxScore: { value: dxScore.value, points: dxScore.points },
        };
        for (const cwp of componentsWithPractices) {
            let updatedDependencies = [];
            let securityIssues = [];
            let linterIssues = [];
            let pullRequests = [];
            const dxScoreForComponent = dxScore.components.find((c) => c.path === cwp.component.path).value;
            const dxScorePoints = dxScore.components.find((c) => c.path === cwp.component.path).points;
            for (const p of cwp.practicesAndComponents) {
                updatedDependencies = [...updatedDependencies, ...(((_c = (_b = p.practice.data) === null || _b === void 0 ? void 0 : _b.statistics) === null || _c === void 0 ? void 0 : _c.updatedDependencies) || [])];
                securityIssues = [...securityIssues, ...(((_f = (_e = (_d = p.practice.data) === null || _d === void 0 ? void 0 : _d.statistics) === null || _e === void 0 ? void 0 : _e.securityIssues) === null || _f === void 0 ? void 0 : _f.issues) || [])];
                pullRequests = [...pullRequests, ...(((_h = (_g = p.practice.data) === null || _g === void 0 ? void 0 : _g.statistics) === null || _h === void 0 ? void 0 : _h.pullRequests) || [])];
                linterIssues = [
                    ...linterIssues,
                    ...(((_l = (_k = (_j = p.practice.data) === null || _j === void 0 ? void 0 : _j.statistics) === null || _k === void 0 ? void 0 : _k.linterIssues) === null || _l === void 0 ? void 0 : _l.map((issue) => {
                        return Object.assign(Object.assign({}, issue), { filePath: issue.filePath.replace(this.scanningStrategy.rootPath || '', ''), url: services_1.GitServiceUtils.getUrlToRepo(p.component.repositoryPath, this.scanningStrategy, issue.url) });
                    })) || []),
                ];
            }
            const componentWithScore = {
                component: cwp.component,
                dxScore: { value: dxScoreForComponent, points: dxScorePoints },
                serviceType: this.scanningStrategy.serviceType,
                securityIssues,
                updatedDependencies,
                linterIssues,
                //Remove duplicate prs
                pullRequests: pullRequests.filter((pr, index, array) => array.indexOf(pr) === index),
            };
            report.componentsWithDxScore.push(componentWithScore);
        }
        return report;
    }
};
DashboardReporter = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.Types.ArgumentsProvider)),
    __param(1, inversify_1.inject(types_1.Types.ScanningStrategy)),
    __param(2, inversify_1.inject(ServiceDataCollector_1.ServiceDataCollector)), __param(2, inversify_1.optional()),
    __metadata("design:paramtypes", [Object, Object, Object])
], DashboardReporter);
exports.DashboardReporter = DashboardReporter;
var SecurityIssueSeverity;
(function (SecurityIssueSeverity) {
    SecurityIssueSeverity["Info"] = "info";
    SecurityIssueSeverity["Low"] = "low";
    SecurityIssueSeverity["Moderate"] = "moderate";
    SecurityIssueSeverity["High"] = "high";
    SecurityIssueSeverity["Critical"] = "critical";
})(SecurityIssueSeverity = exports.SecurityIssueSeverity || (exports.SecurityIssueSeverity = {}));
var UpdatedDependencySeverity;
(function (UpdatedDependencySeverity) {
    UpdatedDependencySeverity["Low"] = "low";
    UpdatedDependencySeverity["Moderate"] = "moderate";
    UpdatedDependencySeverity["High"] = "high";
})(UpdatedDependencySeverity = exports.UpdatedDependencySeverity || (exports.UpdatedDependencySeverity = {}));
var LinterIssueSeverity;
(function (LinterIssueSeverity) {
    LinterIssueSeverity["Warning"] = "warning";
    LinterIssueSeverity["Error"] = "error";
})(LinterIssueSeverity = exports.LinterIssueSeverity || (exports.LinterIssueSeverity = {}));
//# sourceMappingURL=DashboardReporter.js.map