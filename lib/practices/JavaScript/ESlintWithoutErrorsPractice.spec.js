"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const eslint_1 = require("eslint");
const inversify_config_1 = require("../../inversify.config");
const model_1 = require("../../model");
const ESLintWithoutErrorsPractice_1 = require("./ESLintWithoutErrorsPractice");
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
const eslintRcMockJson_1 = require("./__MOCKS__/eslintRcMockJson");
const eslintReport_1 = require("./__MOCKS__/eslintReport");
const PackageManagerUtils_1 = require("../utils/PackageManagerUtils");
jest.mock('eslint');
describe('ESLintWithoutErrorsPractice', () => {
    let practice;
    let containerCtx;
    const mockedEslint = eslint_1.ESLint;
    beforeEach(() => {
        containerCtx = inversify_config_1.createTestContainer();
        containerCtx.container.bind('ESLintWithoutErrorsPractice').to(ESLintWithoutErrorsPractice_1.ESLintWithoutErrorsPractice);
        practice = containerCtx.container.get('ESLintWithoutErrorsPractice');
        jest.spyOn(PackageManagerUtils_1.PackageManagerUtils, 'getPackageManagerInstalled').mockImplementation(async () => PackageManagerUtils_1.PackageManagerType.npm);
    });
    afterEach(() => {
        containerCtx.practiceContext.fileInspector.purgeCache();
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
    it('Returns undefined if ctx file inspector is undefined', async () => {
        practice = containerCtx.container.get('ESLintWithoutErrorsPractice');
        const result = await practice.evaluate({ fileInspector: undefined });
        expect(result).toEqual(model_1.PracticeEvaluationResult.unknown);
    });
    it('Returns practicing, if errorCount === 0', async () => {
        var _a;
        const report = eslintReport_1.getEsLintReport();
        mockedEslint.mockImplementation(() => {
            return {
                lintFiles: () => report,
            };
        });
        const result = await practice.evaluate(containerCtx.practiceContext);
        expect((_a = practice.data.statistics) === null || _a === void 0 ? void 0 : _a.linterIssues).toEqual([]);
        expect(result).toEqual(model_1.PracticeEvaluationResult.practicing);
    });
    it('Returns not practicing, if errorCount !== 0, creates correct linter issue dtos if there are errors', async () => {
        var _a, _b;
        const report = eslintReport_1.getEsLintReport([
            {
                filePath: '/Users/jakubvacek/dx-scanner/src/commands/init.ts',
                messages: [{ line: 1, column: 37, ruleId: '', message: 'Strings must use doublequote.', severity: 2 }],
                errorCount: 1,
                warningCount: 0,
                fixableErrorCount: 1,
                fixableWarningCount: 0,
                usedDeprecatedRules: [],
            },
        ]);
        mockedEslint.mockImplementation(() => {
            return {
                lintFiles: () => report,
            };
        });
        const result = await practice.evaluate(containerCtx.practiceContext);
        expect((_a = practice.data.statistics) === null || _a === void 0 ? void 0 : _a.linterIssues).toBeDefined();
        expect((_b = practice.data.statistics) === null || _b === void 0 ? void 0 : _b.linterIssues[0]).toEqual({
            filePath: '/Users/jakubvacek/dx-scanner/src/commands/init.ts(1)(37)',
            severity: 'error',
            type: 'Strings must use doublequote.',
            url: '/Users/jakubvacek/dx-scanner/src/commands/init.ts#L1',
        });
        expect(result).toEqual(model_1.PracticeEvaluationResult.notPracticing);
    });
    it('Correctly read .eslintrc.json file', async () => {
        const report = eslintReport_1.getEsLintReport();
        const mockFileSystem = {
            '/.eslintrc.json': JSON.stringify(eslintRcMockJson_1.eslintrRcJson),
        };
        containerCtx.virtualFileSystemService.setFileSystem(mockFileSystem);
        mockedEslint.mockImplementation(() => {
            return {
                lintFiles: () => report,
            };
        });
        const result = await practice.evaluate(containerCtx.practiceContext);
        expect(result).toEqual(model_1.PracticeEvaluationResult.practicing);
    });
    it('Correctly read correct .eslintrc.yml file', async () => {
        const report = eslintReport_1.getEsLintReport();
        const p = path_1.default.join(__dirname, '__MOCKS__/eslintRcMock.yml');
        const mockFileSystem = {
            '/.eslintrc.yml': fs.readFileSync(p, 'utf8'),
        };
        containerCtx.virtualFileSystemService.setFileSystem(mockFileSystem);
        mockedEslint.mockImplementation(() => {
            return {
                lintFiles: () => report,
            };
        });
        const result = await practice.evaluate(containerCtx.practiceContext);
        expect(result).toEqual(model_1.PracticeEvaluationResult.practicing);
    });
    it('Throw error if it is not correct yaml file', async () => {
        const report = eslintReport_1.getEsLintReport();
        const mockFileSystem = {
            '/.eslintrc.yml': `badYaml: true
      env:
        es6:`,
        };
        containerCtx.virtualFileSystemService.setFileSystem(mockFileSystem);
        mockedEslint.mockImplementation(() => {
            return {
                lintFiles: () => report,
            };
        });
        try {
            await practice.evaluate(containerCtx.practiceContext);
            fail('It failed');
        }
        catch (error) {
            expect(error.name).toEqual('YAMLException');
        }
    });
});
//# sourceMappingURL=ESlintWithoutErrorsPractice.spec.js.map