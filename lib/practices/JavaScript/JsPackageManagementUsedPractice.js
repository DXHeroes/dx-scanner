"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsPackageManagementUsedPractice = void 0;
const model_1 = require("../../model");
const DxPracticeDecorator_1 = require("../DxPracticeDecorator");
let JsPackageManagementUsedPractice = class JsPackageManagementUsedPractice {
    async isApplicable(ctx) {
        return (ctx.projectComponent.language === model_1.ProgrammingLanguage.JavaScript || ctx.projectComponent.language === model_1.ProgrammingLanguage.TypeScript);
    }
    async evaluate(ctx) {
        if (ctx.fileInspector === undefined) {
            return model_1.PracticeEvaluationResult.unknown;
        }
        const regexPjson = new RegExp('package.json', 'i');
        const files = await ctx.fileInspector.scanFor(regexPjson, '/', { shallow: true });
        if (files.length > 0) {
            return model_1.PracticeEvaluationResult.practicing;
        }
        return model_1.PracticeEvaluationResult.notPracticing;
    }
};
JsPackageManagementUsedPractice = __decorate([
    DxPracticeDecorator_1.DxPractice({
        id: 'Javascript.PackageManagementUsed',
        name: 'Use JS Package Management',
        impact: model_1.PracticeImpact.high,
        suggestion: 'Use Package.json to keep track of packages that are being used in your application.',
        reportOnlyOnce: true,
        url: 'https://dxkb.io/p/package-management',
    })
], JsPackageManagementUsedPractice);
exports.JsPackageManagementUsedPractice = JsPackageManagementUsedPractice;
//# sourceMappingURL=JsPackageManagementUsedPractice.js.map