"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DockerizationUsedPractice_1 = require("./DockerizationUsedPractice");
const model_1 = require("../../model");
const inversify_config_1 = require("../../inversify.config");
describe('DockerizationUsedPractice', () => {
    let practice;
    let containerCtx;
    beforeAll(() => {
        containerCtx = inversify_config_1.createTestContainer();
        containerCtx.container.bind('DockerizationUsedPractice').to(DockerizationUsedPractice_1.DockerizationUsedPractice);
        practice = containerCtx.container.get('DockerizationUsedPractice');
    });
    afterEach(async () => {
        containerCtx.virtualFileSystemService.clearFileSystem();
        containerCtx.practiceContext.fileInspector.purgeCache();
    });
    it('Returns practicing if the docker is used', async () => {
        containerCtx.virtualFileSystemService.setFileSystem({
            Dockerfile: '...',
        });
        const evaluated = await practice.evaluate(containerCtx.practiceContext);
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.practicing);
    });
    it('Returns notPracticing if the docker is NOT used', async () => {
        containerCtx.virtualFileSystemService.setFileSystem({
            'not.exists': '...',
        });
        const evaluated = await practice.evaluate(containerCtx.practiceContext);
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.notPracticing);
    });
    it('Returns unknown if there is no fileInspector', async () => {
        const evaluated = await practice.evaluate(Object.assign(Object.assign({}, containerCtx.practiceContext), { fileInspector: undefined }));
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.unknown);
    });
    it('Is applicable if projectComponentType is not a library ', async () => {
        containerCtx.practiceContext.projectComponent.type = model_1.ProjectComponentType.Application;
        const result = await practice.isApplicable(containerCtx.practiceContext);
        expect(result).toEqual(true);
    });
    it('Is not applicable if projectComponentType is a library ', async () => {
        containerCtx.practiceContext.projectComponent.type = model_1.ProjectComponentType.Library;
        const result = await practice.isApplicable(containerCtx.practiceContext);
        expect(result).toEqual(false);
    });
});
//# sourceMappingURL=DockerizationUsedPractice.spec.js.map