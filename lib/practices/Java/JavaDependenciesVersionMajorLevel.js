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
var JavaDependenciesVersionMajorLevel_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JavaDependenciesVersionMajorLevel = void 0;
const axios_1 = __importDefault(require("axios"));
const qs_1 = __importDefault(require("qs"));
const PackageInspectorBase_1 = require("../../inspectors/package/PackageInspectorBase");
const model_1 = require("../../model");
const ReporterData_1 = require("../../reporters/ReporterData");
const DxPracticeDecorator_1 = require("../DxPracticeDecorator");
const PracticeBase_1 = require("../PracticeBase");
const DependenciesVersionEvaluationUtils_1 = require("../utils/DependenciesVersionEvaluationUtils");
let JavaDependenciesVersionMajorLevel = JavaDependenciesVersionMajorLevel_1 = class JavaDependenciesVersionMajorLevel extends PracticeBase_1.PracticeBase {
    async isApplicable(ctx) {
        return ctx.projectComponent.language === model_1.ProgrammingLanguage.Java || ctx.projectComponent.language === model_1.ProgrammingLanguage.Kotlin;
    }
    async evaluate(ctx) {
        if (!ctx.fileInspector || !ctx.packageInspector || !ctx.packageInspector.packages) {
            return model_1.PracticeEvaluationResult.unknown;
        }
        const pkgs = ctx.packageInspector.packages;
        const result = await JavaDependenciesVersionMajorLevel_1.searchMavenCentral(pkgs, 5);
        const pkgsToUpdate = DependenciesVersionEvaluationUtils_1.DependenciesVersionEvaluationUtils.packagesToBeUpdated(result, PackageInspectorBase_1.SemverLevel.major, pkgs);
        this.setData(pkgsToUpdate);
        if (pkgsToUpdate.length > 0)
            return model_1.PracticeEvaluationResult.notPracticing;
        return model_1.PracticeEvaluationResult.practicing;
    }
    static async searchMavenCentral(pkgs, rows) {
        const latestVersionsJson = {};
        const URL = 'http://search.maven.org/solrsearch/select?';
        if (pkgs) {
            for (const p of pkgs) {
                const listOfIds = p.name.split(':', 2);
                const queryRequest = qs_1.default.stringify({ q: `${listOfIds[0]}+AND+a:${listOfIds[1]}`, rows, wt: 'json' }, { encode: false });
                const listVersionsEndpoint = `${URL}${queryRequest}`;
                await axios_1.default.get(listVersionsEndpoint).then((response) => {
                    latestVersionsJson[p.name] = `${response.data.response.docs.pop().latestVersion}`;
                });
            }
        }
        return latestVersionsJson;
    }
    setData(pkgsToUpdate) {
        this.data.details = [{ type: ReporterData_1.ReportDetailType.table, headers: ['Library', 'New', 'Current', 'Severity'], data: pkgsToUpdate }];
        this.data.statistics = { updatedDependencies: pkgsToUpdate };
    }
};
JavaDependenciesVersionMajorLevel = JavaDependenciesVersionMajorLevel_1 = __decorate([
    DxPracticeDecorator_1.DxPractice({
        id: 'Java.DependenciesVersionMajorLevel',
        name: 'Update Dependencies of Major Level',
        impact: model_1.PracticeImpact.small,
        suggestion: 'Keep the dependencies updated to have all possible features. Use, for example, versions-maven-plugin',
        reportOnlyOnce: true,
        url: 'https://dxkb.io/p/updating-the-dependencies',
        dependsOn: { practicing: ['Java.SpecifiedDependencyVersions'] },
    })
], JavaDependenciesVersionMajorLevel);
exports.JavaDependenciesVersionMajorLevel = JavaDependenciesVersionMajorLevel;
//# sourceMappingURL=JavaDependenciesVersionMajorLevel.js.map