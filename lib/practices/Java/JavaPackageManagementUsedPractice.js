"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JavaPackageManagementUsedPractice = void 0;
const model_1 = require("../../model");
const DxPracticeDecorator_1 = require("../DxPracticeDecorator");
let JavaPackageManagementUsedPractice = class JavaPackageManagementUsedPractice {
    async isApplicable(ctx) {
        return ctx.projectComponent.language === model_1.ProgrammingLanguage.Java || ctx.projectComponent.language === model_1.ProgrammingLanguage.Kotlin;
    }
    async evaluate(ctx) {
        if (!ctx.fileInspector) {
            return model_1.PracticeEvaluationResult.unknown;
        }
        if (await ctx.fileInspector.exists('pom.xml')) {
            return model_1.PracticeEvaluationResult.practicing;
        }
        else if (await ctx.fileInspector.exists('build.gradle')) {
            return model_1.PracticeEvaluationResult.practicing;
        }
        else if (await ctx.fileInspector.exists('build.gradle.kts')) {
            return model_1.PracticeEvaluationResult.practicing;
        }
        return model_1.PracticeEvaluationResult.notPracticing;
    }
};
JavaPackageManagementUsedPractice = __decorate([
    DxPracticeDecorator_1.DxPractice({
        id: 'Java.PackageManagementUsed',
        name: 'Use Java Package Management',
        impact: model_1.PracticeImpact.high,
        suggestion: 'Use pom.xml or build.gradle to keep track of packages that are being used in your application.',
        reportOnlyOnce: true,
        url: 'https://dxkb.io/p/package-management',
    })
], JavaPackageManagementUsedPractice);
exports.JavaPackageManagementUsedPractice = JavaPackageManagementUsedPractice;
//# sourceMappingURL=JavaPackageManagementUsedPractice.js.map