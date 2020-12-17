"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JavaNamingConventionsPractice = void 0;
const model_1 = require("../../model");
const DxPracticeDecorator_1 = require("../DxPracticeDecorator");
const camelcase_1 = __importDefault(require("camelcase"));
let JavaNamingConventionsPractice = class JavaNamingConventionsPractice {
    async isApplicable(ctx) {
        return ctx.projectComponent.language === model_1.ProgrammingLanguage.Java || ctx.projectComponent.language === model_1.ProgrammingLanguage.Kotlin;
    }
    async evaluate(ctx) {
        if (!ctx.fileInspector) {
            return model_1.PracticeEvaluationResult.unknown;
        }
        const scannedFiles = [];
        const regex = new RegExp('.(java|kt|kts)', 'i');
        const resultFiles = await ctx.fileInspector.scanFor(regex, '/', { shallow: false });
        resultFiles.forEach((file) => {
            scannedFiles.push(file);
        });
        if (scannedFiles.length === 0) {
            return model_1.PracticeEvaluationResult.unknown;
        }
        const incorrectFiles = [];
        scannedFiles.forEach((file) => {
            if (file.baseName !== 'build.gradle' && file.baseName !== 'settings.gradle') {
                const correctPascalCase = camelcase_1.default(file.baseName, { pascalCase: true });
                if (file.baseName !== correctPascalCase) {
                    incorrectFiles.push(file.baseName);
                }
            }
        });
        if (incorrectFiles.length === 0) {
            return model_1.PracticeEvaluationResult.practicing;
        }
        return model_1.PracticeEvaluationResult.notPracticing;
    }
};
JavaNamingConventionsPractice = __decorate([
    DxPracticeDecorator_1.DxPractice({
        id: 'Java.NamingConventions',
        name: 'Use Java/Kotlin Naming Conventions',
        impact: model_1.PracticeImpact.small,
        suggestion: 'Java/Kotlin class names should begin capitalized as UpperCamelCase or PascalCase in a regular naming convention.',
        reportOnlyOnce: true,
        url: 'https://www.oracle.com/technetwork/java/codeconventions-135099.html',
    })
], JavaNamingConventionsPractice);
exports.JavaNamingConventionsPractice = JavaNamingConventionsPractice;
//# sourceMappingURL=JavaNamingConventionsPractice.js.map