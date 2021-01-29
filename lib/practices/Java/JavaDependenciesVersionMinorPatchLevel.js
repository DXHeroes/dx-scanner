"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JavaDependenciesVersionMinorPatchLevel = void 0;
const model_1 = require("../../model");
const DxPracticeDecorator_1 = require("../DxPracticeDecorator");
const JavaDependenciesVersionMajorLevel_1 = require("./JavaDependenciesVersionMajorLevel");
const DependenciesVersionEvaluationUtils_1 = require("../utils/DependenciesVersionEvaluationUtils");
const PackageInspectorBase_1 = require("../../inspectors/package/PackageInspectorBase");
const lodash_1 = require("lodash");
let JavaDependenciesVersionMinorPatchLevel = class JavaDependenciesVersionMinorPatchLevel extends JavaDependenciesVersionMajorLevel_1.JavaDependenciesVersionMajorLevel {
    async isApplicable(ctx) {
        return ctx.projectComponent.language === model_1.ProgrammingLanguage.Java || ctx.projectComponent.language === model_1.ProgrammingLanguage.Kotlin;
    }
    async evaluate(ctx) {
        if (!ctx.fileInspector || !ctx.packageInspector || !ctx.packageInspector.packages) {
            return model_1.PracticeEvaluationResult.unknown;
        }
        const pkgs = ctx.packageInspector.packages;
        const result = await JavaDependenciesVersionMajorLevel_1.JavaDependenciesVersionMajorLevel.searchMavenCentral(pkgs, 5);
        const patchLevelPkgs = DependenciesVersionEvaluationUtils_1.DependenciesVersionEvaluationUtils.packagesToBeUpdated(result, PackageInspectorBase_1.SemverLevel.patch, pkgs);
        const minorLevelPkgs = DependenciesVersionEvaluationUtils_1.DependenciesVersionEvaluationUtils.packagesToBeUpdated(result, PackageInspectorBase_1.SemverLevel.minor, pkgs);
        this.setData(lodash_1.flatten([patchLevelPkgs, minorLevelPkgs]));
        if (patchLevelPkgs.length > 0 || minorLevelPkgs.length > 0) {
            return model_1.PracticeEvaluationResult.notPracticing;
        }
        return model_1.PracticeEvaluationResult.practicing;
    }
};
JavaDependenciesVersionMinorPatchLevel = __decorate([
    DxPracticeDecorator_1.DxPractice({
        id: 'Java.DependenciesVersionMinorPatchLevel',
        name: 'Update Dependencies of Minor and Patch Level',
        impact: model_1.PracticeImpact.high,
        suggestion: 'Keep the dependencies updated to have all possible features. Use, for example, versions-maven-plugin',
        reportOnlyOnce: true,
        url: 'https://dxkb.io/p/updating-the-dependencies',
        dependsOn: { practicing: ['Java.SpecifiedDependencyVersions'] },
    })
], JavaDependenciesVersionMinorPatchLevel);
exports.JavaDependenciesVersionMinorPatchLevel = JavaDependenciesVersionMinorPatchLevel;
//# sourceMappingURL=JavaDependenciesVersionMinorPatchLevel.js.map