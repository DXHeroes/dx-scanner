"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwiftLintUsedPractice = void 0;
const model_1 = require("../../model");
const DxPracticeDecorator_1 = require("../DxPracticeDecorator");
let SwiftLintUsedPractice = class SwiftLintUsedPractice {
    async isApplicable(ctx) {
        return ctx.projectComponent.language === model_1.ProgrammingLanguage.Swift;
    }
    async evaluate(ctx) {
        if (ctx.packageInspector) {
            const swiftlintRegex = new RegExp('swiftlint');
            if (ctx.packageInspector.hasPackage(swiftlintRegex)) {
                return model_1.PracticeEvaluationResult.practicing;
            }
            else {
                return model_1.PracticeEvaluationResult.notPracticing;
            }
        }
        return model_1.PracticeEvaluationResult.unknown;
    }
};
SwiftLintUsedPractice = __decorate([
    DxPracticeDecorator_1.DxPractice({
        id: 'Swift.SwiftLintUsed',
        name: 'Use SwiftLint',
        impact: model_1.PracticeImpact.medium,
        suggestion: 'Use Linter to catch dangerous code constructs. SwiftLint is the most widely used Linter in the Swift community.',
        reportOnlyOnce: true,
        url: 'https://dxkb.io/p/linting',
    })
], SwiftLintUsedPractice);
exports.SwiftLintUsedPractice = SwiftLintUsedPractice;
//# sourceMappingURL=SwiftLintUsedPractice.js.map