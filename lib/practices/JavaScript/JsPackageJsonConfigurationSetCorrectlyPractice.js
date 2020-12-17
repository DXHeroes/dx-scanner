"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsPackageJsonConfigurationSetCorrectlyPractice = void 0;
const model_1 = require("../../model");
const DxPracticeDecorator_1 = require("../DxPracticeDecorator");
const PracticeBase_1 = require("../PracticeBase");
const ReporterData_1 = require("../../reporters/ReporterData");
let JsPackageJsonConfigurationSetCorrectlyPractice = class JsPackageJsonConfigurationSetCorrectlyPractice extends PracticeBase_1.PracticeBase {
    async isApplicable(ctx) {
        return (ctx.projectComponent.language === model_1.ProgrammingLanguage.JavaScript || ctx.projectComponent.language === model_1.ProgrammingLanguage.TypeScript);
    }
    async evaluate(ctx) {
        if (!ctx.fileInspector) {
            return model_1.PracticeEvaluationResult.unknown;
        }
        const content = await ctx.fileInspector.readFile('/package.json');
        let parsedPackageJson;
        if (content) {
            try {
                parsedPackageJson = JSON.parse(content);
            }
            catch (error) {
                if (error instanceof SyntaxError) {
                    return model_1.PracticeEvaluationResult.unknown;
                }
                throw error;
            }
        }
        if (parsedPackageJson.scripts &&
            parsedPackageJson.scripts.test &&
            parsedPackageJson.scripts.lint &&
            parsedPackageJson.scripts.build &&
            parsedPackageJson.scripts.start) {
            return model_1.PracticeEvaluationResult.practicing;
        }
        this.setData();
        return model_1.PracticeEvaluationResult.notPracticing;
    }
    setData() {
        this.data.details = [
            {
                type: ReporterData_1.ReportDetailType.text,
                text: "The package.json doesn't have configured scripts correctly. The most common scripts are build, start, test and lint.",
            },
        ];
    }
};
JsPackageJsonConfigurationSetCorrectlyPractice = __decorate([
    DxPracticeDecorator_1.DxPractice({
        id: 'JavaScript.PackageJsonConfigurationSetCorrectly',
        name: 'Configure Scripts in package.json',
        impact: model_1.PracticeImpact.medium,
        suggestion: 'Use correct configurations to automate repetitive tasks. Use build for automating the build process, lint for linting your code, tests for testing and start for running your project.',
        reportOnlyOnce: true,
        url: 'https://docs.npmjs.com/files/package.json',
        dependsOn: { practicing: ['Javascript.PackageManagementUsed'] },
    })
], JsPackageJsonConfigurationSetCorrectlyPractice);
exports.JsPackageJsonConfigurationSetCorrectlyPractice = JsPackageJsonConfigurationSetCorrectlyPractice;
//# sourceMappingURL=JsPackageJsonConfigurationSetCorrectlyPractice.js.map