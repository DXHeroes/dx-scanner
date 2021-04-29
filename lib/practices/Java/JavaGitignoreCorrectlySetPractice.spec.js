"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JavaGitignoreCorrectlySetPractice_1 = require("./JavaGitignoreCorrectlySetPractice");
const model_1 = require("../../model");
const inversify_config_1 = require("../../inversify.config");
const pomXMLContents_mock_1 = require("../../detectors/__MOCKS__/Java/pomXMLContents.mock");
const buildGRADLEContents_mock_1 = require("../../detectors/__MOCKS__/Java/buildGRADLEContents.mock");
const gitignoreContent_mock_1 = require("../../detectors/__MOCKS__/Java/gitignoreContent.mock");
const errors_1 = require("../../lib/errors");
describe('JavaGitignoreCorrectlySetPractice', () => {
    let practice;
    let containerCtx;
    beforeAll(() => {
        containerCtx = inversify_config_1.createTestContainer();
        containerCtx.container.bind('JavaGitignoreCorrectlySetPractice').to(JavaGitignoreCorrectlySetPractice_1.JavaGitignoreCorrectlySetPractice);
        practice = containerCtx.container.get('JavaGitignoreCorrectlySetPractice');
    });
    afterEach(async () => {
        containerCtx.virtualFileSystemService.clearFileSystem();
        containerCtx.practiceContext.fileInspector.purgeCache();
    });
    it('Returns practicing if the .gitignore is set correctly for MAVEN', async () => {
        containerCtx.virtualFileSystemService.setFileSystem({
            '.gitignore': gitignoreContent_mock_1.gitignoreContent,
            'pom.xml': pomXMLContents_mock_1.pomXMLContents,
        });
        const evaluated = await practice.evaluate(containerCtx.practiceContext);
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.practicing);
    });
    it('Returns practicing if the .gitignore is set correctly for GRADLE', async () => {
        containerCtx.virtualFileSystemService.setFileSystem({
            '.gitignore': gitignoreContent_mock_1.gitignoreContent,
            'build.gradle': buildGRADLEContents_mock_1.buildGRADLEContents,
        });
        const evaluated = await practice.evaluate(containerCtx.practiceContext);
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.practicing);
    });
    it('Returns practicing if the .gitignore is set correctly for Kotlin/GRADLE', async () => {
        containerCtx.virtualFileSystemService.setFileSystem({
            '.gitignore': gitignoreContent_mock_1.gitignoreContent,
            'build.gradle.kts': buildGRADLEContents_mock_1.buildGRADLEContents,
        });
        const evaluated = await practice.evaluate(containerCtx.practiceContext);
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.practicing);
    });
    it('Returns notPracticing if there the .gitignore is NOT set correctly', async () => {
        containerCtx.virtualFileSystemService.setFileSystem({
            '.gitignore': '...',
        });
        const evaluated = await practice.evaluate(containerCtx.practiceContext);
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.notPracticing);
    });
    // TODO: Throw errors everywhere?
    xit('Throw internal error if there is no fileInspector', async () => {
        const thrown = jest.fn();
        try {
            await practice.evaluate(Object.assign(Object.assign({}, containerCtx.practiceContext), { fileInspector: undefined }));
        }
        catch (error) {
            thrown();
            expect(error.code).toEqual(errors_1.ErrorCode.INTERNAL_ERROR);
        }
        expect(thrown).toBeCalled();
    });
    it('Returns notPracticing if there is *.class, *.log, *.jar, *.war in .gitignore but not correctly set for build.gradle', async () => {
        containerCtx.virtualFileSystemService.setFileSystem({
            '.gitignore': `
      *.class
      *.log
      *.jar
      *.war`,
            'build.gradle': buildGRADLEContents_mock_1.buildGRADLEContents,
        });
        const evaluated = await practice.evaluate(containerCtx.practiceContext);
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.notPracticing);
    });
    it('Returns notPracticing if there is *.class, *.log, *.jar, *.war in .gitignore but not correctly set for build.gradle.kts', async () => {
        containerCtx.virtualFileSystemService.setFileSystem({
            '.gitignore': `
      *.class
      *.log
      *.jar
      *.war`,
            'build.gradle.kts': buildGRADLEContents_mock_1.buildGRADLEContents,
        });
        const evaluated = await practice.evaluate(containerCtx.practiceContext);
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.notPracticing);
    });
    it('Returns notPracticing if there is *.class, *.log, *.jar, *.war in .gitignore but not correctly set for pom.xml', async () => {
        containerCtx.virtualFileSystemService.setFileSystem({
            '.gitignore': `
      *.class
      *.log
      *.jar
      *.war`,
            'pom.xml': pomXMLContents_mock_1.pomXMLContents,
        });
        const evaluated = await practice.evaluate(containerCtx.practiceContext);
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.notPracticing);
    });
    it('Returns practicing if there is correctly set .gitignore, but no pom.xml and build.gradle or build.gradle.kts', async () => {
        containerCtx.virtualFileSystemService.setFileSystem({
            '.gitignore': gitignoreContent_mock_1.gitignoreContent,
        });
        const evaluated = await practice.evaluate(containerCtx.practiceContext);
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.practicing);
    });
    it('Returns true if language is Java', async () => {
        containerCtx.practiceContext.projectComponent.language = model_1.ProgrammingLanguage.Java;
        const isApplicable = await practice.isApplicable(containerCtx.practiceContext);
        expect(isApplicable).toBe(true);
    });
    it('Returns true if language is Kotlin', async () => {
        containerCtx.practiceContext.projectComponent.language = model_1.ProgrammingLanguage.Kotlin;
        const result = await practice.isApplicable(containerCtx.practiceContext);
        expect(result).toEqual(true);
    });
    it('Returns false if language is not Java', async () => {
        containerCtx.practiceContext.projectComponent.language = model_1.ProgrammingLanguage.UNKNOWN;
        const isApplicable = await practice.isApplicable(containerCtx.practiceContext);
        expect(isApplicable).toBe(false);
    });
});
//# sourceMappingURL=JavaGitignoreCorrectlySetPractice.spec.js.map