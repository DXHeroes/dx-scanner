"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_1 = require("../model");
const ArgumentsProviderFactory_1 = require("../test/factories/ArgumentsProviderFactory");
const PracticeWithContextFactory_1 = require("../test/factories/PracticeWithContextFactory");
const DashboardReporter_1 = require("./DashboardReporter");
const IScanningStrategy_1 = require("../detectors/IScanningStrategy");
const DataCollector_1 = require("../collectors/DataCollector");
const RepositoryConfig_mock_1 = require("../scanner/__MOCKS__/RepositoryConfig.mock");
const services_1 = require("../services");
const ContributorsCollector_1 = require("../collectors/ContributorsCollector");
const gitHubNock_1 = require("../test/helpers/gitHubNock");
const BranchesCollector_1 = require("../collectors/BranchesCollector");
const inspectors_1 = require("../inspectors");
describe('DashboardReporter', () => {
    const practicingHighImpactPracticeWithCtx = PracticeWithContextFactory_1.practiceWithContextFactory();
    const notPracticingHighImpactPracticeWithCtx = PracticeWithContextFactory_1.practiceWithContextFactory({ evaluation: model_1.PracticeEvaluationResult.notPracticing });
    const scanningStrategy = {
        accessType: IScanningStrategy_1.AccessType.public,
        localPath: '.',
        rootPath: undefined,
        remoteUrl: 'https://github.com/DXHeroes/dx-scanner',
        isOnline: true,
        serviceType: IScanningStrategy_1.ServiceType.github,
    };
    const githubService = new services_1.GitHubService(ArgumentsProviderFactory_1.argumentsProviderFactory({ uri: '.' }), RepositoryConfig_mock_1.repositoryConfig);
    const gitInspector = new inspectors_1.GitInspector('.');
    const contributorsCollector = new ContributorsCollector_1.ContributorsCollector(githubService);
    const branchesCollector = new BranchesCollector_1.BranchesCollector(githubService, gitInspector);
    const dataCollector = new DataCollector_1.DataCollector(contributorsCollector, branchesCollector);
    const gitHubNock = new gitHubNock_1.GitHubNock('1', 'DXHeroes', 1, 'dx-scanner');
    describe('#report', () => {
        it('one practicing practice', async () => {
            gitHubNock.getContributors([
                { id: '251370', login: 'Spaceghost' },
                { id: '583231', login: 'octocat' },
            ]);
            const result = await new DashboardReporter_1.DashboardReporter(ArgumentsProviderFactory_1.argumentsProviderFactory(), scanningStrategy, dataCollector).buildReport([
                practicingHighImpactPracticeWithCtx,
            ]);
            await expect(result.componentsWithDxScore).toContainObject({
                dxScore: { points: { total: 100, max: 100, percentage: 100 }, value: '100% | 1/1' },
            });
            expect(result.id).toBeDefined;
            expect(result.version).toBeDefined;
        });
        it('one practicing practice and one not practicing in two components', async () => {
            gitHubNock.getContributors([
                { id: '251370', login: 'Spaceghost' },
                { id: '583231', login: 'octocat' },
            ]);
            const result = await new DashboardReporter_1.DashboardReporter(ArgumentsProviderFactory_1.argumentsProviderFactory(), scanningStrategy, dataCollector).buildReport([
                practicingHighImpactPracticeWithCtx,
                notPracticingHighImpactPracticeWithCtx,
            ]);
            await expect(result.componentsWithDxScore).toContainObject({
                dxScore: {
                    value: '50% | 1/2',
                    points: {
                        total: 100,
                        max: 200,
                        percentage: 50,
                    },
                },
            });
            expect(result.dxScore).toMatchObject({
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
            gitHubNock.getContributors([
                { id: '251370', login: 'Spaceghost' },
                { id: '583231', login: 'octocat' },
            ]);
            const result = await new DashboardReporter_1.DashboardReporter(ArgumentsProviderFactory_1.argumentsProviderFactory(), scanningStrategy, dataCollector).buildReport([
                notPracticingHighImpactPracticeWithCtx,
            ]);
            await expect(result.componentsWithDxScore).toContainObject({
                dxScore: {
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
    // TODO move to separate file when needed
    // implement custom matcher
    // match partial object in the array
    expect.extend({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async toContainObject(response, object) {
            const pass = this.equals(response, expect.arrayContaining([expect.objectContaining(object)]));
            if (pass) {
                return {
                    message: () => `expected ${this.utils.printReceived(response)} not to contain object ${this.utils.printExpected(object)}`,
                    pass: true,
                };
            }
            else {
                return {
                    message: () => `expected ${this.utils.printReceived(response)} to contain object ${this.utils.printExpected(object)}`,
                    pass: false,
                };
            }
        },
    });
});
//# sourceMappingURL=DashboardReporter.spec.js.map