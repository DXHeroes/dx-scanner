"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JavaGitignoreCorrectlySetPractice = void 0;
const model_1 = require("../../model");
const DxPracticeDecorator_1 = require("../DxPracticeDecorator");
const errors_1 = require("../../lib/errors");
let JavaGitignoreCorrectlySetPractice = class JavaGitignoreCorrectlySetPractice {
    async isApplicable(ctx) {
        return ctx.projectComponent.language === model_1.ProgrammingLanguage.Java || ctx.projectComponent.language === model_1.ProgrammingLanguage.Kotlin;
    }
    async evaluate(ctx) {
        if (!ctx.fileInspector) {
            throw errors_1.ErrorFactory.newInternalError('File inspector not found');
        }
        const parseGitignore = (gitignoreFile) => {
            return gitignoreFile
                .toString()
                .split(/\r?\n/)
                .filter((content) => content.trim() !== '' && !content.startsWith('#'));
        };
        const content = await ctx.fileInspector.readFile('.gitignore');
        const parsedGitignore = parseGitignore(content);
        const compiledClassRegex = parsedGitignore.find((value) => /\*\.class/.test(value));
        const logRegex = parsedGitignore.find((value) => /\*\.log/.test(value));
        const jarRegex = parsedGitignore.find((value) => /\*\.jar/.test(value));
        const warRegex = parsedGitignore.find((value) => /\*\.war/.test(value));
        if (!(compiledClassRegex && logRegex && jarRegex && warRegex)) {
            return model_1.PracticeEvaluationResult.notPracticing;
        }
        if (await ctx.fileInspector.exists('pom.xml')) {
            return (await this.resolveGitignorePractice(parsedGitignore, 'Maven'))
                ? model_1.PracticeEvaluationResult.practicing
                : model_1.PracticeEvaluationResult.notPracticing;
        }
        else if ((await ctx.fileInspector.exists('build.gradle')) || (await ctx.fileInspector.exists('build.gradle.kts'))) {
            return (await this.resolveGitignorePractice(parsedGitignore, 'Gradle'))
                ? model_1.PracticeEvaluationResult.practicing
                : model_1.PracticeEvaluationResult.notPracticing;
        }
        return model_1.PracticeEvaluationResult.practicing;
    }
    async resolveGitignorePractice(parsedGitignore, javaArchitecture) {
        if (javaArchitecture === 'Maven') {
            const mvnRegex = parsedGitignore.find((value) => /\.mvn/.test(value));
            const buildNumberRegex = parsedGitignore.find((value) => /buildNumber/.test(value));
            const targetRegex = parsedGitignore.find((value) => /target/.test(value));
            const pomTagRegex = parsedGitignore.find((value) => /pom\.xml\.tag/.test(value));
            const pomNextRegex = parsedGitignore.find((value) => /pom\.xml\.next/.test(value));
            const releaseRegex = parsedGitignore.find((value) => /release\.properties/.test(value));
            if (mvnRegex && buildNumberRegex && targetRegex && pomTagRegex && pomNextRegex && releaseRegex) {
                return true;
            }
        }
        else if (javaArchitecture === 'Gradle') {
            const gradleRegex = parsedGitignore.find((value) => /\.gradle/.test(value));
            const gradleAppRegex = parsedGitignore.find((value) => /gradle-app\.setting/.test(value));
            const gradleWrapperRegex = parsedGitignore.find((value) => /!gradle-wrapper\.jar/.test(value));
            const taskNameCacheRegex = parsedGitignore.find((value) => /\.gradletasknamecache/.test(value));
            if (gradleRegex && gradleAppRegex && gradleWrapperRegex && taskNameCacheRegex) {
                return true;
            }
        }
        return false;
    }
};
JavaGitignoreCorrectlySetPractice = __decorate([
    DxPracticeDecorator_1.DxPractice({
        id: 'Java.GitignoreCorrectlySet',
        name: 'Set .gitignore Correctly',
        impact: model_1.PracticeImpact.high,
        suggestion: 'Set patterns in the .gitignore as usual.',
        reportOnlyOnce: true,
        url: 'https://github.com/github/gitignore/blob/master/Java.gitignore',
        dependsOn: { practicing: ['LanguageIndependent.GitignoreIsPresent'] },
    })
], JavaGitignoreCorrectlySetPractice);
exports.JavaGitignoreCorrectlySetPractice = JavaGitignoreCorrectlySetPractice;
//# sourceMappingURL=JavaGitignoreCorrectlySetPractice.js.map