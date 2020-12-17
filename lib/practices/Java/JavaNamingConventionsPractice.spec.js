"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JavaNamingConventionsPractice_1 = require("./JavaNamingConventionsPractice");
const model_1 = require("../../model");
const inversify_config_1 = require("../../inversify.config");
describe('JavaPackageManagementUsedPractice', () => {
    let practice;
    let containerCtx;
    beforeAll(() => {
        containerCtx = inversify_config_1.createTestContainer();
        containerCtx.container.bind('JavaNamingConventionsPractice').to(JavaNamingConventionsPractice_1.JavaNamingConventionsPractice);
        practice = containerCtx.container.get('JavaNamingConventionsPractice');
    });
    afterEach(async () => {
        containerCtx.virtualFileSystemService.clearFileSystem();
        containerCtx.practiceContext.fileInspector.purgeCache();
    });
    it('Returns practicing if Java class files are using correct naming conventions', async () => {
        containerCtx.virtualFileSystemService.setFileSystem({
            'CorrectNamingConvention.java': '',
        });
        const evaluated = await practice.evaluate(containerCtx.practiceContext);
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.practicing);
    });
    it('Returns practicing if Kotlin class files are using correct naming conventions', async () => {
        containerCtx.virtualFileSystemService.setFileSystem({
            'CorrectNamingConvention.kt': '',
            'CorrectNamingConventionTwo.kts': '',
        });
        const evaluated = await practice.evaluate(containerCtx.practiceContext);
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.practicing);
    });
    it('Returns NOT practicing if Java class files are using incorrect naming conventions', async () => {
        containerCtx.virtualFileSystemService.setFileSystem({
            'incorrect_snake_case_naming_convention.java': '',
        });
        const evaluated = await practice.evaluate(containerCtx.practiceContext);
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.notPracticing);
    });
    it('Returns NOT practicing if Kotlin class files are using incorrect naming conventions', async () => {
        containerCtx.virtualFileSystemService.setFileSystem({
            'incorrect_snake_case_naming_convention.kt': '',
        });
        const evaluated = await practice.evaluate(containerCtx.practiceContext);
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.notPracticing);
    });
    it('Returns NOT practicing if Java class files are not capitalized', async () => {
        containerCtx.virtualFileSystemService.setFileSystem({
            'incorrectNamingConvention.java': '',
        });
        const evaluated = await practice.evaluate(containerCtx.practiceContext);
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.notPracticing);
    });
    it('Returns NOT practicing if Kotlin class files are not capitalized', async () => {
        containerCtx.virtualFileSystemService.setFileSystem({
            'incorrectNamingConvention.kt': '',
        });
        const evaluated = await practice.evaluate(containerCtx.practiceContext);
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.notPracticing);
    });
    it('Returns practicing on deep Java class files are using correct naming conventions', async () => {
        containerCtx.virtualFileSystemService.setFileSystem({
            'CorrectNamingConvention.java': '',
            'src/main/java/org/vision/root/CronOperations/PreciselyCorrectNamingConvention.java': '',
            'src/main/java/org/vision/root/CronOperations/VeryCorrectNamingConvention.java': '',
        });
        const evaluated = await practice.evaluate(containerCtx.practiceContext);
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.practicing);
    });
    it('Returns practicing on deep Kotlin class files are using correct naming conventions', async () => {
        containerCtx.virtualFileSystemService.setFileSystem({
            'CorrectNamingConvention.kt': '',
            'src/main/java/org/vision/root/CronOperations/PreciselyCorrectNamingConvention.kt': '',
            'src/main/java/org/vision/root/CronOperations/VeryCorrectNamingConvention.kt': '',
        });
        const evaluated = await practice.evaluate(containerCtx.practiceContext);
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.practicing);
    });
    it('Returns NOT practicing on deep Kotlin class files are using incorrect naming conventions', async () => {
        containerCtx.virtualFileSystemService.setFileSystem({
            'CorrectNamingConvention.kt': '',
            'src/main/java/org/vision/root/CronOperations/VeryCorrectNamingConvention.kt': '',
            'src/main/java/org/vision/root/CronOperations/incorrectNamingConvention.kt': '',
        });
        const evaluated = await practice.evaluate(containerCtx.practiceContext);
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.notPracticing);
    });
    it('Returns unknown if there are no .java or .kt files', async () => {
        containerCtx.virtualFileSystemService.setFileSystem({
            'pom.xml': '...',
            'build.gradle': '...',
        });
        const evaluated = await practice.evaluate(containerCtx.practiceContext);
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.unknown);
    });
    it('Does not evaluate & skips build.gradle.kts file to check other class files', async () => {
        containerCtx.virtualFileSystemService.setFileSystem({
            'pom.xml': '...',
            'build.gradle.kts': '...',
            'src/main/java/org/vision/root/CronOperations/VeryCorrectNamingConvention.kt': '',
        });
        const evaluated = await practice.evaluate(containerCtx.practiceContext);
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.practicing);
    });
    it('Returns unknown if there is no fileInspector', async () => {
        const evaluated = await practice.evaluate(Object.assign(Object.assign({}, containerCtx.practiceContext), { fileInspector: undefined }));
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.unknown);
    });
    it('Is applicable to Java', async () => {
        containerCtx.practiceContext.projectComponent.language = model_1.ProgrammingLanguage.Java;
        const result = await practice.isApplicable(containerCtx.practiceContext);
        expect(result).toEqual(true);
    });
    it('Is applicable to Kotlin', async () => {
        containerCtx.practiceContext.projectComponent.language = model_1.ProgrammingLanguage.Kotlin;
        const result = await practice.isApplicable(containerCtx.practiceContext);
        expect(result).toEqual(true);
    });
    it('Is not applicable to other languages', async () => {
        containerCtx.practiceContext.projectComponent.language = model_1.ProgrammingLanguage.Swift;
        const result = await practice.isApplicable(containerCtx.practiceContext);
        expect(result).toEqual(false);
    });
});
//# sourceMappingURL=JavaNamingConventionsPractice.spec.js.map