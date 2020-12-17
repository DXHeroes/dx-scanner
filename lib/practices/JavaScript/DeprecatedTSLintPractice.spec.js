"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_config_1 = require("../../inversify.config");
const model_1 = require("../../model");
const DeprecatedTSLintPractice_1 = require("./DeprecatedTSLintPractice");
describe('DeprecatedTSLintPractice', () => {
    let practice;
    let containerCtx;
    let packageInspector;
    beforeAll(() => {
        containerCtx = inversify_config_1.createTestContainer();
        containerCtx.container.bind('DeprecatedTSLintPractice').to(DeprecatedTSLintPractice_1.DeprecatedTSLintPractice);
        practice = containerCtx.container.get('DeprecatedTSLintPractice');
        packageInspector = containerCtx.practiceContext.packageInspector;
    });
    it('Detects TSLint', async () => {
        packageInspector.hasPackage = () => true;
        const result = await practice.evaluate(containerCtx.practiceContext);
        expect(result).toEqual(model_1.PracticeEvaluationResult.notPracticing);
    });
    it('Did not detect TSLint', async () => {
        packageInspector.hasPackage = () => false;
        const result = await practice.evaluate(containerCtx.practiceContext);
        expect(result).toEqual(model_1.PracticeEvaluationResult.practicing);
    });
    it('Did not detect TSLint and did not recognize packageInspector', async () => {
        const result = await practice.evaluate(Object.assign(Object.assign({}, containerCtx.practiceContext), { packageInspector: undefined }));
        expect(result).toEqual(model_1.PracticeEvaluationResult.unknown);
    });
});
//# sourceMappingURL=DeprecatedTSLintPractice.spec.js.map