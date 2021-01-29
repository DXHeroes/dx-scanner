"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ESLintUsedPractice_1 = require("./ESLintUsedPractice");
const model_1 = require("../../model");
const model_2 = require("../../model");
const inversify_config_1 = require("../../inversify.config");
describe('ESLintUsedPractice', () => {
    let practice;
    let containerCtx;
    let packageInspector;
    beforeAll(() => {
        containerCtx = inversify_config_1.createTestContainer();
        containerCtx.container.bind('ESLintUsedPractice').to(ESLintUsedPractice_1.ESLintUsedPractice);
        practice = containerCtx.container.get('ESLintUsedPractice');
        packageInspector = containerCtx.practiceContext.packageInspector;
    });
    it('Returns true if lang is a JavaScript or TypeScript', async () => {
        const result = await practice.isApplicable(containerCtx.practiceContext);
        expect(result).toEqual(true);
    });
    it('Returns false if lang is NOT a JavaScript or TypeScript', async () => {
        containerCtx.practiceContext.projectComponent.language = model_1.ProgrammingLanguage.UNKNOWN;
        const result = await practice.isApplicable(containerCtx.practiceContext);
        expect(result).toEqual(false);
    });
    it('Detects ESLint', async () => {
        packageInspector.hasPackage = () => true;
        const result = await practice.evaluate(containerCtx.practiceContext);
        expect(result).toEqual(model_2.PracticeEvaluationResult.practicing);
    });
    it('Did not detect ESLint', async () => {
        packageInspector.hasPackage = () => false;
        const result = await practice.evaluate(containerCtx.practiceContext);
        expect(result).toEqual(model_2.PracticeEvaluationResult.notPracticing);
    });
    it('Did not detect ESLint and did not recognize packageInspector', async () => {
        const result = await practice.evaluate(Object.assign(Object.assign({}, containerCtx.practiceContext), { packageInspector: undefined }));
        expect(result).toEqual(model_2.PracticeEvaluationResult.unknown);
    });
});
//# sourceMappingURL=ESLintUsedPractice.spec.js.map