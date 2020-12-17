"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JavaTestingFrameworkUsedPractice = void 0;
const model_1 = require("../../model");
const DxPracticeDecorator_1 = require("../DxPracticeDecorator");
let JavaTestingFrameworkUsedPractice = class JavaTestingFrameworkUsedPractice {
    async isApplicable(ctx) {
        return ctx.projectComponent.language === model_1.ProgrammingLanguage.Java || ctx.projectComponent.language === model_1.ProgrammingLanguage.Kotlin;
    }
    async evaluate(ctx) {
        if (!ctx.packageInspector) {
            return model_1.PracticeEvaluationResult.unknown;
        }
        if (ctx.packageInspector.hasOneOfPackages([
            'junit:junit',
            'io.rest-assured:rest-assured',
            'org.testng:testng',
            'org.springframework:spring-test',
        ])) {
            return model_1.PracticeEvaluationResult.practicing;
        }
        return model_1.PracticeEvaluationResult.notPracticing;
    }
};
JavaTestingFrameworkUsedPractice = __decorate([
    DxPracticeDecorator_1.DxPractice({
        id: 'Java.TestingFrameworkUsedPractice',
        name: 'Use Testing Frameworks',
        impact: model_1.PracticeImpact.high,
        suggestion: 'Use tests to point out the defects and errors that were made during the development phases. The most widely used testing frameworks in the Java community are JUnit and TestNG.',
        reportOnlyOnce: true,
        url: 'https://dxkb.io/tags/testing',
    })
], JavaTestingFrameworkUsedPractice);
exports.JavaTestingFrameworkUsedPractice = JavaTestingFrameworkUsedPractice;
//# sourceMappingURL=JavaTestingFrameworkUsedPractice.js.map