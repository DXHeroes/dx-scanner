"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const inspectors_1 = require("../../inspectors");
const inversify_config_1 = require("../../inversify.config");
const model_1 = require("../../model");
const services_1 = require("../../services");
const getIssuesResponse_1 = require("../../services/git/__MOCKS__/bitbucketServiceMockFolder/getIssuesResponse");
const types_1 = require("../../types");
const TimeToSolveIssuesPractice_1 = require("./TimeToSolveIssuesPractice");
const bitbucketServiceMockFolder_1 = require("../../services/git/__MOCKS__/bitbucketServiceMockFolder");
const IBitbucketService_1 = require("../../services/bitbucket/IBitbucketService");
describe('TimeToSolveIssuesPractice', () => {
    let practice;
    let containerCtx;
    const MockedIssueTrackingInspector = inspectors_1.IssueTrackingInspector;
    let mockIssueTrackingInspector;
    beforeAll(() => {
        containerCtx = inversify_config_1.createTestContainer();
        containerCtx.container.bind('TimeToSolveIssuesPractice').to(TimeToSolveIssuesPractice_1.TimeToSolveIssuesPractice);
        containerCtx.container.rebind(types_1.Types.IContentRepositoryBrowser).to(services_1.BitbucketService);
        practice = containerCtx.container.get('TimeToSolveIssuesPractice');
        mockIssueTrackingInspector = new MockedIssueTrackingInspector();
    });
    afterEach(async () => {
        containerCtx.virtualFileSystemService.clearFileSystem();
        containerCtx.practiceContext.fileInspector.purgeCache();
    });
    it('returns practicing if there are open issues updated or created less than 60 days from now', async () => {
        mockIssueTrackingInspector.listIssues = async () => {
            return getIssuesResponse_1.getIssuesResponse([
                bitbucketServiceMockFolder_1.getIssueResponse({
                    state: IBitbucketService_1.BitbucketPullRequestState.open,
                    updatedAt: moment_1.default().subtract(7, 'd').format('YYYY-MM-DDTHH:mm:ss.SSSSSSZ'),
                }),
            ]);
        };
        const evaluated = await practice.evaluate(Object.assign(Object.assign({}, containerCtx.practiceContext), { issueTrackingInspector: mockIssueTrackingInspector }));
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.practicing);
    });
    it('returns practicing if there are open issues updated or created more than 60 days from now', async () => {
        mockIssueTrackingInspector.listIssues = async () => {
            return getIssuesResponse_1.getIssuesResponse([
                bitbucketServiceMockFolder_1.getIssueResponse({
                    state: 'new',
                    updatedAt: moment_1.default().subtract(61, 'd').format('YYYY-MM-DDTHH:mm:ss.SSSSSSZ'),
                }),
            ]);
        };
        const evaluated = await practice.evaluate(Object.assign(Object.assign({}, containerCtx.practiceContext), { issueTrackingInspector: mockIssueTrackingInspector }));
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.notPracticing);
    });
    it('returns always true, as it is always applicable', async () => {
        const response = await practice.isApplicable();
        expect(response).toBe(true);
    });
    it('throw error if there is no issueTrackingInspector', async () => {
        await expect(practice.evaluate(Object.assign(Object.assign({}, containerCtx.practiceContext), { issueTrackingInspector: undefined }))).rejects.toThrow('You probably provided bad acess token to your repository or did not provided at all.');
    });
});
//# sourceMappingURL=TimeToSolveIssuesPractice.spec.js.map