"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPullCommitsResponse = void 0;
const gitHubNock_1 = require("../../../../test/helpers/gitHubNock");
exports.getPullCommitsResponse = [
    {
        sha: '7044a8a032e85b6ab611033b2ac8af7ce85805b2',
        node_id: 'MDY6Q29tbWl0MTcyNDE5NTo3MDQ0YThhMDMyZTg1YjZhYjYxMTAzM2IyYWM4YWY3Y2U4NTgwNWIy',
        commit: {
            author: {
                name: 'unoju',
                email: 'myemailismels@yahoo.com',
                date: '2011-05-09T19:09:20Z',
            },
            committer: {
                name: 'unoju',
                email: 'myemailismels@yahoo.com',
                date: '2011-05-09T19:09:20Z',
            },
            message: 'Edited README via GitHub',
            tree: {
                sha: 'f1b625880dea0b3af9168f3537838d2607217460',
                url: 'https://api.github.com/repos/octocat/Hello-World/git/trees/f1b625880dea0b3af9168f3537838d2607217460',
            },
            url: 'https://api.github.com/repos/octocat/Hello-World/git/commits/7044a8a032e85b6ab611033b2ac8af7ce85805b2',
            comment_count: 0,
            verification: {
                verified: false,
                reason: 'unsigned',
                signature: null,
                payload: null,
            },
        },
        url: 'https://api.github.com/repos/octocat/Hello-World/commits/7044a8a032e85b6ab611033b2ac8af7ce85805b2',
        html_url: 'https://github.com/octocat/Hello-World/commit/7044a8a032e85b6ab611033b2ac8af7ce85805b2',
        comments_url: 'https://api.github.com/repos/octocat/Hello-World/commits/7044a8a032e85b6ab611033b2ac8af7ce85805b2/comments',
        author: new gitHubNock_1.UserItem('777449', 'unoju'),
        committer: new gitHubNock_1.UserItem('777449', 'unoju'),
        parents: [
            {
                sha: '553c2077f0edc3d5dc5d17262f6aa498e69d6f8e',
                url: 'https://api.github.com/repos/octocat/Hello-World/commits/553c2077f0edc3d5dc5d17262f6aa498e69d6f8e',
                html_url: 'https://github.com/octocat/Hello-World/commit/553c2077f0edc3d5dc5d17262f6aa498e69d6f8e',
            },
        ],
    },
];
//# sourceMappingURL=getPullsCommitsResponse.mock.js.map