"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SwiftLintUsedPractice_1 = require("./SwiftLintUsedPractice");
const model_1 = require("../../model");
const model_2 = require("../../model");
const inversify_config_1 = require("../../inversify.config");
describe('SwiftLintUsedPractice', () => {
    let practice;
    let containerCtx;
    let packageInspector;
    beforeAll(() => {
        containerCtx = inversify_config_1.createTestContainer();
        containerCtx.container.bind('SwiftLintUsedPractice').to(SwiftLintUsedPractice_1.SwiftLintUsedPractice);
        practice = containerCtx.container.get('SwiftLintUsedPractice');
        packageInspector = containerCtx.practiceContext.packageInspector;
    });
    it('Returns true if lang is Swift', async () => {
        containerCtx.practiceContext.projectComponent.language = model_1.ProgrammingLanguage.Swift;
        const result = await practice.isApplicable(containerCtx.practiceContext);
        expect(result).toEqual(true);
    });
    it('Returns false if lang is NOT Swift', async () => {
        containerCtx.practiceContext.projectComponent.language = model_1.ProgrammingLanguage.UNKNOWN;
        const result = await practice.isApplicable(containerCtx.practiceContext);
        expect(result).toEqual(false);
    });
    it('Detects SwiftLint', async () => {
        packageInspector.hasPackage = () => true;
        const result = await practice.evaluate(containerCtx.practiceContext);
        expect(result).toEqual(model_2.PracticeEvaluationResult.practicing);
    });
    it('Did not detect SwiftLint', async () => {
        packageInspector.hasPackage = () => false;
        const result = await practice.evaluate(containerCtx.practiceContext);
        expect(result).toEqual(model_2.PracticeEvaluationResult.notPracticing);
    });
    it('Did not detect SwiftLint and did not recognize packageInspector', async () => {
        const result = await practice.evaluate(Object.assign(Object.assign({}, containerCtx.practiceContext), { packageInspector: undefined }));
        expect(result).toEqual(model_2.PracticeEvaluationResult.unknown);
    });
});
//# sourceMappingURL=SwiftLintUsedPractice.spec.js.map