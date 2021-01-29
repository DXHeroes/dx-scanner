"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsBackendTestingFrameworkUsedPractice = void 0;
const model_1 = require("../../model");
const DxPracticeDecorator_1 = require("../DxPracticeDecorator");
let JsBackendTestingFrameworkUsedPractice = class JsBackendTestingFrameworkUsedPractice {
    async isApplicable(ctx) {
        return ((ctx.projectComponent.language === model_1.ProgrammingLanguage.JavaScript ||
            ctx.projectComponent.language === model_1.ProgrammingLanguage.TypeScript) &&
            ctx.projectComponent.platform === model_1.ProjectComponentPlatform.BackEnd);
    }
    async evaluate(ctx) {
        if (ctx.packageInspector) {
            if (ctx.packageInspector.hasOneOfPackages(['jest', 'mocha', 'jasmine', 'qunit'])) {
                return model_1.PracticeEvaluationResult.practicing;
            }
            else {
                return model_1.PracticeEvaluationResult.notPracticing;
            }
        }
        return model_1.PracticeEvaluationResult.unknown;
    }
};
JsBackendTestingFrameworkUsedPractice = __decorate([
    DxPracticeDecorator_1.DxPractice({
        id: 'JavaScript.BackendTestingFrameworkUsed',
        name: 'Use JS Backend Testing Frameworks',
        impact: model_1.PracticeImpact.high,
        suggestion: 'Use tests to point out the defects and errors that were made during the development phases. The most widely used testing frameworks in the JavaScript community are Jest and Mocha.',
        reportOnlyOnce: true,
        url: 'https://dxkb.io/tags/testing',
    })
], JsBackendTestingFrameworkUsedPractice);
exports.JsBackendTestingFrameworkUsedPractice = JsBackendTestingFrameworkUsedPractice;
//# sourceMappingURL=JsBackendTestingFrameworkUsedPractice.js.map