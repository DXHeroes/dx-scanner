"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CIUsedPractice_1 = require("./CIUsedPractice");
const model_1 = require("../../model");
const inversify_config_1 = require("../../inversify.config");
describe('CIUsedPractice', () => {
    let practice;
    let containerCtx;
    beforeAll(() => {
        containerCtx = inversify_config_1.createTestContainer();
        containerCtx.container.bind('CIUsedPractice').to(CIUsedPractice_1.CIUsedPractice);
        practice = containerCtx.container.get('CIUsedPractice');
    });
    afterEach(async () => {
        containerCtx.virtualFileSystemService.clearFileSystem();
        containerCtx.practiceContext.fileInspector.purgeCache();
    });
    it('Returns practicing if there is a .gitlab-ci.yml', async () => {
        containerCtx.virtualFileSystemService.setFileSystem({
            '/.gitlab-ci.yml': '...',
        });
        const evaluated = await practice.evaluate(containerCtx.practiceContext);
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.practicing);
    });
    it('Returns practicing if there are YAML files inside .github/workflows folder', async () => {
        containerCtx.virtualFileSystemService.setFileSystem({
            '/.github/workflows/any-file.yml': '...',
        });
        const evaluated = await practice.evaluate(containerCtx.practiceContext);
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.practicing);
    });
    it('Returns practicing if there is a appveyor.yml for a Appveyor CI', async () => {
        containerCtx.virtualFileSystemService.setFileSystem({
            '/appveyor.yml': '...',
        });
        const evaluated = await practice.evaluate(containerCtx.practiceContext);
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.practicing);
    });
    it('Returns notPracticing if there is NO .gitlab-ci.yml', async () => {
        containerCtx.virtualFileSystemService.setFileSystem({
            'not.exists': '...',
        });
        const evaluated = await practice.evaluate(containerCtx.practiceContext);
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.notPracticing);
    });
    it('Returns notPracticing if there are NO YAML files inside .github/workflows folder', async () => {
        containerCtx.virtualFileSystemService.setFileSystem({
            '/.github/workflows/not.exists': '...',
        });
        const evaluated = await practice.evaluate(containerCtx.practiceContext);
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.notPracticing);
    });
    it('Returns unknown if there is no fileInspector', async () => {
        const evaluated = await practice.evaluate(Object.assign(Object.assign({}, containerCtx.practiceContext), { root: { fileInspector: undefined } }));
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.unknown);
    });
    it('Is always applicable', async () => {
        const result = await practice.isApplicable();
        expect(result).toEqual(true);
    });
});
//# sourceMappingURL=CIUsedPractice.spec.js.map