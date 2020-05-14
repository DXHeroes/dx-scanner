/* eslint-disable @typescript-eslint/no-namespace */
import { PracticeEvaluationResult } from '../model';
import { argumentsProviderFactory } from '../test/factories/ArgumentsProviderFactory';
import { practiceWithContextFactory } from '../test/factories/PracticeWithContextFactory';
import { EnterpriseReporter } from './EnterpriseReporter';

describe('EnterpriseReporter', () => {
  const practicingHighImpactPracticeWithCtx = practiceWithContextFactory();
  const notPracticingHighImpactPracticeWithCtx = practiceWithContextFactory({ evaluation: PracticeEvaluationResult.notPracticing });

  describe('#report', () => {
    it('one practicing practice', async () => {
      const result = new EnterpriseReporter(argumentsProviderFactory()).buildReport([practicingHighImpactPracticeWithCtx]);

      await expect(result.componentsWithDxScore).toContainObject({
        dxScoreResult: { points: { total: 100, max: 100, percentage: 100 }, value: '100% | 1/1' },
      });
      expect(result.id).toBeDefined;
      expect(result.version).toBeDefined;
    });

    it('one practicing practice and one not practicing in two components', async () => {
      const result = new EnterpriseReporter(argumentsProviderFactory()).buildReport([
        practicingHighImpactPracticeWithCtx,
        notPracticingHighImpactPracticeWithCtx,
      ]);

      await expect(result.componentsWithDxScore).toContainObject({
        dxScoreResult: {
          value: '50% | 1/2',
          points: {
            total: 100,
            max: 200,
            percentage: 50,
          },
        },
      });
      expect(result.dxScoreResult).toMatchObject({
        value: '50% | 1/2',
        points: {
          total: 100,
          max: 200,
          percentage: 50,
        },
      });
      expect(result.id).toBeDefined;
      expect(result.version).toBeDefined;
    });

    it('one not practicing practice', async () => {
      const result = new EnterpriseReporter(argumentsProviderFactory()).buildReport([notPracticingHighImpactPracticeWithCtx]);

      await expect(result.componentsWithDxScore).toContainObject({
        dxScoreResult: {
          value: '0% | 0/1',
          points: {
            total: 0,
            max: 100,
            percentage: 0,
          },
        },
      });
      expect(result.id).toBeDefined;
      expect(result.version).toBeDefined;
    });
  });

  // TODO move to seperate file when needed
  // implement custom matcher
  // match partial object in the array
  expect.extend({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async toContainObject(response: Array<Record<string, any>>, object: Record<string, any>) {
      const pass = this.equals(response, expect.arrayContaining([expect.objectContaining(object)]));

      if (pass) {
        return {
          message: () => `expected ${this.utils.printReceived(response)} not to contain object ${this.utils.printExpected(object)}`,
          pass: true,
        };
      } else {
        return {
          message: () => `expected ${this.utils.printReceived(response)} to contain object ${this.utils.printExpected(object)}`,
          pass: false,
        };
      }
    },
  });
});

declare global {
  namespace jest {
    interface Matchers<R> {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toContainObject(object: Record<string, any>): Promise<object>;
    }
  }
}
