import { JSONReporter } from './JSONReporter';
import { practiceWithContextFactory } from '../test/factories/PracticeWithContextFactory';
import { PracticeEvaluationResult } from '../model';
import { argumentsProviderFactory } from '../test/factories/ArgumentsProviderFactory';

describe('JSONReporter', () => {
  const practicingHighImpactPracticeWithCtx = practiceWithContextFactory();
  const notPracticingHighImpactPracticeWithCtx = practiceWithContextFactory({ evaluation: PracticeEvaluationResult.notPracticing });

  describe('#report', () => {
    it('one practicing practice', () => {
      const result = new JSONReporter(argumentsProviderFactory({ uri: '.' })).buildReport([practicingHighImpactPracticeWithCtx]);

      expect(result).toHaveProperty('components');
      expect(result).toHaveProperty('uri');
      expect(result.components).toHaveLength(1);
      expect(result.components[0].practices).toHaveLength(1);
    });

    it('one practicing practice and one not practicing', () => {
      const result = new JSONReporter(argumentsProviderFactory({ uri: '.' })).buildReport([
        practicingHighImpactPracticeWithCtx,
        notPracticingHighImpactPracticeWithCtx,
      ]);

      expect(result).toHaveProperty('components');
      expect(result).toHaveProperty('uri');
      expect(result.components).toHaveLength(1);
      expect(result.components[0].practices).toHaveLength(2);
    });
  });
});
