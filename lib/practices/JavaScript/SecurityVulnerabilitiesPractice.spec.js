"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SecurityVulnerabilitiesPractice_1 = require("./SecurityVulnerabilitiesPractice");
const model_1 = require("../../model");
const inversify_config_1 = require("../../inversify.config");
const shelljs_1 = __importDefault(require("shelljs"));
const command_exists_1 = require("command-exists");
const lodash_1 = require("lodash");
const PracticeUtils_1 = require("../PracticeUtils");
jest.mock('../PracticeUtils');
jest.mock('shelljs', () => ({
    pwd: jest.fn(),
    cd: jest.fn(),
    exec: jest.fn(),
}));
jest.mock('command-exists', () => ({
    sync: jest.fn(),
}));
describe('SecurityVulnerabilitiesPractice', () => {
    let practice;
    let containerCtx;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const setupMocks = (mockOverrides = [], code = 0) => {
        command_exists_1.sync.mockImplementation(() => true);
        lodash_1.forEach(mockOverrides, (value) => {
            value.f.mockImplementation(value.impl);
        });
        PracticeUtils_1.parseNpmAudit.mockReturnValue({
            vulnerabilities: [
                {
                    library: 'yargs-parser',
                    type: 'Prototype Pollution',
                    severity: 'low',
                    vulnerable_versions: '<13.1.2 || >=14.0.0 <15.0.1 || >=16.0.0 <18.1.2',
                    patchedIn: '>=13.1.2 <14.0.0 || >=15.0.1 <16.0.0 || >=18.1.2',
                    dependencyOf: '@commitlint/lint',
                    path: '@commitlint/lint > @commitlint/parse > conventional-commits-parser > meow > yargs-parser',
                },
            ],
            summary: { info: 0, low: 32, moderate: 0, high: 0, critical: 0, code },
        });
        PracticeUtils_1.parseYarnAudit.mockReturnValue({
            vulnerabilities: [
                {
                    library: 'yargs-parser',
                    type: 'Prototype Pollution',
                    severity: 'low',
                    vulnerable_versions: '<13.1.2 || >=14.0.0 <15.0.1 || >=16.0.0 <18.1.2',
                    patchedIn: '>=13.1.2 <14.0.0 || >=15.0.1 <16.0.0 || >=18.1.2',
                    dependencyOf: '@commitlint/lint',
                    path: '@commitlint/lint > @commitlint/parse > conventional-commits-parser > meow > yargs-parser',
                },
            ],
            summary: { info: 0, low: 32, moderate: 0, high: 0, critical: 0, code },
        });
    };
    beforeAll(() => {
        containerCtx = inversify_config_1.createTestContainer();
        containerCtx.container.bind('SecurityVulnerabilitiesPractice').to(SecurityVulnerabilitiesPractice_1.SecurityVulnerabilitiesPractice);
        practice = containerCtx.container.get('SecurityVulnerabilitiesPractice');
    });
    afterEach(async () => {
        containerCtx.virtualFileSystemService.clearFileSystem();
        containerCtx.practiceContext.fileInspector.purgeCache();
        jest.clearAllMocks();
    });
    it('Returns unknown when no files present', async () => {
        setupMocks();
        const result = await practice.evaluate(containerCtx.practiceContext);
        expect(result).toBe(model_1.PracticeEvaluationResult.unknown);
    });
    it('Runs npm when package-lock present', async () => {
        setupMocks();
        containerCtx.virtualFileSystemService.setFileSystem({
            'package-lock.json': '',
        });
        const result = await practice.evaluate(containerCtx.practiceContext);
        expect(result).toBe(model_1.PracticeEvaluationResult.practicing);
    });
    it('Runs npm when npm shrinkwrap present', async () => {
        setupMocks();
        containerCtx.virtualFileSystemService.setFileSystem({
            'npm-shrinkwrap.json': '',
        });
        const result = await practice.evaluate(containerCtx.practiceContext);
        expect(result).toBe(model_1.PracticeEvaluationResult.practicing);
        expect(shelljs_1.default.exec.mock.calls[0][0]).toContain('npm');
    });
    it('Runs yarn when yarn lock present', async () => {
        setupMocks();
        containerCtx.virtualFileSystemService.setFileSystem({
            'yarn.lock': '',
        });
        const result = await practice.evaluate(containerCtx.practiceContext);
        expect(result).toBe(model_1.PracticeEvaluationResult.practicing);
        expect(shelljs_1.default.exec.mock.calls[0][0]).toContain('yarn');
    });
    it('Fallback to npm when yarn not installed', async () => {
        setupMocks();
        command_exists_1.sync.mockImplementation((cmd) => cmd !== 'yarn');
        containerCtx.virtualFileSystemService.setFileSystem({
            'yarn.lock': '',
        });
        const result = await practice.evaluate(containerCtx.practiceContext);
        expect(result).toBe(model_1.PracticeEvaluationResult.practicing);
        expect(shelljs_1.default.exec.mock.calls[0][0]).toContain('npm');
    });
    it('Returns unknown when yarn and npm not installed', async () => {
        setupMocks([{ f: command_exists_1.sync, impl: () => false }]);
        containerCtx.virtualFileSystemService.setFileSystem({
            'yarn.lock': '',
        });
        const result = await practice.evaluate(containerCtx.practiceContext);
        expect(result).toBe(model_1.PracticeEvaluationResult.unknown);
    });
    it('Returns notPracticing if vulnerability found through npm', async () => {
        setupMocks([], 1);
        containerCtx.virtualFileSystemService.setFileSystem({
            'package-lock.json': '',
        });
        const result = await practice.evaluate(containerCtx.practiceContext);
        expect(result).toBe(model_1.PracticeEvaluationResult.notPracticing);
    });
    it('Returns notPracticing if vulnerability found through yarn', async () => {
        setupMocks([], 16);
        containerCtx.virtualFileSystemService.setFileSystem({
            'yarn.lock': '',
        });
        const result = await practice.evaluate(containerCtx.practiceContext);
        expect(result).toBe(model_1.PracticeEvaluationResult.notPracticing);
    });
    it('Returns practicing if low-severity vulnerability found through yarn', async () => {
        setupMocks([], 6);
        containerCtx.virtualFileSystemService.setFileSystem({
            'yarn.lock': '',
        });
        const result = await practice.evaluate(containerCtx.practiceContext);
        expect(result).toBe(model_1.PracticeEvaluationResult.practicing);
    });
    it('Returns true if lang is a JavaScript or TypeScript', async () => {
        const result = await practice.isApplicable(containerCtx.practiceContext);
        expect(result).toEqual(true);
    });
    it('Returns false if lang is NOT a JavaScript or TypeScript', async () => {
        containerCtx.practiceContext.projectComponent.language = model_1.ProgrammingLanguage.UNKNOWN;
        const result = await practice.isApplicable(containerCtx.practiceContext);
        expect(result).toEqual(false);
    });
    it('Returns unknown when yarn and npm not installed', async () => {
        setupMocks([{ f: command_exists_1.sync, impl: () => false }]);
        containerCtx.virtualFileSystemService.setFileSystem({
            'yarn.lock': '',
        });
        const result = await practice.evaluate(containerCtx.practiceContext);
        expect(result).toBe(model_1.PracticeEvaluationResult.unknown);
    });
    it('Returns unknown when npm audit errors', async () => {
        shelljs_1.default.exec.mockReturnValue({
            error: { code: 'ELOCKVERIFY', summary: 'Errors were found in your package-lock.json', detail: '' },
        });
        containerCtx.virtualFileSystemService.setFileSystem({
            'package-lock.json': '',
        });
        const result = await practice.evaluate(containerCtx.practiceContext);
        expect(result).toBe(model_1.PracticeEvaluationResult.unknown);
    });
});
//# sourceMappingURL=SecurityVulnerabilitiesPractice.spec.js.map