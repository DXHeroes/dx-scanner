import { PracticeEvaluationResult, PracticeImpact } from '../model';
import { scanningStrategy } from '../scanner/__MOCKS__/ScanningStrategy.mock';
import { argumentsProviderFactory } from '../test/factories/ArgumentsProviderFactory';
import { practiceWithContextFactory } from '../test/factories/PracticeWithContextFactory';
import { CLIReporter } from './CLIReporter';

describe('CLIReporter', () => {
  const practicingHighImpactPracticeWithCtx = practiceWithContextFactory();
  const notPracticingHighImpactPracticeWithCtx = practiceWithContextFactory({ evaluation: PracticeEvaluationResult.notPracticing });

  describe('#report', () => {
    it('one practicing practice', () => {
      const result = new CLIReporter(argumentsProviderFactory(), scanningStrategy).buildReport([practicingHighImpactPracticeWithCtx]);

      expect(result).toContain('DX Score is 100% | 1/1');
    });

    it('one practicing practice and one not practicing', () => {
      const result = new CLIReporter(argumentsProviderFactory(), scanningStrategy).buildReport([
        practicingHighImpactPracticeWithCtx,
        notPracticingHighImpactPracticeWithCtx,
      ]);

      expect(result).toContain('DX Score is 50% | 1/2');
    });

    it('all impacted practices', () => {
      const result = new CLIReporter(argumentsProviderFactory(), scanningStrategy).buildReport([
        practicingHighImpactPracticeWithCtx,
        notPracticingHighImpactPracticeWithCtx,
        practiceWithContextFactory({
          overridenImpact: PracticeImpact.medium,
          evaluation: PracticeEvaluationResult.notPracticing,
        }),
        practiceWithContextFactory({
          overridenImpact: PracticeImpact.small,
          evaluation: PracticeEvaluationResult.notPracticing,
        }),
        practiceWithContextFactory({
          overridenImpact: PracticeImpact.hint,
          evaluation: PracticeEvaluationResult.notPracticing,
        }),
        practiceWithContextFactory({
          overridenImpact: PracticeImpact.off,
          evaluation: PracticeEvaluationResult.notPracticing,
          isOn: false,
        }),
        practiceWithContextFactory({ overridenImpact: PracticeImpact.high, evaluation: PracticeEvaluationResult.unknown }),
      ]);

      expect(result).toContain('Improvements with highest impact');
      expect(result).toContain('Improvements with medium impact');
      expect(result).toContain('Improvements with minor impact');
      expect(result).toContain('Also consider');
      expect(result).toContain('Evaluation of these practices failed');
      expect(result).toContain('You have turned off these practices');
    });
  });
});
