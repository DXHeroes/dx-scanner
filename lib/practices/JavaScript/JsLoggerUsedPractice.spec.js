"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JsLoggerUsedPractice_1 = require("./JsLoggerUsedPractice");
const model_1 = require("../../model");
const inversify_config_1 = require("../../inversify.config");
describe('JsLoggerUsedPractice', () => {
    let practice;
    let containerCtx;
    let packageInspector;
    beforeAll(() => {
        containerCtx = inversify_config_1.createTestContainer();
        containerCtx.container.bind('JsLoggerUsedPractice').to(JsLoggerUsedPractice_1.JsLoggerUsedPractice);
        practice = containerCtx.container.get('JsLoggerUsedPractice');
        packageInspector = containerCtx.practiceContext.packageInspector;
    });
    it('Detects JS logger', async () => {
        packageInspector.hasOneOfPackages = () => true;
        const result = await practice.evaluate(containerCtx.practiceContext);
        expect(result).toEqual(model_1.PracticeEvaluationResult.practicing);
    });
    it('Did not detect JS Logger', async () => {
        packageInspector.hasOneOfPackages = () => false;
        const result = await practice.evaluate(containerCtx.practiceContext);
        expect(result).toEqual(model_1.PracticeEvaluationResult.notPracticing);
    });
    it('Did not recognize packageInspector', async () => {
        const result = await practice.evaluate(Object.assign(Object.assign({}, containerCtx.practiceContext), { packageInspector: undefined }));
        expect(result).toEqual(model_1.PracticeEvaluationResult.unknown);
    });
    it('Is applicable if it is JavaScript', async () => {
        containerCtx.practiceContext.projectComponent.language = model_1.ProgrammingLanguage.JavaScript;
        const result = await practice.isApplicable(containerCtx.practiceContext);
        expect(result).toEqual(true);
    });
    it('Is applicable if it is TypeScript', async () => {
        containerCtx.practiceContext.projectComponent.language = model_1.ProgrammingLanguage.TypeScript;
        const result = await practice.isApplicable(containerCtx.practiceContext);
        expect(result).toEqual(true);
    });
    it('Is applicable if it is not TypeScript nor JavaScript', async () => {
        containerCtx.practiceContext.projectComponent.language = model_1.ProgrammingLanguage.UNKNOWN;
        const result = await practice.isApplicable(containerCtx.practiceContext);
        expect(result).toEqual(false);
    });
});
//# sourceMappingURL=JsLoggerUsedPractice.spec.js.map