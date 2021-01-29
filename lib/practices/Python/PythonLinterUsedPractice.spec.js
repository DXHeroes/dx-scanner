"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PythonLinterUsedPractice_1 = require("./PythonLinterUsedPractice");
const model_1 = require("../../model");
const inversify_config_1 = require("../../inversify.config");
describe('PythonLinterUsedPractice', () => {
    let practice;
    let containerCtx;
    let packageInspector;
    beforeAll(() => {
        containerCtx = inversify_config_1.createTestContainer();
        containerCtx.container.bind('PythonLinterUsedPractice').to(PythonLinterUsedPractice_1.PythonLinterUsedPractice);
        practice = containerCtx.container.get('PythonLinterUsedPractice');
        packageInspector = containerCtx.practiceContext.packageInspector;
    });
    it('Detects a Python linter dependency', async () => {
        packageInspector.hasOneOfPackages = () => true;
        const result = await practice.evaluate(containerCtx.practiceContext);
        expect(result).toEqual(model_1.PracticeEvaluationResult.practicing);
    });
    it('Did not detect a Python linter dependency', async () => {
        packageInspector.hasOneOfPackages = () => false;
        const result = await practice.evaluate(containerCtx.practiceContext);
        expect(result).toEqual(model_1.PracticeEvaluationResult.notPracticing);
    });
    it('Did not recognize packageInspector', async () => {
        const result = await practice.evaluate(Object.assign(Object.assign({}, containerCtx.practiceContext), { packageInspector: undefined }));
        expect(result).toEqual(model_1.PracticeEvaluationResult.unknown);
    });
    it('Is applicable if it is Python', async () => {
        containerCtx.practiceContext.projectComponent.language = model_1.ProgrammingLanguage.Python;
        const result = await practice.isApplicable(containerCtx.practiceContext);
        expect(result).toEqual(true);
    });
    it('Is not applicable if it is not Python', async () => {
        containerCtx.practiceContext.projectComponent.language = model_1.ProgrammingLanguage.Haskell;
        const result = await practice.isApplicable(containerCtx.practiceContext);
        expect(result).toEqual(false);
    });
});
//# sourceMappingURL=PythonLinterUsedPractice.spec.js.map