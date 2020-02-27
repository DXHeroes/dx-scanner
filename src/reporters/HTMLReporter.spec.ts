import { HTMLReporter } from './HTMLReporter';
import { practiceWithContextFactory } from '../test/factories/PracticeWithContextFactory';
import { PracticeEvaluationResult, PracticeImpact } from '../model';
import { argumentsProviderFactory } from '../test/factories/ArgumentsProviderFactory';
import path from "path";
import fs from "fs";

describe('HTMLReporter', () => {
  const practicingHighImpactPracticeWithCtx = practiceWithContextFactory();
  const notPracticingHighImpactPracticeWithCtx = practiceWithContextFactory({ evaluation: PracticeEvaluationResult.notPracticing });
  const reportPath = path.resolve(process.cwd(), 'report.html');

  describe('#report', () => {
    it('one practicing practice', () => {
      new HTMLReporter(argumentsProviderFactory()).buildReport([practicingHighImpactPracticeWithCtx]);

      const result = fs.readFileSync(reportPath, "utf8");
      fs.unlinkSync(reportPath);
      expect(result).toContain('DX Score: 100% | 1/1');
    });

    it('one practicing practice and one not practicing', () => {
      new HTMLReporter(argumentsProviderFactory()).buildReport([
        practicingHighImpactPracticeWithCtx,
        notPracticingHighImpactPracticeWithCtx,
      ]);

      const result = fs.readFileSync(reportPath, "utf8");
      fs.unlinkSync(reportPath);
      expect(result).toContain('DX Score: 50% | 1/2');
    });

    it('all impacted practices', () => {
      new HTMLReporter(argumentsProviderFactory()).buildReport([
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

      const result = fs.readFileSync(reportPath, "utf8");
      fs.unlinkSync(reportPath);

      expect(result).toContain('Improvements with highest impact');
      expect(result).toContain('Improvements with medium impact');
      expect(result).toContain('Improvements with minor impact');
      expect(result).toContain('Also consider');
      expect(result).toContain('Evaluation of these practices failed');
      expect(result).toContain('You have turned off these practices');
    });
  });
});
