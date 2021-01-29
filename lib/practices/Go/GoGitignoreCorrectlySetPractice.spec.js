"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GoGitignoreCorrectlySetPractice_1 = require("./GoGitignoreCorrectlySetPractice");
const gitignoreContent_mock_1 = require("../../detectors/__MOCKS__/Go/gitignoreContent.mock");
const model_1 = require("../../model");
const inversify_config_1 = require("../../inversify.config");
const basicGitignore = `*.exe\n*.exe~\n*.dll\n*.so\n*.dylib\n*.test\n*.out\n`;
describe('GoGitignoreCorrectlySetPractice', () => {
    let practice;
    let containerCtx;
    beforeAll(() => {
        containerCtx = inversify_config_1.createTestContainer();
        containerCtx.container
            .bind('GoGitignoreCorrectlySetPractice')
            .to(GoGitignoreCorrectlySetPractice_1.GoGitignoreCorrectlySetPractice);
        practice = containerCtx.container.get('GoGitignoreCorrectlySetPractice');
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
    it('Returns notPracticing if the .gitignore is NOT set correctly', async () => {
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
    describe('Fixer', () => {
        afterEach(async () => {
            containerCtx.virtualFileSystemService.clearFileSystem();
        });
        it('Appends to .gitignore if entry is missing', async () => {
            containerCtx.virtualFileSystemService.setFileSystem({
                '.gitignore': '*.exe\n*.exe~\n*.dll\n*.so\n*.dylib\n*.test\n*.out\n',
            });
            await practice.evaluate(containerCtx.practiceContext);
            await practice.fix(containerCtx.fixerContext);
            const fixedGitignore = await containerCtx.virtualFileSystemService.readFile('.gitignore');
            expect(fixedGitignore).toBe('*.exe\n*.exe~\n*.dll\n*.so\n*.dylib\n*.test\n*.out\n');
        });
    });
});
//# sourceMappingURL=GoGitignoreCorrectlySetPractice.spec.js.map