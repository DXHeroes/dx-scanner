/* eslint-disable @typescript-eslint/no-explicit-any */
import _ from 'lodash';
import { PracticeContext } from '../contexts/practice/PracticeContext';
import {
  PracticeEvaluationResult,
  PracticeImpact,
  ProgrammingLanguage,
  ProjectComponentFramework,
  ProjectComponentPlatform,
  ProjectComponentType,
} from '../model';
import { DeprecatedTSLintPractice } from '../practices/JavaScript/DeprecatedTSLintPractice';
import { ESLintUsedPractice } from '../practices/JavaScript/ESLintUsedPractice';
import { JsGitignoreCorrectlySetPractice } from '../practices/JavaScript/JsGitignoreCorrectlySetPractice';
import { TypeScriptUsedPractice } from '../practices/JavaScript/TypeScriptUsedPractice';
import { PracticeWithContextForReporter } from '../reporters/IReporter';
import { ScannerUtils } from './ScannerUtils';
import { FirstTestPractice, InvalidTestPractice, SecondTestPractice } from './__MOCKS__';
import { practiceWithContextFactory } from '../test/factories/PracticeWithContextFactory';
import { argumentsProviderFactory } from '../test/factories/ArgumentsProviderFactory';

describe('ScannerUtils', () => {
  const notPracticingHighImpactPracticeWithCtx: PracticeWithContextForReporter[] = [];
  notPracticingHighImpactPracticeWithCtx.push(practiceWithContextFactory({ evaluation: PracticeEvaluationResult.notPracticing }));

  describe('#sortPractices', () => {
    it('sorts practices correctly ', async () => {
      const practices = [DeprecatedTSLintPractice, ESLintUsedPractice, TypeScriptUsedPractice].map(ScannerUtils.initPracticeWithMetadata);
      const result = ScannerUtils.sortPractices(practices);

      expect(result.length).toEqual(3);
      expect(result.map((r) => r.getMetadata().id)).toEqual([
        'JavaScript.TypeScriptUsed',
        'JavaScript.ESLintUsed',
        'JavaScript.DeprecatedTSLint',
      ]);
    });

    it('throws an error with circular dependency', async () => {
      const practices = [FirstTestPractice, SecondTestPractice].map(ScannerUtils.initPracticeWithMetadata);
      expect(() => ScannerUtils.sortPractices(practices)).toThrowError();
    });

    it('throws an error with non existing practice', async () => {
      const expectedErrMsg = `Practice "Mock.NonExistingTestPractice" does not exists. It's set as dependency of "Mock.InvalidTestPractice"`;
      const practice = ScannerUtils.initPracticeWithMetadata(InvalidTestPractice);
      expect(() => ScannerUtils.sortPractices([practice])).toThrow(expectedErrMsg);
    });
  });

  describe('#isFulfilled', () => {
    it('checks fulfillments of a practice if the practice has expected evaluation result ', async () => {
      const evaluatedPractice = {
        componentContext: jest.fn() as any,
        practiceContext: jest.fn() as any,
        practice: ScannerUtils.initPracticeWithMetadata(ESLintUsedPractice),
        evaluation: PracticeEvaluationResult.practicing,
        isOn: jest.fn() as any,
      };

      const practice = ScannerUtils.initPracticeWithMetadata(DeprecatedTSLintPractice);
      const result = ScannerUtils.isFulfilled(practice, [evaluatedPractice]);

      expect(result).toEqual(true);
    });

    it('checks fulfillments of a practice if the practice has wrong evaluation result ', async () => {
      const evaluatedPractice = {
        componentContext: jest.fn() as any,
        practiceContext: jest.fn() as any,
        practice: ScannerUtils.initPracticeWithMetadata(ESLintUsedPractice),
        evaluation: PracticeEvaluationResult.notPracticing,
        isOn: jest.fn() as any,
      };
      const practice = ScannerUtils.initPracticeWithMetadata(DeprecatedTSLintPractice);
      const result = ScannerUtils.isFulfilled(practice, [evaluatedPractice]);

      expect(result).toEqual(false);
    });

    it('filterPractices() returns filtered out practices and practices off', async () => {
      const config = {
        practices: {
          'JavaScript.GitignoreCorrectlySet': PracticeImpact.off,
        },
      };

      const componentMock = {
        framework: ProjectComponentFramework.UNKNOWN,
        language: ProgrammingLanguage.JavaScript,
        path: './var/foo',
        platform: ProjectComponentPlatform.BackEnd,
        type: ProjectComponentType.Application,
      };

      const componentContext = {
        configProvider: {
          getOverriddenPractice(practiceId: string) {
            return { impact: _.get(config, ['practices', practiceId]) };
          },
        },

        getPracticeContext(): PracticeContext {
          return {
            projectComponent: componentMock,
          } as any;
        },
      };

      const practices = [DeprecatedTSLintPractice, ESLintUsedPractice, TypeScriptUsedPractice, JsGitignoreCorrectlySetPractice].map(
        ScannerUtils.initPracticeWithMetadata,
      );

      const filteredPractices = await ScannerUtils.filterPractices(componentContext as any, practices);

      expect(filteredPractices.practicesOff.length).toBeGreaterThanOrEqual(1);
      expect(filteredPractices.customApplicablePractices.length).toBeGreaterThanOrEqual(2);
    });

    it('Filter correctly if practice impact is high and fail=high', () => {
      const argumentsProvider = argumentsProviderFactory({ uri: '.', fail: PracticeImpact.high });
      const result = ScannerUtils.filterNotPracticingPracticesToFail(notPracticingHighImpactPracticeWithCtx, argumentsProvider);
      expect(result).toHaveLength(1);
    });

    it('Filter correctly if practice impact is high and fail=off', () => {
      const argumentsProvider = argumentsProviderFactory({ uri: '.', fail: PracticeImpact.off });
      const result = ScannerUtils.filterNotPracticingPracticesToFail(notPracticingHighImpactPracticeWithCtx, argumentsProvider);
      expect(result).toHaveLength(0);
    });
  });
});
