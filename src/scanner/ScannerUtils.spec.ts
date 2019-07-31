/* eslint-disable @typescript-eslint/no-explicit-any */
import { ScannerUtils } from './ScannerUtils';
import { DeprecatedTSLintPractice } from '../practices/JavaScript/DeprecatedTSLintPractice';
import { ESLintUsedPractice } from '../practices/JavaScript/ESLintUsedPractice';
import { TypeScriptUsedPractice } from '../practices/JavaScript/TypeScriptUsedPractice';
import { FirstTestPractice, SecondTestPractice, InvalidTestPractice } from './__MOCKS__';
import { PracticeEvaluationResult } from '../model';

describe('ScannerUtils', () => {
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
      };
      const practice = ScannerUtils.initPracticeWithMetadata(DeprecatedTSLintPractice);
      const result = ScannerUtils.isFulfilled(practice, [evaluatedPractice]);

      expect(result).toEqual(false);
    });
  });
});
