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
exports.DependenciesVersionMajorLevelPractice = void 0;
const npm_check_updates_1 = __importDefault(require("npm-check-updates"));
const PackageInspectorBase_1 = require("../../inspectors/package/PackageInspectorBase");
const model_1 = require("../../model");
const ReporterData_1 = require("../../reporters/ReporterData");
const DxPracticeDecorator_1 = require("../DxPracticeDecorator");
const PracticeBase_1 = require("../PracticeBase");
const DependenciesVersionEvaluationUtils_1 = require("../utils/DependenciesVersionEvaluationUtils");
let DependenciesVersionMajorLevelPractice = class DependenciesVersionMajorLevelPractice extends PracticeBase_1.PracticeBase {
    async isApplicable(ctx) {
        return (ctx.projectComponent.language === model_1.ProgrammingLanguage.JavaScript || ctx.projectComponent.language === model_1.ProgrammingLanguage.TypeScript);
    }
    async evaluate(ctx) {
        if (!ctx.fileInspector || !ctx.packageInspector || !ctx.packageInspector.packages) {
            return model_1.PracticeEvaluationResult.unknown;
        }
        const pkgs = ctx.packageInspector.packages;
        const result = await this.runNcu(pkgs);
        const pkgsToUpdate = DependenciesVersionEvaluationUtils_1.DependenciesVersionEvaluationUtils.packagesToBeUpdated(result, PackageInspectorBase_1.SemverLevel.major, pkgs);
        this.setData(pkgsToUpdate);
        if (pkgsToUpdate.length > 0)
            return model_1.PracticeEvaluationResult.notPracticing;
        return model_1.PracticeEvaluationResult.practicing;
    }
    async runNcu(pkgs) {
        const fakePkgJson = { dependencies: {} };
        pkgs &&
            pkgs.forEach((p) => {
                fakePkgJson.dependencies[p.name] = p.requestedVersion.value;
            });
        const pkgsToBeUpdated = await npm_check_updates_1.default.run({
            packageData: JSON.stringify(fakePkgJson),
        });
        return pkgsToBeUpdated;
    }
    setData(pkgsToUpdate) {
        this.data.details = [{ type: ReporterData_1.ReportDetailType.table, headers: ['Library', 'New', 'Current', 'Severity'], data: pkgsToUpdate }];
        this.data.statistics = { updatedDependencies: pkgsToUpdate };
    }
};
DependenciesVersionMajorLevelPractice = __decorate([
    DxPracticeDecorator_1.DxPractice({
        id: 'JavaScript.DependenciesVersionMajorLevel',
        name: 'Update Dependencies of Major Level',
        impact: model_1.PracticeImpact.small,
        suggestion: 'Keep the dependencies updated to have all possible features. Use, for example, npm-check-updates.',
        reportOnlyOnce: true,
        url: 'https://dxkb.io/p/updating-the-dependencies',
    })
], DependenciesVersionMajorLevelPractice);
exports.DependenciesVersionMajorLevelPractice = DependenciesVersionMajorLevelPractice;
//# sourceMappingURL=DependenciesVersionMajorLevel.js.map