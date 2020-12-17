"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeScriptUsedPractice = void 0;
const model_1 = require("../../model");
const DxPracticeDecorator_1 = require("../DxPracticeDecorator");
let TypeScriptUsedPractice = class TypeScriptUsedPractice {
    async isApplicable(ctx) {
        return ctx.projectComponent.language === model_1.ProgrammingLanguage.JavaScript;
    }
    async evaluate() {
        // Always match this for JavaScript
        return model_1.PracticeEvaluationResult.notPracticing;
    }
};
TypeScriptUsedPractice = __decorate([
    DxPracticeDecorator_1.DxPractice({
        id: 'JavaScript.TypeScriptUsed',
        name: 'Write in Typescript',
        impact: model_1.PracticeImpact.medium,
        suggestion: 'Start writing in TypeScript to catch errors during compile-time. TypeScript simplifies JavaScript code, making it easier to read and debug.',
        reportOnlyOnce: true,
        url: 'https://www.typescriptlang.org/',
    })
], TypeScriptUsedPractice);
exports.TypeScriptUsedPractice = TypeScriptUsedPractice;
//# sourceMappingURL=TypeScriptUsedPractice.js.map