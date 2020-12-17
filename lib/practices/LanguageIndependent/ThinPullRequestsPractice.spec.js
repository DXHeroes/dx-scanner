"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inspectors_1 = require("../../inspectors");
const inversify_config_1 = require("../../inversify.config");
const model_1 = require("../../model");
const services_1 = require("../../services");
const types_1 = require("../../types");
const ThinPullRequestsPractice_1 = require("./ThinPullRequestsPractice");
const getPullRequestsResponse_1 = require("../../services/git/__MOCKS__/bitbucketServiceMockFolder/getPullRequestsResponse");
const moment_1 = __importDefault(require("moment"));
const bitbucketServiceMockFolder_1 = require("../../services/git/__MOCKS__/bitbucketServiceMockFolder");
describe('ThinPullRequestsPractice', () => {
    let practice;
    let containerCtx;
    const MockedCollaborationInspector = inspectors_1.CollaborationInspector;
    let mockCollaborationInspector;
    beforeAll(() => {
        containerCtx = inversify_config_1.createTestContainer();
        containerCtx.container.bind('ThinPullRequestsPractice').to(ThinPullRequestsPractice_1.ThinPullRequestsPractice);
        containerCtx.container.rebind(types_1.Types.IContentRepositoryBrowser).to(services_1.BitbucketService);
        practice = containerCtx.container.get('ThinPullRequestsPractice');
        mockCollaborationInspector = new MockedCollaborationInspector();
    });
    afterEach(async () => {
        containerCtx.virtualFileSystemService.clearFileSystem();
        containerCtx.practiceContext.fileInspector.purgeCache();
        containerCtx.practiceContext.config = {};
    });
    it('return practicing if there is not a fat PR no older than 30 days than the newest PR', async () => {
        mockCollaborationInspector.listPullRequests = async () => {
            return getPullRequestsResponse_1.getPullRequestsResponse();
        };
        const evaluated = await practice.evaluate(Object.assign(Object.assign({}, containerCtx.practiceContext), { collaborationInspector: mockCollaborationInspector }));
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.practicing);
    });
    it('return notPracticing if there is a fat PR no older than 7 days than the newest PR (default measurePullRequestsCount)', async () => {
        mockCollaborationInspector.listPullRequests = async () => {
            return getPullRequestsResponse_1.getPullRequestsResponse([
                bitbucketServiceMockFolder_1.getPullRequestResponse({
                    updatedAt: moment_1.default().subtract(7, 'd').format('YYYY-MM-DDTHH:mm:ss.SSSSSSZ'),
                    lines: {
                        additions: 1000,
                        deletions: 500,
                        changes: 1500,
                    },
                }),
            ]);
        };
        const evaluated = await practice.evaluate(Object.assign(Object.assign({}, containerCtx.practiceContext), { collaborationInspector: mockCollaborationInspector }));
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.notPracticing);
    });
    it('return practicing if there is a fat PR with higher overriden measurePullRequestsCount', async () => {
        mockCollaborationInspector.listPullRequests = async () => {
            return getPullRequestsResponse_1.getPullRequestsResponse([
                bitbucketServiceMockFolder_1.getPullRequestResponse({
                    updatedAt: moment_1.default().subtract(3, 'd').format('YYYY-MM-DDTHH:mm:ss.SSSSSSZ'),
                    lines: {
                        additions: 1000,
                        deletions: 500,
                        changes: 1500,
                    },
                }),
            ]);
        };
        containerCtx.practiceContext.config = { override: { measurePullRequestCount: 2000 } };
        const evaluated = await practice.evaluate(Object.assign(Object.assign({}, containerCtx.practiceContext), { collaborationInspector: mockCollaborationInspector }));
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.practicing);
    });
    it('return notPracticing if there is a small PR with lower overriden measurePullRequestsCount', async () => {
        mockCollaborationInspector.listPullRequests = async () => {
            return getPullRequestsResponse_1.getPullRequestsResponse([
                bitbucketServiceMockFolder_1.getPullRequestResponse({
                    updatedAt: moment_1.default().subtract(2, 'd').format('YYYY-MM-DDTHH:mm:ss.SSSSSSZ'),
                    lines: {
                        additions: 20,
                        deletions: 5,
                        changes: 25,
                    },
                }),
            ]);
        };
        containerCtx.practiceContext.config = { override: { measurePullRequestCount: 10 } };
        const evaluated = await practice.evaluate(Object.assign(Object.assign({}, containerCtx.practiceContext), { collaborationInspector: mockCollaborationInspector }));
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.notPracticing);
    });
    it('return unknown if there is no PR', async () => {
        mockCollaborationInspector.listPullRequests = async () => {
            return getPullRequestsResponse_1.getPullRequestsResponse([]);
        };
        const evaluated = await practice.evaluate(Object.assign(Object.assign({}, containerCtx.practiceContext), { collaborationInspector: mockCollaborationInspector }));
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.unknown);
    });
    it('return true as it is always applicable', async () => {
        const applicable = await practice.isApplicable();
        expect(applicable).toEqual(true);
    });
    it('return unknown if there is no collaborationInspector', async () => {
        containerCtx.practiceContext.collaborationInspector = undefined;
        const evaluated = await practice.evaluate(containerCtx.practiceContext);
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.unknown);
    });
});
//# sourceMappingURL=ThinPullRequestsPractice.spec.js.map