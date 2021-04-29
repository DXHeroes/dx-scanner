"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CollaborationInspector_1 = require("../../inspectors/CollaborationInspector");
const inversify_config_1 = require("../../inversify.config");
const model_1 = require("../../model");
const getRepoCommitsServiceResponse_mock_1 = require("../../services/git/__MOCKS__/gitHubServiceMockFolder/getRepoCommitsServiceResponse.mock");
const CorrectCommitMessagesPractice_1 = require("./CorrectCommitMessagesPractice");
const lodash_1 = __importDefault(require("lodash"));
const listRepoCommitsResponse_1 = require("../../services/git/__MOCKS__/gitLabServiceMockFolder/listRepoCommitsResponse");
describe('CorrectCommitMessagesPractice', () => {
    let practice;
    let containerCtx;
    const MockedCollaborationInspector = CollaborationInspector_1.CollaborationInspector;
    let mockCollaborationInspector;
    beforeAll(() => {
        containerCtx = inversify_config_1.createTestContainer();
        containerCtx.container.bind('CorrectCommitMessagesPractice').to(CorrectCommitMessagesPractice_1.CorrectCommitMessagesPractice);
        practice = containerCtx.container.get('CorrectCommitMessagesPractice');
        mockCollaborationInspector = new MockedCollaborationInspector();
    });
    afterEach(async () => {
        containerCtx.virtualFileSystemService.clearFileSystem();
        containerCtx.practiceContext.fileInspector.purgeCache();
    });
    it('commit message without scope', async () => {
        mockCollaborationInspector.listRepoCommits = async () => {
            return changeRepoCommitsMessages('fix: correct commit message');
        };
        const evaluated = await practice.evaluate(Object.assign(Object.assign({}, containerCtx.practiceContext), { collaborationInspector: mockCollaborationInspector }));
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.practicing);
    });
    it('commit message with scope', async () => {
        mockCollaborationInspector.listRepoCommits = async () => {
            return changeRepoCommitsMessages('fix(something): correct commit message');
        };
        const evaluated = await practice.evaluate(Object.assign(Object.assign({}, containerCtx.practiceContext), { collaborationInspector: mockCollaborationInspector }));
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.practicing);
    });
    it('commit message with scope, body and signature', async () => {
        const cMsg = `fix(something): correct commit message\n\nCo-Authored-By: Prokop Simek <prokopsimek@users.noreply.github.com>`;
        mockCollaborationInspector.listRepoCommits = async () => {
            return changeRepoCommitsMessages(cMsg);
        };
        const evaluated = await practice.evaluate(Object.assign(Object.assign({}, containerCtx.practiceContext), { collaborationInspector: mockCollaborationInspector }));
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.practicing);
    });
    it('returns not practicing if more than 20% of commit messages are incorrect', async () => {
        mockCollaborationInspector.listRepoCommits = async () => {
            return listRepoCommitsResponse_1.listRepoCommits([
                changeRepoCommitsMessages('fix(something): correct commit message').items[0],
                ...changeRepoCommitsMessages('foo: some wrong message').items,
            ]);
        };
        const evaluated = await practice.evaluate(Object.assign(Object.assign({}, containerCtx.practiceContext), { collaborationInspector: mockCollaborationInspector }));
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.notPracticing);
    });
    it('the commit message has wrong type and is too long', async () => {
        mockCollaborationInspector.listRepoCommits = async () => {
            return changeRepoCommitsMessages('foo: some message some message some message some message some message some message');
        };
        const evaluated = await practice.evaluate(Object.assign(Object.assign({}, containerCtx.practiceContext), { collaborationInspector: mockCollaborationInspector }));
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.notPracticing);
    });
    it('throw error if there is no collaborationInspector', async () => {
        await expect(practice.evaluate(Object.assign(Object.assign({}, containerCtx.practiceContext), { collaborationInspector: undefined }))).rejects.toThrow('You probably provided bad acess token to your repository or did not provided at all.');
    });
    it('returns always true, as it is always applicable', async () => {
        const response = await practice.isApplicable();
        expect(response).toBe(true);
    });
    const changeRepoCommitsMessages = (message) => {
        const paginatedRepoCommits = {
            items: getRepoCommitsServiceResponse_mock_1.getRepoCommitsServiceResponse.items,
            hasNextPage: true,
            hasPreviousPage: false,
            page: 1,
            perPage: getRepoCommitsServiceResponse_mock_1.getRepoCommitsServiceResponse.items.length,
            totalCount: getRepoCommitsServiceResponse_mock_1.getRepoCommitsServiceResponse.items.length,
        };
        if (getRepoCommitsServiceResponse_mock_1.getRepoCommitsServiceResponse.items.length > 1) {
            const repoCommits = lodash_1.default.cloneDeep(getRepoCommitsServiceResponse_mock_1.getRepoCommitsServiceResponse.items);
            repoCommits.forEach((repoCommit) => {
                repoCommit.message = message;
                repoCommits.push(repoCommit);
            });
            paginatedRepoCommits.items = repoCommits;
        }
        else {
            getRepoCommitsServiceResponse_mock_1.getRepoCommitsServiceResponse.items[0].message = message;
        }
        return paginatedRepoCommits;
    };
});
//# sourceMappingURL=CorrectCommitMessagesPractice.spec.js.map