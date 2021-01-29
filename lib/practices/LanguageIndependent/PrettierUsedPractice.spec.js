"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PrettierUsedPractice_1 = require("../JavaScript/PrettierUsedPractice");
const model_1 = require("../../model");
const inversify_config_1 = require("../../inversify.config");
describe('PrettierUsedPractice', () => {
    let practice;
    let containerCtx;
    let packageInspector;
    beforeAll(() => {
        containerCtx = inversify_config_1.createTestContainer();
        containerCtx.container.bind('PrettierUsedPractice').to(PrettierUsedPractice_1.PrettierUsedPractice);
        practice = containerCtx.container.get('PrettierUsedPractice');
        packageInspector = containerCtx.practiceContext.packageInspector;
    });
    it('Detects Prettier', async () => {
        packageInspector.hasOneOfPackages = () => true;
        const result = await practice.evaluate(containerCtx.practiceContext);
        expect(result).toEqual(model_1.PracticeEvaluationResult.practicing);
    });
    it('Did not detect Prettier', async () => {
        packageInspector.hasOneOfPackages = () => false;
        const result = await practice.evaluate(containerCtx.practiceContext);
        expect(result).toEqual(model_1.PracticeEvaluationResult.notPracticing);
    });
    it('Did not recognize packageInspector', async () => {
        const result = await practice.evaluate(Object.assign(Object.assign({}, containerCtx.practiceContext), { packageInspector: undefined }));
        expect(result).toEqual(model_1.PracticeEvaluationResult.unknown);
    });
});
//# sourceMappingURL=PrettierUsedPractice.spec.js.map