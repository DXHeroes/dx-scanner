"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PHPLinterUsedPractice_1 = require("./PHPLinterUsedPractice");
const model_1 = require("../../model");
const inversify_config_1 = require("../../inversify.config");
describe('PHPLinterUsedPractice', () => {
    let practice;
    let containerCtx;
    let packageInspector;
    beforeAll(() => {
        containerCtx = inversify_config_1.createTestContainer();
        containerCtx.container.bind('PHPLinterUsedPractice').to(PHPLinterUsedPractice_1.PHPLinterUsedPractice);
        practice = containerCtx.container.get('PHPLinterUsedPractice');
        packageInspector = containerCtx.practiceContext.packageInspector;
    });
    it('Detects a PHP linter dependency', async () => {
        packageInspector.hasOneOfPackages = () => true;
        const result = await practice.evaluate(containerCtx.practiceContext);
        expect(result).toEqual(model_1.PracticeEvaluationResult.practicing);
    });
    it('Did not detect a PHP linter dependency', async () => {
        packageInspector.hasOneOfPackages = () => false;
        const result = await practice.evaluate(containerCtx.practiceContext);
        expect(result).toEqual(model_1.PracticeEvaluationResult.notPracticing);
    });
    it('Did not recognize packageInspector', async () => {
        const result = await practice.evaluate(Object.assign(Object.assign({}, containerCtx.practiceContext), { packageInspector: undefined }));
        expect(result).toEqual(model_1.PracticeEvaluationResult.unknown);
    });
    it('Is applicable if it is PHP', async () => {
        containerCtx.practiceContext.projectComponent.language = model_1.ProgrammingLanguage.PHP;
        const result = await practice.isApplicable(containerCtx.practiceContext);
        expect(result).toEqual(true);
    });
    it('Is not applicable if it is not PHP', async () => {
        containerCtx.practiceContext.projectComponent.language = model_1.ProgrammingLanguage.Haskell;
        const result = await practice.isApplicable(containerCtx.practiceContext);
        expect(result).toEqual(false);
    });
});
//# sourceMappingURL=PHPLinterUsedPractice.spec.js.map