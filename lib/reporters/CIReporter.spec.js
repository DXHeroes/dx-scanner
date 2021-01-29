"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_1 = require("../model");
const RepositoryConfig_mock_1 = require("../scanner/__MOCKS__/RepositoryConfig.mock");
const ScanningStrategy_mock_1 = require("../scanner/__MOCKS__/ScanningStrategy.mock");
const services_1 = require("../services");
const GitLabService_1 = require("../services/gitlab/GitLabService");
const ArgumentsProviderFactory_1 = require("../test/factories/ArgumentsProviderFactory");
const PracticeWithContextFactory_1 = require("../test/factories/PracticeWithContextFactory");
const CIReportBuilder_1 = require("./builders/CIReportBuilder");
const CIReporter_1 = require("./CIReporter");
describe('CIReporter', () => {
    const practicingHighImpactPracticeWithCtx = PracticeWithContextFactory_1.practiceWithContextFactory();
    const notPracticingHighImpactPracticeWithCtx = PracticeWithContextFactory_1.practiceWithContextFactory({ evaluation: model_1.PracticeEvaluationResult.notPracticing });
    const services = {
        bitbucketService: new services_1.BitbucketService(ArgumentsProviderFactory_1.argumentsProviderFactory({ uri: '.' }), RepositoryConfig_mock_1.repositoryConfig),
        githubService: new services_1.GitHubService(ArgumentsProviderFactory_1.argumentsProviderFactory({ uri: '.' }), RepositoryConfig_mock_1.repositoryConfig),
        gitLabService: new GitLabService_1.GitLabService(ArgumentsProviderFactory_1.argumentsProviderFactory({ uri: '.' }), RepositoryConfig_mock_1.repositoryConfig),
    };
    describe('#report', () => {
        it('one practicing practice', () => {
            const result = new CIReporter_1.CIReporter(ArgumentsProviderFactory_1.argumentsProviderFactory({ uri: '.' }), RepositoryConfig_mock_1.repositoryConfig, ScanningStrategy_mock_1.scanningStrategy, services.githubService, services.bitbucketService, services.gitLabService).buildReport([practicingHighImpactPracticeWithCtx]);
            expect(result).toContain(CIReportBuilder_1.CIReportBuilder.ciReportIndicator);
        });
        it('one practicing practice and one not practicing', () => {
            const result = new CIReporter_1.CIReporter(ArgumentsProviderFactory_1.argumentsProviderFactory({ uri: '.' }), RepositoryConfig_mock_1.repositoryConfig, ScanningStrategy_mock_1.scanningStrategy, services.githubService, services.bitbucketService, services.gitLabService).buildReport([practicingHighImpactPracticeWithCtx, notPracticingHighImpactPracticeWithCtx]);
            expect(result).toContain(CIReportBuilder_1.CIReportBuilder.ciReportIndicator);
        });
        it('all impacted practices', () => {
            const result = new CIReporter_1.CIReporter(ArgumentsProviderFactory_1.argumentsProviderFactory({ uri: '.' }), RepositoryConfig_mock_1.repositoryConfig, ScanningStrategy_mock_1.scanningStrategy, services.githubService, services.bitbucketService, services.gitLabService).buildReport([
                practicingHighImpactPracticeWithCtx,
                notPracticingHighImpactPracticeWithCtx,
                PracticeWithContextFactory_1.practiceWithContextFactory({
                    overridenImpact: model_1.PracticeImpact.medium,
                    evaluation: model_1.PracticeEvaluationResult.notPracticing,
                }),
                PracticeWithContextFactory_1.practiceWithContextFactory({
                    overridenImpact: model_1.PracticeImpact.small,
                    evaluation: model_1.PracticeEvaluationResult.notPracticing,
                }),
                PracticeWithContextFactory_1.practiceWithContextFactory({
                    overridenImpact: model_1.PracticeImpact.hint,
                    evaluation: model_1.PracticeEvaluationResult.notPracticing,
                }),
                PracticeWithContextFactory_1.practiceWithContextFactory({
                    overridenImpact: model_1.PracticeImpact.off,
                    evaluation: model_1.PracticeEvaluationResult.notPracticing,
                    isOn: false,
                }),
                PracticeWithContextFactory_1.practiceWithContextFactory({ overridenImpact: model_1.PracticeImpact.high, evaluation: model_1.PracticeEvaluationResult.unknown }),
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
//# sourceMappingURL=CIReporter.spec.js.map