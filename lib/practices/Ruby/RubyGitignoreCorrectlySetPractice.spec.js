"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RubyGitignoreCorrectlySetPractice_1 = require("./RubyGitignoreCorrectlySetPractice");
const gitignoreContent_mock_1 = require("../../detectors/__MOCKS__/Ruby/gitignoreContent.mock");
const model_1 = require("../../model");
const inversify_config_1 = require("../../inversify.config");
const basicGitignore = `
*.gem
*.rbc
/coverage/
/tmp/
/.config
`;
describe('RubyGitignoreCorrectlySetPractice', () => {
    let practice;
    let containerCtx;
    beforeAll(() => {
        containerCtx = inversify_config_1.createTestContainer();
        containerCtx.container.bind('RubyGitignoreCorrectlySetPractice').to(RubyGitignoreCorrectlySetPractice_1.RubyGitignoreCorrectlySetPractice);
        practice = containerCtx.container.get('RubyGitignoreCorrectlySetPractice');
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
                '.gitignore': '*.gem\n/coverage/\n',
            });
            await practice.evaluate(containerCtx.practiceContext);
            await practice.fix(containerCtx.fixerContext);
            const fixedGitignore = await containerCtx.virtualFileSystemService.readFile('.gitignore');
            expect(fixedGitignore).toBe('*.gem\n/coverage/\n\n/tmp/\n/.config\n*.rbc\n');
        });
    });
});
//# sourceMappingURL=RubyGitignoreCorrectlySetPractice.spec.js.map