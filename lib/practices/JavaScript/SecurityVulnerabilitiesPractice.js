"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityVulnerabilitiesPractice = void 0;
const debug_1 = __importDefault(require("debug"));
const shelljs_1 = __importDefault(require("shelljs"));
const model_1 = require("../../model");
const ReporterData_1 = require("../../reporters/ReporterData");
const DxPracticeDecorator_1 = require("../DxPracticeDecorator");
const PracticeBase_1 = require("../PracticeBase");
const PracticeUtils_1 = require("../PracticeUtils");
const PackageManagerUtils_1 = require("../utils/PackageManagerUtils");
const securityVulnerabilitiesPracticeDebug = debug_1.default('SecurityVulnerabilitiesPractice');
let SecurityVulnerabilitiesPractice = class SecurityVulnerabilitiesPractice extends PracticeBase_1.PracticeBase {
    async isApplicable(ctx) {
        return (ctx.projectComponent.language === model_1.ProgrammingLanguage.JavaScript || ctx.projectComponent.language === model_1.ProgrammingLanguage.TypeScript);
    }
    async evaluate(ctx) {
        var _a;
        // use --production to show just security issues for dependencies
        const npmCmd = 'npm audit --json --production --audit-level=high';
        // use --groups=dependencies to show just security issues for dependencies
        const yarnCmd = 'yarn audit --json --groups dependencies';
        const packageManager = await PackageManagerUtils_1.PackageManagerUtils.getPackageManagerInstalled(ctx.fileInspector);
        if (packageManager === PackageManagerUtils_1.PackageManagerType.unknown) {
            securityVulnerabilitiesPracticeDebug('Cannot establish package-manager type, missing package-lock.json and yarn.lock or npm command not installed.');
            return model_1.PracticeEvaluationResult.unknown;
        }
        const currentDir = shelljs_1.default.pwd();
        shelljs_1.default.cd((_a = ctx.fileInspector) === null || _a === void 0 ? void 0 : _a.basePath);
        shelljs_1.default.cd(currentDir);
        let data;
        if (packageManager === PackageManagerUtils_1.PackageManagerType.yarn) {
            const result = shelljs_1.default.exec(yarnCmd, { silent: true });
            data = await PracticeUtils_1.parseYarnAudit(result);
            this.setData(data);
            if (data.summary.code > 15)
                return model_1.PracticeEvaluationResult.notPracticing;
        }
        if (packageManager === PackageManagerUtils_1.PackageManagerType.npm) {
            const result = shelljs_1.default.exec(npmCmd, { silent: true });
            data = await PracticeUtils_1.parseNpmAudit(result);
            this.setData(data);
            if (data.summary.code > 0)
                return model_1.PracticeEvaluationResult.notPracticing;
        }
        return model_1.PracticeEvaluationResult.practicing;
    }
    setData(data) {
        const vulnerableData = data.vulnerabilities.map((vulnerability) => ({
            library: vulnerability.library,
            type: vulnerability.type,
            severity: vulnerability.severity,
            dependencyOf: vulnerability.dependencyOf,
            vulnerableVersions: vulnerability.vulnerableVersions,
            patchedIn: vulnerability.patchedIn,
            path: vulnerability.path,
        }));
        this.data.details = [
            {
                type: ReporterData_1.ReportDetailType.table,
                headers: ['Library', 'Type', 'Severity', 'Dependency Of', 'Vulnerable Versions', 'Patched In', 'Path'],
                data: vulnerableData,
            },
        ];
        this.data.statistics = { securityIssues: { issues: vulnerableData, summary: data.summary } };
    }
};
SecurityVulnerabilitiesPractice = __decorate([
    DxPracticeDecorator_1.DxPractice({
        id: 'JavaScript.SecurityVulnerabilities',
        name: 'Security vulnerabilities detected',
        impact: model_1.PracticeImpact.high,
        suggestion: 'Some high-severity security vulnerabilities were detected. Use npm/yarn audit or Snyk to fix them.',
        reportOnlyOnce: true,
        url: 'https://snyk.io/',
    })
], SecurityVulnerabilitiesPractice);
exports.SecurityVulnerabilitiesPractice = SecurityVulnerabilitiesPractice;
//# sourceMappingURL=SecurityVulnerabilitiesPractice.js.map