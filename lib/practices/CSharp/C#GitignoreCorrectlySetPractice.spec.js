"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const C_GitignoreCorrectlySetPractice_1 = require("./C#GitignoreCorrectlySetPractice");
const gitignoreContent_mock_1 = require("../../detectors/__MOCKS__/CSharp/gitignoreContent.mock");
const model_1 = require("../../model");
const inversify_config_1 = require("../../inversify.config");
const basicGitignore = `
obj/
Cache/
[Bb]in/
*.log
*.user
*.suo
`;
describe('CSharpGitignoreCorrectlySetPractice', () => {
    let practice;
    let containerCtx;
    beforeAll(() => {
        containerCtx = inversify_config_1.createTestContainer();
        containerCtx.container.bind('CSharpGitignoreCorrectlySetPractice').to(C_GitignoreCorrectlySetPractice_1.CSharpGitignoreCorrectlySetPractice);
        practice = containerCtx.container.get('CSharpGitignoreCorrectlySetPractice');
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
    it('Returns practicing even with basic gitignore', async () => {
        containerCtx.virtualFileSystemService.setFileSystem({
            '.gitignore': basicGitignore,
        });
        const evaluated = await practice.evaluate(containerCtx.practiceContext);
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.practicing);
    });
    describe('Fixes', () => {
        afterEach(async () => {
            containerCtx.virtualFileSystemService.clearFileSystem();
        });
        it('Does not change correct .gitignore', async () => {
            const gitignore = basicGitignore;
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
                '.gitignore': 'bin/\nobj/\n*.log\n*.user\n',
            });
            await practice.evaluate(containerCtx.practiceContext);
            await practice.fix(containerCtx.fixerContext);
            const fixedGitignore = await containerCtx.virtualFileSystemService.readFile('.gitignore');
            expect(fixedGitignore).toBe('bin/\nobj/\n*.log\n*.user\n\n# added by `dx-scanner --fix`\n[Cc]ache/\n*.suo\n');
        });
    });
});
//# sourceMappingURL=C#GitignoreCorrectlySetPractice.spec.js.map