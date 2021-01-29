"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PythonLinterUsedPractice = void 0;
const model_1 = require("../../model");
const DxPracticeDecorator_1 = require("../DxPracticeDecorator");
let PythonLinterUsedPractice = class PythonLinterUsedPractice {
    async isApplicable(ctx) {
        return ctx.projectComponent.language === model_1.ProgrammingLanguage.Python;
    }
    async evaluate(ctx) {
        if (!ctx.packageInspector) {
            return model_1.PracticeEvaluationResult.unknown;
        }
        if (ctx.packageInspector.hasOneOfPackages(['pylint', 'pyflakes', 'flake8', 'pycodestyle'])) {
            return model_1.PracticeEvaluationResult.practicing;
        }
        return model_1.PracticeEvaluationResult.notPracticing;
    }
};
PythonLinterUsedPractice = __decorate([
    DxPracticeDecorator_1.DxPractice({
        id: 'Python.LinterUsedPractice',
        name: 'Use a Python Linter Dependency',
        impact: model_1.PracticeImpact.medium,
        suggestion: 'Use a linter for clean and error-free development experience.',
        reportOnlyOnce: true,
        url: 'https://developerexperience.io/practices/linting',
    })
], PythonLinterUsedPractice);
exports.PythonLinterUsedPractice = PythonLinterUsedPractice;
//# sourceMappingURL=PythonLinterUsedPractice.js.map