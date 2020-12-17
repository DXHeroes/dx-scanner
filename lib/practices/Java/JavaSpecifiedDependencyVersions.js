"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JavaSpecifiedDependencyVersions = void 0;
const PracticeBase_1 = require("../PracticeBase");
const DxPracticeDecorator_1 = require("../DxPracticeDecorator");
const model_1 = require("../../model");
let JavaSpecifiedDependencyVersions = class JavaSpecifiedDependencyVersions extends PracticeBase_1.PracticeBase {
    async isApplicable(ctx) {
        return ctx.projectComponent.language === model_1.ProgrammingLanguage.Java || ctx.projectComponent.language === model_1.ProgrammingLanguage.Kotlin;
    }
    async evaluate(ctx) {
        if (!ctx.packageInspector || !ctx.packageInspector.packages) {
            return model_1.PracticeEvaluationResult.unknown;
        }
        const pkgs = ctx.packageInspector.packages;
        for (const pkg of pkgs) {
            if (!pkg.lockfileVersion.value || !pkg.requestedVersion.value) {
                return model_1.PracticeEvaluationResult.notPracticing;
            }
        }
        return model_1.PracticeEvaluationResult.practicing;
    }
};
JavaSpecifiedDependencyVersions = __decorate([
    DxPracticeDecorator_1.DxPractice({
        id: 'Java.SpecifiedDependencyVersions',
        name: 'Specify versions of dependencies',
        impact: model_1.PracticeImpact.high,
        suggestion: 'Set specific versions for the dependencies in your pom.xml or build.gradle',
        reportOnlyOnce: true,
        url: 'https://www.baeldung.com/maven-dependency-latest-version',
    })
], JavaSpecifiedDependencyVersions);
exports.JavaSpecifiedDependencyVersions = JavaSpecifiedDependencyVersions;
//# sourceMappingURL=JavaSpecifiedDependencyVersions.js.map