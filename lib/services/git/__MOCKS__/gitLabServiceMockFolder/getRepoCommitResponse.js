"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRepoCommit = void 0;
const lodash_1 = __importDefault(require("lodash"));
exports.getRepoCommit = (params) => {
    return lodash_1.default.merge({
        sha: '4eecfba1b1e2c35c13a7b34fc3d71e58cbb3645d',
        url: 'gitlab.com/projects/gitlab-org/gitlab/repository/commits/4eecfba1',
        message: 'Conditionally cache Snippet content\n' +
            '\n' +
            'Not all Snippets contain Markdown content and so\n' +
            'the `content` field should not always be cached.\n' +
            '\n' +
            'This change will attempt to determine if the content\n' +
            'is Markdown based on the Snippet filename and only cache\n' +
            'if it is\n',
        author: {
            name: 'Vijay Hawoldar',
            email: 'vhawoldar@gitlab.com',
            date: '2020-02-28T08:49:54.000+00:00',
        },
        tree: {
            sha: '54cd52b6316d15f3124b7223fd7863e7c3d18185',
            url: 'gitlab.com/projects/gitlab-org/gitlab/repository/commits/54cd52b6316d15f3124b7223fd7863e7c3d18185',
        },
        verified: false,
    }, params);
};
//# sourceMappingURL=getRepoCommitResponse.js.map