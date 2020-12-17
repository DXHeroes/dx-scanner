"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ReadmeIsPresentPractice_1 = require("./ReadmeIsPresentPractice");
const model_1 = require("../../model");
const inversify_config_1 = require("../../inversify.config");
describe('ReadmePracticeIsPresentPractice', () => {
    let practice;
    let containerCtx;
    beforeAll(() => {
        containerCtx = inversify_config_1.createTestContainer();
        containerCtx.container.bind('ReadmeIsPresentPractice').to(ReadmeIsPresentPractice_1.ReadmeIsPresentPractice);
        practice = containerCtx.container.get('ReadmeIsPresentPractice');
    });
    afterEach(async () => {
        containerCtx.virtualFileSystemService.clearFileSystem();
        containerCtx.practiceContext.fileInspector.purgeCache();
    });
    it('Returns practicing if there is a readme', async () => {
        containerCtx.virtualFileSystemService.setFileSystem({
            '/readme.anything': '...',
        });
        const evaluated = await practice.evaluate(containerCtx.practiceContext);
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.practicing);
    });
    it('Returns notPracticing if there is NO readme', async () => {
        containerCtx.virtualFileSystemService.setFileSystem({
            '/not.exists': '...',
        });
        const evaluated = await practice.evaluate(containerCtx.practiceContext);
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.notPracticing);
    });
    it('Returns unknown if there is no fileInspector', async () => {
        const evaluated = await practice.evaluate(Object.assign(Object.assign({}, containerCtx.practiceContext), { fileInspector: undefined }));
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.unknown);
    });
    it('Is always applicable', async () => {
        const result = await practice.isApplicable();
        expect(result).toEqual(true);
    });
});
//# sourceMappingURL=ReadmeIsPresentPractice.spec.js.map