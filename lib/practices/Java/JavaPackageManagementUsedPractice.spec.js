"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JavaPackageManagementUsedPractice_1 = require("./JavaPackageManagementUsedPractice");
const model_1 = require("../../model");
const inversify_config_1 = require("../../inversify.config");
const pomXMLContents_mock_1 = require("../../detectors/__MOCKS__/Java/pomXMLContents.mock");
const buildGRADLEContents_mock_1 = require("../../detectors/__MOCKS__/Java/buildGRADLEContents.mock");
describe('JavaPackageManagementUsedPractice', () => {
    let practice;
    let containerCtx;
    beforeAll(() => {
        containerCtx = inversify_config_1.createTestContainer();
        containerCtx.container.bind('JavaPackageManagementUsedPractice').to(JavaPackageManagementUsedPractice_1.JavaPackageManagementUsedPractice);
        practice = containerCtx.container.get('JavaPackageManagementUsedPractice');
    });
    afterEach(async () => {
        containerCtx.virtualFileSystemService.clearFileSystem();
        containerCtx.practiceContext.fileInspector.purgeCache();
    });
    it('Returns practicing if there is a pom.xml', async () => {
        containerCtx.virtualFileSystemService.setFileSystem({
            'pom.xml': pomXMLContents_mock_1.pomXMLContents,
        });
        const evaluated = await practice.evaluate(containerCtx.practiceContext);
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.practicing);
    });
    it('Returns practicing if there is a build.gradle', async () => {
        containerCtx.virtualFileSystemService.setFileSystem({
            'build.gradle': buildGRADLEContents_mock_1.buildGRADLEContents,
        });
        const evaluated = await practice.evaluate(containerCtx.practiceContext);
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.practicing);
    });
    it('Returns practicing if there is a build.gradle.kts', async () => {
        containerCtx.virtualFileSystemService.setFileSystem({
            'build.gradle.kts': buildGRADLEContents_mock_1.buildGRADLEContents,
        });
        const evaluated = await practice.evaluate(containerCtx.practiceContext);
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.practicing);
    });
    it('Returns notPracticing if there is NO pom.xml or build.gradle', async () => {
        containerCtx.virtualFileSystemService.setFileSystem({
            'not.exists': '...',
        });
        const evaluated = await practice.evaluate(containerCtx.practiceContext);
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.notPracticing);
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
    it('Is applicable if it is Kotlin', async () => {
        containerCtx.practiceContext.projectComponent.language = model_1.ProgrammingLanguage.Kotlin;
        const result = await practice.isApplicable(containerCtx.practiceContext);
        expect(result).toEqual(true);
    });
    it('Is not applicable to other languages', async () => {
        containerCtx.practiceContext.projectComponent.language = model_1.ProgrammingLanguage.Python;
        const result = await practice.isApplicable(containerCtx.practiceContext);
        expect(result).toEqual(false);
    });
});
//# sourceMappingURL=JavaPackageManagementUsedPractice.spec.js.map