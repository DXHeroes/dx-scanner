"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_config_1 = require("../inversify.config");
const gitHubNock_1 = require("../test/helpers/gitHubNock");
const gitHubServiceMockFolder_1 = require("../services/git/__MOCKS__/gitHubServiceMockFolder");
describe('Issue Tracking Inspector', () => {
    let inspector;
    let containerCtx;
    beforeAll(async () => {
        containerCtx = inversify_config_1.createTestContainer();
        inspector = containerCtx.practiceContext.issueTrackingInspector;
    });
    it('returns paginated issues', async () => {
        new gitHubNock_1.GitHubNock('1', 'octocat', 1, 'Hello-World').getIssues().reply(200, gitHubServiceMockFolder_1.getIssuesResponse);
        const response = await inspector.listIssues('octocat', 'Hello-World');
        expect(response).toMatchObject(gitHubServiceMockFolder_1.getIssuesServiceResponse);
    });
    it('returns paginated issue comments', async () => {
        new gitHubNock_1.GitHubNock('1', 'octocat', 1, 'Hello-World').getRepo('/issues/461030590/comments').reply(200, gitHubServiceMockFolder_1.getIssueCommentsResponse);
        const response = await inspector.listIssueComments('octocat', 'Hello-World', 461030590);
        expect(response).toMatchObject(gitHubServiceMockFolder_1.getIssueCommentsServiceResponse);
    });
    it('returns a single issue', async () => {
        new gitHubNock_1.GitHubNock('1', 'octocat', 1, 'Hello-World').getIssues(1).reply(200, gitHubServiceMockFolder_1.getIssueResponse);
        const response = await inspector.getIssue('octocat', 'Hello-World', 1);
        expect(response).toMatchObject(gitHubServiceMockFolder_1.getIssueServiceResponse);
    });
});
//# sourceMappingURL=IssueTrackingInspector.spec.js.map