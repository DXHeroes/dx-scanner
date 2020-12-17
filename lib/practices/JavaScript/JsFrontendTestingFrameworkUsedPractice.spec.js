"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_1 = require("../../model");
const JsFrontendTestingFrameworkUsedPractice_1 = require("./JsFrontendTestingFrameworkUsedPractice");
const model_2 = require("../../model");
const inversify_config_1 = require("../../inversify.config");
describe('JsFrontendTestingFrameworkUsedPractice', () => {
    let practice;
    let containerCtx;
    let packageInspector;
    beforeAll(() => {
        containerCtx = inversify_config_1.createTestContainer();
        containerCtx.container.bind('JsFrontendTestingFrameworkUsedPractice').to(JsFrontendTestingFrameworkUsedPractice_1.JsFrontendTestingFrameworkUsedPractice);
        practice = containerCtx.container.get('JsFrontendTestingFrameworkUsedPractice');
        packageInspector = containerCtx.practiceContext.packageInspector;
    });
    it('Detects FE testing framework', async () => {
        packageInspector.hasOneOfPackages = () => true;
        const result = await practice.evaluate(containerCtx.practiceContext);
        expect(result).toEqual(model_2.PracticeEvaluationResult.practicing);
    });
    it('Detects FE testing framework', async () => {
        packageInspector.hasOneOfPackages = () => false;
        const result = await practice.evaluate(containerCtx.practiceContext);
        expect(result).toEqual(model_2.PracticeEvaluationResult.notPracticing);
    });
    it('Did not recognize packageInspector', async () => {
        const result = await practice.evaluate(Object.assign(Object.assign({}, containerCtx.practiceContext), { packageInspector: undefined }));
        expect(result).toEqual(model_2.PracticeEvaluationResult.unknown);
    });
    it('Is TypeScript or Javascript but not frontend', async () => {
        containerCtx.practiceContext.projectComponent.language = model_1.ProgrammingLanguage.JavaScript;
        containerCtx.practiceContext.projectComponent.platform = model_1.ProjectComponentPlatform.UNKNOWN;
        const result = await practice.isApplicable(containerCtx.practiceContext);
        expect(result).toEqual(false);
    });
    it('Is applicable if it is JavaScript', async () => {
        containerCtx.practiceContext.projectComponent.language = model_1.ProgrammingLanguage.JavaScript;
        containerCtx.practiceContext.projectComponent.platform = model_1.ProjectComponentPlatform.FrontEnd;
        const result = await practice.isApplicable(containerCtx.practiceContext);
        expect(result).toEqual(true);
    });
    it('Is applicable if it is TypeScript', async () => {
        containerCtx.practiceContext.projectComponent.language = model_1.ProgrammingLanguage.TypeScript;
        containerCtx.practiceContext.projectComponent.platform = model_1.ProjectComponentPlatform.FrontEnd;
        const result = await practice.isApplicable(containerCtx.practiceContext);
        expect(result).toEqual(true);
    });
});
//# sourceMappingURL=JsFrontendTestingFrameworkUsedPractice.spec.js.map