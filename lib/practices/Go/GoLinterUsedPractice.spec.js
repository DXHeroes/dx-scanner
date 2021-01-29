"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_config_1 = require("../../inversify.config");
const model_1 = require("../../model");
const GoLinterUsedPractice_1 = require("./GoLinterUsedPractice");
describe('GoLinterUsedPractice', () => {
    let practice;
    let containerCtx;
    let packageInspector;
    beforeAll(() => {
        containerCtx = inversify_config_1.createTestContainer();
        containerCtx.container.bind('GoLinterUsedPractice').to(GoLinterUsedPractice_1.GoLinterUsedPractice);
        practice = containerCtx.container.get('GoLinterUsedPractice');
        packageInspector = containerCtx.practiceContext.packageInspector;
    });
    it('Detects a Go linter dependency', async () => {
        packageInspector.hasOneOfPackages = () => true;
        const result = await practice.evaluate(containerCtx.practiceContext);
        expect(result).toEqual(model_1.PracticeEvaluationResult.practicing);
    });
    it('Did not detect a Go linter dependency', async () => {
        packageInspector.hasOneOfPackages = () => false;
        const result = await practice.evaluate(containerCtx.practiceContext);
        expect(result).toEqual(model_1.PracticeEvaluationResult.notPracticing);
    });
    it('Did not recognize packageInspector', async () => {
        const result = await practice.evaluate(Object.assign(Object.assign({}, containerCtx.practiceContext), { packageInspector: undefined }));
        expect(result).toEqual(model_1.PracticeEvaluationResult.unknown);
    });
    it('Is applicable if it is Go', async () => {
        containerCtx.practiceContext.projectComponent.language = model_1.ProgrammingLanguage.Go;
        const result = await practice.isApplicable(containerCtx.practiceContext);
        expect(result).toEqual(true);
    });
    it('Is not applicable if it is not Go', async () => {
        containerCtx.practiceContext.projectComponent.language = model_1.ProgrammingLanguage.TypeScript;
        const result = await practice.isApplicable(containerCtx.practiceContext);
        expect(result).toEqual(false);
    });
});
//# sourceMappingURL=GoLinterUsedPractice.spec.js.map