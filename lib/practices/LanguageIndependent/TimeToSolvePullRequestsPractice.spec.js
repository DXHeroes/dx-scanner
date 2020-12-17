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
const bitbucketServiceMockFolder_1 = require("../../services/git/__MOCKS__/bitbucketServiceMockFolder");
const getPullRequestsResponse_1 = require("../../services/git/__MOCKS__/bitbucketServiceMockFolder/getPullRequestsResponse");
const types_1 = require("../../types");
const TimeToSolvePullRequestsPractice_1 = require("./TimeToSolvePullRequestsPractice");
const IBitbucketService_1 = require("../../services/bitbucket/IBitbucketService");
describe('TimeToSolvePullRequestsPractice', () => {
    let practice;
    let containerCtx;
    const MockedCollaborationInspector = inspectors_1.CollaborationInspector;
    let mockCollaborationInspector;
    beforeAll(() => {
        containerCtx = inversify_config_1.createTestContainer();
        containerCtx.container.bind('TimeToSolvePractice').to(TimeToSolvePullRequestsPractice_1.TimeToSolvePullRequestsPractice);
        containerCtx.container.rebind(types_1.Types.IContentRepositoryBrowser).to(services_1.BitbucketService);
        practice = containerCtx.container.get('TimeToSolvePractice');
        mockCollaborationInspector = new MockedCollaborationInspector();
    });
    afterEach(async () => {
        containerCtx.virtualFileSystemService.clearFileSystem();
        containerCtx.practiceContext.fileInspector.purgeCache();
    });
    it('returns practicing if there are open pullrequests updated or created less than 10 days from now', async () => {
        mockCollaborationInspector.listPullRequests = async () => {
            return getPullRequestsResponse_1.getPullRequestsResponse([
                bitbucketServiceMockFolder_1.getPullRequestResponse({
                    state: IBitbucketService_1.BitbucketPullRequestState.open,
                    updatedAt: moment_1.default().subtract(7, 'd').format('YYYY-MM-DDTHH:mm:ss.SSSSSSZ'),
                }),
            ]);
        };
        const evaluated = await practice.evaluate(Object.assign(Object.assign({}, containerCtx.practiceContext), { collaborationInspector: mockCollaborationInspector }));
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.practicing);
    });
    it('returns practicing if there are open pullrequests updated or created more than 100 days from now', async () => {
        mockCollaborationInspector.listPullRequests = async () => {
            return getPullRequestsResponse_1.getPullRequestsResponse([
                bitbucketServiceMockFolder_1.getPullRequestResponse({
                    state: IBitbucketService_1.BitbucketPullRequestState.open,
                    updatedAt: moment_1.default().subtract(100, 'd').format('YYYY-MM-DDTHH:mm:ss.SSSSSSZ'),
                }),
            ]);
        };
        const evaluated = await practice.evaluate(Object.assign(Object.assign({}, containerCtx.practiceContext), { collaborationInspector: mockCollaborationInspector }));
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.notPracticing);
    });
    it('returns always true, as it is always applicable', async () => {
        const response = await practice.isApplicable();
        expect(response).toBe(true);
    });
    it('returns unknown if there is no collaborationInspector', async () => {
        const evaluated = await practice.evaluate(Object.assign(Object.assign({}, containerCtx.practiceContext), { collaborationInspector: undefined }));
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.unknown);
    });
});
//# sourceMappingURL=TimeToSolvePullRequestsPractice.spec.js.map