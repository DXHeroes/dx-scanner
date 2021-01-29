"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JsGitignoreCorrectlySetPractice_1 = require("./JsGitignoreCorrectlySetPractice");
const gitignoreContent_mock_1 = require("../../detectors/__MOCKS__/JavaScript/gitignoreContent.mock");
const model_1 = require("../../model");
const inversify_config_1 = require("../../inversify.config");
const basicGitignore = `
node_modules
coverage
.log
`;
describe('JsGitignoreCorrectlySetPractice', () => {
    let practice;
    let containerCtx;
    beforeAll(() => {
        containerCtx = inversify_config_1.createTestContainer();
        containerCtx.container.bind('JsGitignoreCorrectlySetPractice').to(JsGitignoreCorrectlySetPractice_1.JsGitignoreCorrectlySetPractice);
        practice = containerCtx.container.get('JsGitignoreCorrectlySetPractice');
    });
    afterEach(async () => {
        containerCtx.virtualFileSystemService.clearFileSystem();
        containerCtx.practiceContext.fileInspector.purgeCache();
    });
    it('Returns practicing if the .gitignore is set correctly', async () => {
        containerCtx.virtualFileSystemService.setFileSystem({
            '.gitignore': gitignoreContent_mock_1.gitignoreContent,
        });
        const evaluated = await practice.evaluate(containerCtx.practiceContext);
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.practicing);
    });
    it('Returns notPracticing if there the .gitignore is NOT set correctly', async () => {
        containerCtx.virtualFileSystemService.setFileSystem({
            '.gitignore': '...',
        });
        const evaluated = await practice.evaluate(containerCtx.practiceContext);
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.notPracticing);
        expect(practice.data.details).not.toBeUndefined();
    });
    it('Returns unknown if there is no fileInspector', async () => {
        const evaluated = await practice.evaluate(Object.assign(Object.assign({}, containerCtx.practiceContext), { root: { fileInspector: undefined } }));
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.unknown);
    });
    it('Returns practicing even if there are no lockfiles in .gitignore', async () => {
        containerCtx.virtualFileSystemService.setFileSystem({
            '.gitignore': basicGitignore,
        });
        const evaluated = await practice.evaluate(containerCtx.practiceContext);
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.practicing);
    });
    it('Returns practicing if there is only one lockfile in .gitignore', async () => {
        containerCtx.virtualFileSystemService.setFileSystem({
            '.gitignore': `${basicGitignore}\nyarn.lock`,
        });
        const evaluated = await practice.evaluate(containerCtx.practiceContext);
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.practicing);
    });
    describe('Fixer', () => {
        afterEach(async () => {
            containerCtx.virtualFileSystemService.clearFileSystem();
        });
        it('Does not change correct .gitignore', async () => {
            const gitignore = `${basicGitignore}\npackage-lock.json\n`;
            containerCtx.virtualFileSystemService.setFileSystem({
                '.gitignore': gitignore,
            });
            await practice.evaluate(containerCtx.practiceContext);
            await practice.fix(containerCtx.fixerContext);
            const fixedGitignore = await containerCtx.virtualFileSystemService.readFile('.gitignore');
            expect(fixedGitignore).toBe(gitignore);
        });
        it('Appends to .gitignore if entry is missing', async () => {
            containerCtx.virtualFileSystemService.setFileSystem({
                '.gitignore': '/node_modules\n/coverage\n',
            });
            await practice.evaluate(containerCtx.practiceContext);
            await practice.fix(containerCtx.fixerContext);
            const fixedGitignore = await containerCtx.virtualFileSystemService.readFile('.gitignore');
            expect(fixedGitignore).toBe('/node_modules\n/coverage\n\n*.log\n');
        });
    });
});
//# sourceMappingURL=JsGitignoreCorrectlySetPractice.spec.js.map