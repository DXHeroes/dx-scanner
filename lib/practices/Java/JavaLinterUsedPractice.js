"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JavaLinterUsedPractice = void 0;
const model_1 = require("../../model");
const DxPracticeDecorator_1 = require("../DxPracticeDecorator");
let JavaLinterUsedPractice = class JavaLinterUsedPractice {
    async isApplicable(ctx) {
        return ctx.projectComponent.language === model_1.ProgrammingLanguage.Java || ctx.projectComponent.language === model_1.ProgrammingLanguage.Kotlin;
    }
    async evaluate(ctx) {
        if (!ctx.packageInspector) {
            return model_1.PracticeEvaluationResult.unknown;
        }
        if (ctx.packageInspector.hasOneOfPackages(['com.netflix.nebula:gradle-lint-plugin', 'com.lewisd:lint-maven-plugin'])) {
            return model_1.PracticeEvaluationResult.practicing;
        }
        return model_1.PracticeEvaluationResult.notPracticing;
    }
};
JavaLinterUsedPractice = __decorate([
    DxPracticeDecorator_1.DxPractice({
        id: 'Java.LinterUsedPractice',
        name: 'Use a Java Linter Dependency',
        impact: model_1.PracticeImpact.small,
        suggestion: 'Use a linter for Maven or Gradle to keep pom.xml or build.gradle scripts clean and error-free.',
        reportOnlyOnce: true,
        url: 'https://github.com/nebula-plugins/gradle-lint-plugin/wiki',
    })
], JavaLinterUsedPractice);
exports.JavaLinterUsedPractice = JavaLinterUsedPractice;
//# sourceMappingURL=JavaLinterUsedPractice.js.map