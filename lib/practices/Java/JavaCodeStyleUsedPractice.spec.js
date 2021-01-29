"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JavaCodeStyleUsedPractice_1 = require("./JavaCodeStyleUsedPractice");
const model_1 = require("../../model");
const inversify_config_1 = require("../../inversify.config");
const pomXMLContents_mock_1 = require("../../detectors/__MOCKS__/Java/pomXMLContents.mock");
const buildGRADLEContents_mock_1 = require("../../detectors/__MOCKS__/Java/buildGRADLEContents.mock");
const styleXMLContents_mock_1 = require("../../detectors/__MOCKS__/Java/styleXMLContents.mock");
describe('JavaCodeStyleUsedPractice', () => {
    let practice;
    let containerCtx;
    let packageInspector;
    beforeAll(() => {
        containerCtx = inversify_config_1.createTestContainer();
        containerCtx.container.bind('JavaCodeStyleUsedPractice').to(JavaCodeStyleUsedPractice_1.JavaCodeStyleUsedPractice);
        practice = containerCtx.container.get('JavaCodeStyleUsedPractice');
        packageInspector = containerCtx.practiceContext.packageInspector;
    });
    afterEach(async () => {
        containerCtx.virtualFileSystemService.clearFileSystem();
        containerCtx.practiceContext.fileInspector.purgeCache();
    });
    it('Returns practicing if there is a Google Code Style *.xml configuration file', async () => {
        containerCtx.virtualFileSystemService.setFileSystem({
            'intellij-java-google-style.xml': styleXMLContents_mock_1.codeStyleXML,
            'pom.xml': pomXMLContents_mock_1.pomXMLContents,
        });
        const evaluated = await practice.evaluate(containerCtx.practiceContext);
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.practicing);
    });
    it('Returns practicing if there is a package for code styles', async () => {
        packageInspector.hasOneOfPackages = () => true;
        const result = await practice.evaluate(containerCtx.practiceContext);
        expect(result).toEqual(model_1.PracticeEvaluationResult.practicing);
    });
    it('Returns notPracticing if there is no package or xml file', async () => {
        packageInspector.hasOneOfPackages = () => false;
        containerCtx.virtualFileSystemService.setFileSystem({
            'build.gradle.kts': buildGRADLEContents_mock_1.buildGRADLEContents,
        });
        const evaluated = await practice.evaluate(containerCtx.practiceContext);
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.notPracticing);
    });
    it('Returns unknown if there is no fileInspector', async () => {
        const evaluated = await practice.evaluate(Object.assign(Object.assign({}, containerCtx.practiceContext), { fileInspector: undefined }));
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.unknown);
    });
    it('Returns unknown if there is no packageInspector', async () => {
        const evaluated = await practice.evaluate(Object.assign(Object.assign({}, containerCtx.practiceContext), { packageInspector: undefined }));
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.unknown);
    });
    it('Is applicable only to Java', async () => {
        containerCtx.practiceContext.projectComponent.language = model_1.ProgrammingLanguage.Java;
        const result = await practice.isApplicable(containerCtx.practiceContext);
        expect(result).toEqual(true);
    });
    it('Is not applicable to other languages', async () => {
        containerCtx.practiceContext.projectComponent.language = model_1.ProgrammingLanguage.Ruby;
        const result = await practice.isApplicable(containerCtx.practiceContext);
        expect(result).toEqual(false);
    });
});
//# sourceMappingURL=JavaCodeStyleUsedPractice.spec.js.map