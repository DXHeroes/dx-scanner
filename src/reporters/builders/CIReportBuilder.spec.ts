import { practiceWithContextFactory } from '../../test/factories/PracticeWithContextFactory';
import { PracticeEvaluationResult, PracticeImpact } from '../../model';
import { CIReportBuilder } from './CIReportBuilder';
import { RepositoryConfig } from '../../scanner/RepositoryConfig';

describe('CIReportBuilder', () => {
  const practicingHighImpactPracticeWithCtx = practiceWithContextFactory({ practice: { name: 'practicing1', url: './practicing' } });
  const notPracticingHighImpactPracticeWithCtx = practiceWithContextFactory({
    practice: { name: 'notPracticing1', url: './notPracticing' },
    evaluation: PracticeEvaluationResult.notPracticing,
  });

  describe('#build', () => {
    it('one practicing practice contains all necessary data', () => {
      const result = new CIReportBuilder([practicingHighImpactPracticeWithCtx], repositoryConfig).build();

      const mustContainElements = [CIReportBuilder.ciReportIndicator];

      mustContainElements.forEach((e) => {
        expect(result).toContain(e);
      });
    });

    it('one practicing practice and one not practicing', () => {
      const result = new CIReportBuilder(
        [practicingHighImpactPracticeWithCtx, notPracticingHighImpactPracticeWithCtx],
        repositoryConfig,
      ).build();

      const mustContainElements = [
        CIReportBuilder.ciReportIndicator,
        notPracticingHighImpactPracticeWithCtx.practice.name,
        notPracticingHighImpactPracticeWithCtx.practice.url,
      ];

      const mustNotContainElements = [practicingHighImpactPracticeWithCtx.practice.name, practicingHighImpactPracticeWithCtx.practice.url];

      mustContainElements.forEach((e) => {
        expect(result).toContain(e);
      });

      mustNotContainElements.forEach((e) => {
        expect(result).not.toContain(e);
      });
    });

    it('all impacted practices', () => {
      const result = new CIReportBuilder(
        [
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
        ],
        repositoryConfig,
      ).build();

      expect(result).toContain('Improvements with highest impact');
      expect(result).toContain('Improvements with medium impact');
      expect(result).toContain('Improvements with minor impact');
      expect(result).toContain('Also consider');
      expect(result).toContain('Evaluation of these practices failed');
      expect(result).toContain('You have turned off these practices');
    });
  });
  const repositoryConfig: RepositoryConfig = {
    remoteUrl: 'https://bitbucket.org/pypy/pypy',
    baseUrl: 'https://bitbucket.org',
    host: 'githum.com',
    protocol: 'https',
  };
});
