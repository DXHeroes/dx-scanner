"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ESLintUsedPractice = void 0;
const model_1 = require("../../model");
const DxPracticeDecorator_1 = require("../DxPracticeDecorator");
let ESLintUsedPractice = class ESLintUsedPractice {
    async isApplicable(ctx) {
        return (ctx.projectComponent.language === model_1.ProgrammingLanguage.JavaScript || ctx.projectComponent.language === model_1.ProgrammingLanguage.TypeScript);
    }
    async evaluate(ctx) {
        if (ctx.packageInspector) {
            const eslintRegex = new RegExp('eslint');
            if (ctx.packageInspector.hasPackage(eslintRegex)) {
                return model_1.PracticeEvaluationResult.practicing;
            }
            else {
                return model_1.PracticeEvaluationResult.notPracticing;
            }
        }
        return model_1.PracticeEvaluationResult.unknown;
    }
};
ESLintUsedPractice = __decorate([
    DxPracticeDecorator_1.DxPractice({
        id: 'JavaScript.ESLintUsed',
        name: 'Use ESLint',
        impact: model_1.PracticeImpact.medium,
        suggestion: 'Use Linter to catch dangerous code constructs. ESLint is the most widely used Linter in the JavaScript community.',
        reportOnlyOnce: true,
        url: 'https://dxkb.io/p/linting',
    })
], ESLintUsedPractice);
exports.ESLintUsedPractice = ESLintUsedPractice;
//# sourceMappingURL=ESLintUsedPractice.js.map