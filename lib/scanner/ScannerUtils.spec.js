"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const lodash_1 = __importDefault(require("lodash"));
const model_1 = require("../model");
const DeprecatedTSLintPractice_1 = require("../practices/JavaScript/DeprecatedTSLintPractice");
const ESLintUsedPractice_1 = require("../practices/JavaScript/ESLintUsedPractice");
const JsGitignoreCorrectlySetPractice_1 = require("../practices/JavaScript/JsGitignoreCorrectlySetPractice");
const TypeScriptUsedPractice_1 = require("../practices/JavaScript/TypeScriptUsedPractice");
const ScannerUtils_1 = require("./ScannerUtils");
const __MOCKS__1 = require("./__MOCKS__");
const PracticeWithContextFactory_1 = require("../test/factories/PracticeWithContextFactory");
const ArgumentsProviderFactory_1 = require("../test/factories/ArgumentsProviderFactory");
describe('ScannerUtils', () => {
    const notPracticingHighImpactPracticeWithCtx = [];
    notPracticingHighImpactPracticeWithCtx.push(PracticeWithContextFactory_1.practiceWithContextFactory({ evaluation: model_1.PracticeEvaluationResult.notPracticing }));
    describe('#sortPractices', () => {
        it('sorts practices correctly ', async () => {
            const practices = [DeprecatedTSLintPractice_1.DeprecatedTSLintPractice, ESLintUsedPractice_1.ESLintUsedPractice, TypeScriptUsedPractice_1.TypeScriptUsedPractice].map(ScannerUtils_1.ScannerUtils.initPracticeWithMetadata);
            const result = ScannerUtils_1.ScannerUtils.sortPractices(practices);
            expect(result.length).toEqual(3);
            expect(result.map((r) => r.getMetadata().id)).toEqual([
                'JavaScript.TypeScriptUsed',
                'JavaScript.ESLintUsed',
                'JavaScript.DeprecatedTSLint',
            ]);
        });
        it('throws an error with circular dependency', async () => {
            const practices = [__MOCKS__1.FirstTestPractice, __MOCKS__1.SecondTestPractice].map(ScannerUtils_1.ScannerUtils.initPracticeWithMetadata);
            expect(() => ScannerUtils_1.ScannerUtils.sortPractices(practices)).toThrowError();
        });
        it('throws an error with non existing practice', async () => {
            const expectedErrMsg = `Practice "Mock.NonExistingTestPractice" does not exists. It's set as dependency of "Mock.InvalidTestPractice"`;
            const practice = ScannerUtils_1.ScannerUtils.initPracticeWithMetadata(__MOCKS__1.InvalidTestPractice);
            expect(() => ScannerUtils_1.ScannerUtils.sortPractices([practice])).toThrow(expectedErrMsg);
        });
    });
    describe('#sortAlphabetically', () => {
        it('sorts practices alphabetically', () => {
            const practices = [__MOCKS__1.FirstTestPractice, __MOCKS__1.SecondTestPractice, DeprecatedTSLintPractice_1.DeprecatedTSLintPractice, ESLintUsedPractice_1.ESLintUsedPractice, TypeScriptUsedPractice_1.TypeScriptUsedPractice].map(ScannerUtils_1.ScannerUtils.initPracticeWithMetadata);
            const result = ScannerUtils_1.ScannerUtils.sortAlphabetically(practices);
            const id = result.map((practice) => {
                return practice.getMetadata().id;
            });
            expect(result).toHaveLength(5);
            expect(id).toEqual([
                'JavaScript.DeprecatedTSLint',
                'JavaScript.ESLintUsed',
                'JavaScript.TypeScriptUsed',
                'Mock.FirstTestPractice',
                'Mock.SecondTestPractice',
            ]);
        });
    });
    describe('#isFulfilled', () => {
        it('checks fulfillments of a practice if the practice has expected evaluation result ', async () => {
            const evaluatedPractice = {
                componentContext: jest.fn(),
                practiceContext: jest.fn(),
                practice: ScannerUtils_1.ScannerUtils.initPracticeWithMetadata(ESLintUsedPractice_1.ESLintUsedPractice),
                evaluation: model_1.PracticeEvaluationResult.practicing,
                evaluationError: undefined,
                isOn: jest.fn(),
            };
            const practice = ScannerUtils_1.ScannerUtils.initPracticeWithMetadata(DeprecatedTSLintPractice_1.DeprecatedTSLintPractice);
            const result = ScannerUtils_1.ScannerUtils.isFulfilled(practice, [evaluatedPractice]);
            expect(result).toEqual(true);
        });
        it('checks fulfillments of a practice if the practice has wrong evaluation result ', async () => {
            const evaluatedPractice = {
                componentContext: jest.fn(),
                practiceContext: jest.fn(),
                practice: ScannerUtils_1.ScannerUtils.initPracticeWithMetadata(ESLintUsedPractice_1.ESLintUsedPractice),
                evaluation: model_1.PracticeEvaluationResult.notPracticing,
                evaluationError: undefined,
                isOn: jest.fn(),
            };
            const practice = ScannerUtils_1.ScannerUtils.initPracticeWithMetadata(DeprecatedTSLintPractice_1.DeprecatedTSLintPractice);
            const result = ScannerUtils_1.ScannerUtils.isFulfilled(practice, [evaluatedPractice]);
            expect(result).toEqual(false);
        });
        it('filterPractices() returns filtered out practices and practices off', async () => {
            const config = {
                practices: {
                    'JavaScript.GitignoreCorrectlySet': model_1.PracticeImpact.off,
                },
            };
            const componentMock = {
                framework: model_1.ProjectComponentFramework.UNKNOWN,
                language: model_1.ProgrammingLanguage.JavaScript,
                path: './var/foo',
                platform: model_1.ProjectComponentPlatform.BackEnd,
                type: model_1.ProjectComponentType.Application,
            };
            const componentContext = {
                configProvider: {
                    getOverriddenPractice(practiceId) {
                        return { impact: lodash_1.default.get(config, ['practices', practiceId]) };
                    },
                },
                getPracticeContext() {
                    return {
                        projectComponent: componentMock,
                    };
                },
            };
            const practices = [DeprecatedTSLintPractice_1.DeprecatedTSLintPractice, ESLintUsedPractice_1.ESLintUsedPractice, TypeScriptUsedPractice_1.TypeScriptUsedPractice, JsGitignoreCorrectlySetPractice_1.JsGitignoreCorrectlySetPractice].map(ScannerUtils_1.ScannerUtils.initPracticeWithMetadata);
            const filteredPractices = await ScannerUtils_1.ScannerUtils.filterPractices(componentContext, practices);
            expect(filteredPractices.practicesOff.length).toBeGreaterThanOrEqual(1);
            expect(filteredPractices.customApplicablePractices.length).toBeGreaterThanOrEqual(2);
        });
        it('Filter correctly if practice impact is high and fail=high', () => {
            const argumentsProvider = ArgumentsProviderFactory_1.argumentsProviderFactory({ uri: '.', fail: model_1.PracticeImpact.high });
            const result = ScannerUtils_1.ScannerUtils.filterNotPracticingPracticesToFail(notPracticingHighImpactPracticeWithCtx, argumentsProvider);
            expect(result).toHaveLength(1);
        });
        it('Filter correctly if practice impact is high and fail=all', () => {
            const argumentsProvider = ArgumentsProviderFactory_1.argumentsProviderFactory({ uri: '.', fail: 'all' });
            const notPracticingMediumImpactPracticeWithCtx = [];
            notPracticingMediumImpactPracticeWithCtx.push(PracticeWithContextFactory_1.practiceWithContextFactory({ evaluation: model_1.PracticeEvaluationResult.notPracticing }));
            const result = ScannerUtils_1.ScannerUtils.filterNotPracticingPracticesToFail(notPracticingHighImpactPracticeWithCtx, argumentsProvider);
            expect(result).toHaveLength(1);
        });
        it('Filter correctly if practice impact is high and fail=off', () => {
            const argumentsProvider = ArgumentsProviderFactory_1.argumentsProviderFactory({ uri: '.', fail: model_1.PracticeImpact.off });
            const result = ScannerUtils_1.ScannerUtils.filterNotPracticingPracticesToFail(notPracticingHighImpactPracticeWithCtx, argumentsProvider);
            expect(result).toHaveLength(0);
        });
        it('Returns practiceImpcat high and medium if the medium is passed', () => {
            const result = ScannerUtils_1.ScannerUtils.getImpactFailureLevels(model_1.PracticeImpact.medium);
            expect(result).toEqual([model_1.PracticeImpact.high, model_1.PracticeImpact.medium]);
        });
        it('Returns practiceImpcat high, medium and small if the small is passed', () => {
            const result = ScannerUtils_1.ScannerUtils.getImpactFailureLevels(model_1.PracticeImpact.small);
            expect(result).toEqual([model_1.PracticeImpact.high, model_1.PracticeImpact.medium, model_1.PracticeImpact.small]);
        });
        it('Returns practiceImpcat high, medium, small and hint if the hint is passed', () => {
            const result = ScannerUtils_1.ScannerUtils.getImpactFailureLevels(model_1.PracticeImpact.hint);
            expect(result).toEqual([model_1.PracticeImpact.high, model_1.PracticeImpact.medium, model_1.PracticeImpact.small, model_1.PracticeImpact.hint]);
        });
    });
});
//# sourceMappingURL=ScannerUtils.spec.js.map