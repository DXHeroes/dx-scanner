"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const shelljs_1 = __importDefault(require("shelljs"));
const inversify_config_1 = require("../../inversify.config");
const model_1 = require("../../model");
const PrettierUsedPractice_1 = require("./PrettierUsedPractice");
jest.mock('shelljs', () => ({
    exec: jest.fn(),
}));
describe('PrettierUsedPractice', () => {
    let practice;
    let containerCtx;
    let packageInspector;
    beforeAll(() => {
        containerCtx = inversify_config_1.createTestContainer();
        containerCtx.container.bind('PrettierUsedPractice').to(PrettierUsedPractice_1.PrettierUsedPractice);
        practice = containerCtx.container.get('PrettierUsedPractice');
        packageInspector = containerCtx.practiceContext.packageInspector;
    });
    it('Detects Prettier', async () => {
        packageInspector.hasOneOfPackages = () => true;
        const result = await practice.evaluate(containerCtx.practiceContext);
        expect(result).toEqual(model_1.PracticeEvaluationResult.practicing);
    });
    it('Did not detect Prettier', async () => {
        packageInspector.hasOneOfPackages = () => false;
        const result = await practice.evaluate(containerCtx.practiceContext);
        expect(result).toEqual(model_1.PracticeEvaluationResult.notPracticing);
    });
    it('Did not recognize packageInspector', async () => {
        const result = await practice.evaluate(Object.assign(Object.assign({}, containerCtx.practiceContext), { packageInspector: undefined }));
        expect(result).toEqual(model_1.PracticeEvaluationResult.unknown);
    });
    it('Is applicable if it is JavaScript', async () => {
        containerCtx.practiceContext.projectComponent.language = model_1.ProgrammingLanguage.JavaScript;
        const result = await practice.isApplicable(containerCtx.practiceContext);
        expect(result).toEqual(true);
    });
    it('Is applicable if it is TypeScript', async () => {
        containerCtx.practiceContext.projectComponent.language = model_1.ProgrammingLanguage.TypeScript;
        const result = await practice.isApplicable(containerCtx.practiceContext);
        expect(result).toEqual(true);
    });
    it('Is applicable if it is not TypeScript nor JavaScript', async () => {
        containerCtx.practiceContext.projectComponent.language = model_1.ProgrammingLanguage.UNKNOWN;
        const result = await practice.isApplicable(containerCtx.practiceContext);
        expect(result).toEqual(false);
    });
    describe('Fixer', () => {
        afterEach(async () => {
            jest.clearAllMocks();
            containerCtx.virtualFileSystemService.clearFileSystem();
        });
        it('Install prettier package', async () => {
            containerCtx.virtualFileSystemService.setFileSystem({
                'package.json': '{}',
                'package-lock.json': '',
            });
            shelljs_1.default.exec.mockImplementation();
            await practice.fix(containerCtx.fixerContext);
            expect(shelljs_1.default.exec.mock.calls[0][0]).toContain('prettier');
        });
        it('Creates prettier config file', async () => {
            containerCtx.virtualFileSystemService.setFileSystem({
                'package.json': '{}',
                'package-lock.json': '',
            });
            await practice.fix(containerCtx.fixerContext);
            const exists = await containerCtx.virtualFileSystemService.exists('.prettierrc');
            expect(exists).toBe(true);
        });
        it('Add prettier script', async () => {
            containerCtx.virtualFileSystemService.setFileSystem({
                'package.json': '{}',
                'package-lock.json': '',
            });
            await practice.fix(containerCtx.fixerContext);
            const newPackageJson = await containerCtx.virtualFileSystemService.readFile('package.json');
            expect(newPackageJson).toContain('format');
        });
    });
});
//# sourceMappingURL=PrettierUsedPractice.spec.js.map