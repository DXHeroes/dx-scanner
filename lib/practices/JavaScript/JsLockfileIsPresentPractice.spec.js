"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const JsLockfileIsPresentPractice_1 = require("./JsLockfileIsPresentPractice");
const model_1 = require("../../model");
const inversify_config_1 = require("../../inversify.config");
const shelljs_1 = __importDefault(require("shelljs"));
const command_exists_1 = require("command-exists");
jest.mock('shelljs', () => ({
    pwd: jest.fn(),
    cd: jest.fn(),
    exec: jest.fn(),
}));
jest.mock('command-exists', () => ({
    sync: jest.fn(),
}));
describe('LockfileIsPresentPractice', () => {
    let containerCtx;
    let practice;
    beforeAll(() => {
        containerCtx = inversify_config_1.createTestContainer();
        containerCtx.container.bind('LockfileIsPresentPractice').to(JsLockfileIsPresentPractice_1.JsLockfileIsPresentPractice);
        practice = containerCtx.container.get('LockfileIsPresentPractice');
    });
    afterEach(async () => {
        containerCtx.virtualFileSystemService.clearFileSystem();
        containerCtx.practiceContext.fileInspector.purgeCache();
    });
    it('Returns practicing if there is a package-lock.json', async () => {
        containerCtx.virtualFileSystemService.setFileSystem({
            '/package-lock.json': '...',
        });
        const evaluated = await practice.evaluate(containerCtx.practiceContext);
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.practicing);
    });
    it('Returns practicing if there is a yarn.lock', async () => {
        containerCtx.virtualFileSystemService.setFileSystem({
            '/yarn.lock': '...',
        });
        const evaluated = await practice.evaluate(containerCtx.practiceContext);
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.practicing);
    });
    it('Returns notPracticing if there is NO lock file', async () => {
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
    it('Is applicable to JS', async () => {
        containerCtx.practiceContext.projectComponent.language = model_1.ProgrammingLanguage.JavaScript;
        const result = await practice.isApplicable(containerCtx.practiceContext);
        expect(result).toEqual(true);
    });
    it('Is applicable to TS', async () => {
        containerCtx.practiceContext.projectComponent.language = model_1.ProgrammingLanguage.TypeScript;
        const result = await practice.isApplicable(containerCtx.practiceContext);
        expect(result).toEqual(true);
    });
    it('Is not applicable to other languages', async () => {
        containerCtx.practiceContext.projectComponent.language = model_1.ProgrammingLanguage.Python;
        const result = await practice.isApplicable(containerCtx.practiceContext);
        expect(result).toEqual(false);
    });
    describe('fixer', () => {
        let npmInstallRun;
        let yarnInstallRun;
        beforeAll(() => {
            shelljs_1.default.exec.mockImplementation((cmd) => {
                if (cmd.startsWith('npm i'))
                    npmInstallRun = true;
                else if (cmd.startsWith('yarn install'))
                    yarnInstallRun = true;
            });
            containerCtx.virtualFileSystemService.setFileSystem({
                'package.json': '',
            });
        });
        beforeEach(() => {
            npmInstallRun = false;
            yarnInstallRun = false;
        });
        it('runs npm install when npm installed', async () => {
            command_exists_1.sync.mockImplementation((cmd) => cmd === 'npm');
            await practice.fix();
            expect(npmInstallRun).toBe(true);
            expect(yarnInstallRun).toBe(false);
        });
        it('runs yarn install when yarn installed', async () => {
            command_exists_1.sync.mockImplementation((cmd) => cmd === 'yarn');
            await practice.fix();
            expect(npmInstallRun).toBe(false);
            expect(yarnInstallRun).toBe(true);
        });
    });
});
//# sourceMappingURL=JsLockfileIsPresentPractice.spec.js.map