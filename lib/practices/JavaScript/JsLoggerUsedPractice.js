"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsLoggerUsedPractice = void 0;
const model_1 = require("../../model");
const DxPracticeDecorator_1 = require("../DxPracticeDecorator");
let JsLoggerUsedPractice = class JsLoggerUsedPractice {
    async isApplicable(ctx) {
        return (ctx.projectComponent.language === model_1.ProgrammingLanguage.JavaScript || ctx.projectComponent.language === model_1.ProgrammingLanguage.TypeScript);
    }
    async evaluate(ctx) {
        if (ctx.packageInspector) {
            if (ctx.packageInspector.hasOneOfPackages(['bunyan', 'winston', 'node-loggly', 'morgan', 'pino'])) {
                return model_1.PracticeEvaluationResult.practicing;
            }
            else {
                return model_1.PracticeEvaluationResult.notPracticing;
            }
        }
        return model_1.PracticeEvaluationResult.unknown;
    }
};
JsLoggerUsedPractice = __decorate([
    DxPracticeDecorator_1.DxPractice({
        id: 'JavaScript.LoggerUsed',
        name: 'Use a JS Logging Library',
        impact: model_1.PracticeImpact.small,
        suggestion: 'Use a logging library to avoid errors and even cyber attacks. The most widely used logging library in the JavaScript community is Winston.',
        reportOnlyOnce: true,
        url: 'https://www.npmjs.com/package/winston/',
    })
], JsLoggerUsedPractice);
exports.JsLoggerUsedPractice = JsLoggerUsedPractice;
//# sourceMappingURL=JsLoggerUsedPractice.js.map