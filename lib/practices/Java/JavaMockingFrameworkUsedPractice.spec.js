"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JavaMockingFrameworkUsedPractice_1 = require("./JavaMockingFrameworkUsedPractice");
const model_1 = require("../../model");
const inversify_config_1 = require("../../inversify.config");
describe('JavaMockingFrameworkUsedPractice', () => {
    let practice;
    let containerCtx;
    let packageInspector;
    beforeAll(() => {
        containerCtx = inversify_config_1.createTestContainer();
        containerCtx.container.bind('JavaMockingFrameworkUsedPractice').to(JavaMockingFrameworkUsedPractice_1.JavaMockingFrameworkUsedPractice);
        practice = containerCtx.container.get('JavaMockingFrameworkUsedPractice');
        packageInspector = containerCtx.practiceContext.packageInspector;
    });
    it('Detects Java Mocking framework', async () => {
        packageInspector.hasOneOfPackages = () => true;
        const result = await practice.evaluate(containerCtx.practiceContext);
        expect(result).toEqual(model_1.PracticeEvaluationResult.practicing);
    });
    it('Did not detect Java Mocking framework', async () => {
        packageInspector.hasOneOfPackages = () => false;
        const result = await practice.evaluate(containerCtx.practiceContext);
        expect(result).toEqual(model_1.PracticeEvaluationResult.notPracticing);
    });
    it('Did not recognize packageInspector', async () => {
        const result = await practice.evaluate(Object.assign(Object.assign({}, containerCtx.practiceContext), { packageInspector: undefined }));
        expect(result).toEqual(model_1.PracticeEvaluationResult.unknown);
    });
    it('Is applicable if it is Java', async () => {
        containerCtx.practiceContext.projectComponent.language = model_1.ProgrammingLanguage.Java;
        const result = await practice.isApplicable(containerCtx.practiceContext);
        expect(result).toEqual(true);
    });
    it('Is applicable if it is Kotlin', async () => {
        containerCtx.practiceContext.projectComponent.language = model_1.ProgrammingLanguage.Kotlin;
        const result = await practice.isApplicable(containerCtx.practiceContext);
        expect(result).toEqual(true);
    });
    it('Is not applicable if it is not Java', async () => {
        containerCtx.practiceContext.projectComponent.language = model_1.ProgrammingLanguage.Python;
        const result = await practice.isApplicable(containerCtx.practiceContext);
        expect(result).toEqual(false);
    });
});
//# sourceMappingURL=JavaMockingFrameworkUsedPractice.spec.js.map