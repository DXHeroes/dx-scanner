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
      const componentWithDxScoreReport = result.componentsWithDxScore[0];

      await expect(result.componentsWithDxScore).toContainObject({
        dxScore: '100% | 1/1',
        id: componentWithDxScoreReport.id,
        version: componentWithDxScoreReport.version,
      });
    });

    it('one practicing practice and one not practicing', async () => {
      const result = new EnterpriseReporter(argumentsProviderFactory()).buildReport([
        practicingHighImpactPracticeWithCtx,
        notPracticingHighImpactPracticeWithCtx,
      ]);
      const componentWithDxScoreReport = result.componentsWithDxScore[0];

      await expect(result.componentsWithDxScore).toContainObject({
        dxScore: '50% | 1/2',
        id: componentWithDxScoreReport.id,
        version: componentWithDxScoreReport.version,
      });
    });

    it('one not practicing practice', async () => {
      const result = new EnterpriseReporter(argumentsProviderFactory()).buildReport([notPracticingHighImpactPracticeWithCtx]);
      const componentWithDxScoreReport = result.componentsWithDxScore[0];

      await expect(result.componentsWithDxScore).toContainObject({
        dxScore: '0% | 0/1',
        id: componentWithDxScoreReport.id,
        version: componentWithDxScoreReport.version,
      });
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
