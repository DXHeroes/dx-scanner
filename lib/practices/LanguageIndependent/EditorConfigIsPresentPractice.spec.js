"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EditorConfigIsPresentPractice_1 = require("./EditorConfigIsPresentPractice");
const model_1 = require("../../model");
const inversify_config_1 = require("../../inversify.config");
describe('EditorConfigIsPresentPractice', () => {
    let practice;
    let containerCtx;
    beforeAll(() => {
        containerCtx = inversify_config_1.createTestContainer();
        containerCtx.container.bind('EditorConfigIsPresentPractice').to(EditorConfigIsPresentPractice_1.EditorConfigIsPresentPractice);
        practice = containerCtx.container.get('EditorConfigIsPresentPractice');
    });
    afterEach(async () => {
        containerCtx.virtualFileSystemService.clearFileSystem();
        containerCtx.practiceContext.fileInspector.purgeCache();
    });
    it('Returns practicing if there is a .editorconfig', async () => {
        containerCtx.virtualFileSystemService.setFileSystem({
            '/.editorconfig': '...',
        });
        const evaluated = await practice.evaluate(containerCtx.practiceContext);
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.practicing);
    });
    it('Returns notPracticing if there is NO .editorconfig', async () => {
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
    describe('Fixer', () => {
        it('Creates editorconfig file', async () => {
            containerCtx.virtualFileSystemService.setFileSystem({
                [`${__dirname}/.keep`]: '',
            });
            await practice.fix(containerCtx.fixerContext);
            const exists = await containerCtx.virtualFileSystemService.exists('.editorconfig');
            expect(exists).toBe(true);
        });
    });
});
//# sourceMappingURL=EditorConfigIsPresentPractice.spec.js.map