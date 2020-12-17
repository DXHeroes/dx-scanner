"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIssueResponse = void 0;
const gitHubNock_1 = require("../../../../test/helpers/gitHubNock");
exports.getIssueResponse = {
    url: 'https://api.github.com/repos/octocat/Hello-World/issues/1',
    repository_url: 'https://api.github.com/repos/octocat/Hello-World',
    labels_url: 'https://api.github.com/repos/octocat/Hello-World/issues/1/labels{/name}',
    comments_url: 'https://api.github.com/repos/octocat/Hello-World/issues/1/comments',
    events_url: 'https://api.github.com/repos/octocat/Hello-World/issues/1/events',
    html_url: 'https://github.com/octocat/Hello-World/pull/1',
    id: 872858,
    node_id: 'MDExOlB1bGxSZXF1ZXN0MTQwOTAw',
    number: 1,
    title: 'Edited README via GitHub',
    user: new gitHubNock_1.UserItem('777449', 'unoju'),
    labels: [],
    state: 'closed',
    locked: false,
    assignee: null,
    assignees: [],
    milestone: null,
    comments: 28,
    created_at: '2011-05-09T19:10:00Z',
    updated_at: '2018-07-06T14:06:18Z',
    closed_at: '2011-05-18T20:00:25Z',
    author_association: 'NONE',
    pull_request: {
        url: 'https://api.github.com/repos/octocat/Hello-World/pulls/1',
        html_url: 'https://github.com/octocat/Hello-World/pull/1',
        diff_url: 'https://github.com/octocat/Hello-World/pull/1.diff',
        patch_url: 'https://github.com/octocat/Hello-World/pull/1.patch',
    },
    body: '',
    closed_by: new gitHubNock_1.UserItem('583231', 'octocat'),
};
//# sourceMappingURL=getIssueResponse.mock.js.map