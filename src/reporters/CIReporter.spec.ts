import { CIReporter } from './CIReporter';
import { practiceWithContextFactory } from '../test/factories/PracticeWithContextFactory';
import { PracticeEvaluationResult, PracticeImpact } from '../model';
import { argumentsProviderFactory } from '../test/factories/ArgumentsProviderFactory';
import { CIReportBuilder } from './builders/CIReportBuilder';
import { BitbucketService, GitHubService } from '../services';
import { GitLabService } from '../services/gitlab/GitLabService';

describe('CIReporter', () => {
  const practicingHighImpactPracticeWithCtx = practiceWithContextFactory();
  const notPracticingHighImpactPracticeWithCtx = practiceWithContextFactory({ evaluation: PracticeEvaluationResult.notPracticing });

  const repositoryConfig = {
    remoteUrl: 'https://bitbucket.org/pypy/pypy',
    baseUrl: 'https://bitbucket.org',
    host: 'githum.com',
    protocol: 'https',
  };

  const services = {
    bitbucketService: new BitbucketService(argumentsProviderFactory({ uri: '.' }), repositoryConfig),
    githubService: new GitHubService(argumentsProviderFactory({ uri: '.' }), repositoryConfig),
    gitLabService: new GitLabService(argumentsProviderFactory({ uri: '.' }), repositoryConfig),
  };

  describe('#report', () => {
    it('one practicing practice', () => {
      const result = new CIReporter(
        argumentsProviderFactory({ uri: '.' }),
        services.githubService,
        services.bitbucketService,
        services.gitLabService,
      ).buildReport([practicingHighImpactPracticeWithCtx]);

      expect(result).toContain(CIReportBuilder.ciReportIndicator);
    });

    it('one practicing practice and one not practicing', () => {
      const result = new CIReporter(
        argumentsProviderFactory({ uri: '.' }),
        services.githubService,
        services.bitbucketService,
        services.gitLabService,
      ).buildReport([practicingHighImpactPracticeWithCtx, notPracticingHighImpactPracticeWithCtx]);

      expect(result).toContain(CIReportBuilder.ciReportIndicator);
    });

    it('all impacted practices', () => {
      const result = new CIReporter(
        argumentsProviderFactory({ uri: '.' }),
        services.githubService,
        services.bitbucketService,
        services.gitLabService,
      ).buildReport([
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
