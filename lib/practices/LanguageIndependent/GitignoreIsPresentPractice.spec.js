"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GitignoreIsPresentPractice_1 = require("./GitignoreIsPresentPractice");
const model_1 = require("../../model");
const inversify_config_1 = require("../../inversify.config");
const nock_1 = __importDefault(require("nock"));
describe('GitignoreIsPresentPractice', () => {
    let practice;
    let containerCtx;
    beforeAll(() => {
        containerCtx = inversify_config_1.createTestContainer();
        containerCtx.container.bind('GitignoreIsPresentPractice').to(GitignoreIsPresentPractice_1.GitignoreIsPresentPractice);
        practice = containerCtx.container.get('GitignoreIsPresentPractice');
    });
    afterEach(async () => {
        containerCtx.virtualFileSystemService.clearFileSystem();
        containerCtx.practiceContext.fileInspector.purgeCache();
    });
    it('Returns practicing if there is a .gitignore', async () => {
        containerCtx.virtualFileSystemService.setFileSystem({
            '/.gitignore': '...',
        });
        const evaluated = await practice.evaluate(containerCtx.practiceContext);
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.practicing);
    });
    it('Returns notPracticing if there is NO .gitignore', async () => {
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
        afterEach(async () => {
            jest.clearAllMocks();
            containerCtx.virtualFileSystemService.clearFileSystem();
        });
        it('Creates gitignore file', async () => {
            containerCtx.virtualFileSystemService.setFileSystem({
                'package.json': '{}',
            });
            containerCtx.fixerContext.projectComponent.language = model_1.ProgrammingLanguage.Java;
            nock_1.default('https://api.github.com')
                .get('/repos/github/gitignore/contents')
                .reply(200, [{ name: 'Java.gitignore' }]);
            nock_1.default('https://raw.githubusercontent.com').get('/github/gitignore/master/Java.gitignore').reply(200, '*.log');
            await practice.fix(containerCtx.fixerContext);
            const exists = await containerCtx.virtualFileSystemService.exists('.gitignore');
            expect(exists).toBe(true);
        });
    });
});
//# sourceMappingURL=GitignoreIsPresentPractice.spec.js.map