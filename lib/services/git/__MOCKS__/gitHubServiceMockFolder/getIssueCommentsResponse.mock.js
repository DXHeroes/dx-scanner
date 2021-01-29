"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIssueCommentsResponse = void 0;
const gitHubNock_1 = require("../../../../test/helpers/gitHubNock");
exports.getIssueCommentsResponse = [
    {
        url: 'https://api.github.com/repos/octocat/Hello-World/issues/comments/1340258',
        html_url: 'https://github.com/octocat/Hello-World/pull/1#issuecomment-1340258',
        issue_url: 'https://api.github.com/repos/octocat/Hello-World/issues/1',
        id: 1340258,
        node_id: 'MDEyOklzc3VlQ29tbWVudDEzNDAyNTg=',
        user: new gitHubNock_1.UserItem('841296', 'masonzou'),
        created_at: '2011-06-10T07:30:27Z',
        updated_at: '2011-06-10T07:30:27Z',
        author_association: 'NONE',
        body: 'test\n',
    },
    {
        url: 'https://api.github.com/repos/octocat/Hello-World/issues/comments/13725928',
        html_url: 'https://github.com/octocat/Hello-World/pull/1#issuecomment-13725928',
        issue_url: 'https://api.github.com/repos/octocat/Hello-World/issues/1',
        id: 13725928,
        node_id: 'MDEyOklzc3VlQ29tbWVudDEzNzI1OTI4',
        user: new gitHubNock_1.UserItem('3627156', '198103292005021004'),
        created_at: '2013-02-18T15:09:23Z',
        updated_at: '2013-02-18T15:09:23Z',
        author_association: 'NONE',
        body: 'affirmative\n',
    },
];
//# sourceMappingURL=getIssueCommentsResponse.mock.js.map