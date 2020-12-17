"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_1 = require("../../model");
const JsBackendTestingFrameworkUsedPractice_1 = require("./JsBackendTestingFrameworkUsedPractice");
const model_2 = require("../../model");
const inversify_config_1 = require("../../inversify.config");
describe('JsBackendTestingFrameworkUsedPractice', () => {
    let practice;
    let containerCtx;
    let packageInspector;
    beforeAll(() => {
        containerCtx = inversify_config_1.createTestContainer();
        containerCtx.container.bind('JsBackendTestingFrameworkUsedPractice').to(JsBackendTestingFrameworkUsedPractice_1.JsBackendTestingFrameworkUsedPractice);
        practice = containerCtx.container.get('JsBackendTestingFrameworkUsedPractice');
        packageInspector = containerCtx.practiceContext.packageInspector;
    });
    it('Detects BE testing framework', async () => {
        packageInspector.hasOneOfPackages = () => true;
        const result = await practice.evaluate(containerCtx.practiceContext);
        expect(result).toEqual(model_2.PracticeEvaluationResult.practicing);
    });
    it('Did not detect BE testing framework', async () => {
        packageInspector.hasOneOfPackages = () => false;
        const result = await practice.evaluate(containerCtx.practiceContext);
        expect(result).toEqual(model_2.PracticeEvaluationResult.notPracticing);
    });
    it('Did not recognize packageInspector', async () => {
        const result = await practice.evaluate(Object.assign(Object.assign({}, containerCtx.practiceContext), { packageInspector: undefined }));
        expect(result).toEqual(model_2.PracticeEvaluationResult.unknown);
    });
    it('Is TypeScript or Javascript but not backend', async () => {
        containerCtx.practiceContext.projectComponent.language = model_1.ProgrammingLanguage.JavaScript;
        containerCtx.practiceContext.projectComponent.platform = model_1.ProjectComponentPlatform.UNKNOWN;
        const result = await practice.isApplicable(containerCtx.practiceContext);
        expect(result).toEqual(false);
    });
    it('Is applicable if it is JavaScript', async () => {
        containerCtx.practiceContext.projectComponent.language = model_1.ProgrammingLanguage.JavaScript;
        containerCtx.practiceContext.projectComponent.platform = model_1.ProjectComponentPlatform.BackEnd;
        const result = await practice.isApplicable(containerCtx.practiceContext);
        expect(result).toEqual(true);
    });
    it('Is applicable if it is TypeScript', async () => {
        containerCtx.practiceContext.projectComponent.language = model_1.ProgrammingLanguage.TypeScript;
        containerCtx.practiceContext.projectComponent.platform = model_1.ProjectComponentPlatform.BackEnd;
        const result = await practice.isApplicable(containerCtx.practiceContext);
        expect(result).toEqual(true);
    });
});
//# sourceMappingURL=JsBackendTestingFrameworkUsedPractice.spec.js.map