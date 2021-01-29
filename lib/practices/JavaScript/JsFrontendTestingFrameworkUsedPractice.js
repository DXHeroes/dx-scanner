"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsFrontendTestingFrameworkUsedPractice = void 0;
const model_1 = require("../../model");
const DxPracticeDecorator_1 = require("../DxPracticeDecorator");
let JsFrontendTestingFrameworkUsedPractice = class JsFrontendTestingFrameworkUsedPractice {
    async isApplicable(ctx) {
        return ((ctx.projectComponent.language === model_1.ProgrammingLanguage.JavaScript ||
            ctx.projectComponent.language === model_1.ProgrammingLanguage.TypeScript) &&
            ctx.projectComponent.platform === model_1.ProjectComponentPlatform.FrontEnd);
    }
    async evaluate(ctx) {
        if (ctx.packageInspector) {
            if (ctx.packageInspector.hasOneOfPackages(['jest', 'mocha', 'jasmine'])) {
                return model_1.PracticeEvaluationResult.practicing;
            }
            else {
                return model_1.PracticeEvaluationResult.notPracticing;
            }
        }
        return model_1.PracticeEvaluationResult.unknown;
    }
};
JsFrontendTestingFrameworkUsedPractice = __decorate([
    DxPracticeDecorator_1.DxPractice({
        id: 'JavaScript.FrontendTestingFrameworkUsed',
        name: 'Use JS Frontend Testing Framework',
        impact: model_1.PracticeImpact.medium,
        suggestion: 'Use tests to point out defects and errors that were made during the development phases. Use, for example, Jest - it is the most widely used testing framework in the JavaScript community.',
        reportOnlyOnce: true,
        url: 'https://dxkb.io/tags/testing',
    })
], JsFrontendTestingFrameworkUsedPractice);
exports.JsFrontendTestingFrameworkUsedPractice = JsFrontendTestingFrameworkUsedPractice;
//# sourceMappingURL=JsFrontendTestingFrameworkUsedPractice.js.map