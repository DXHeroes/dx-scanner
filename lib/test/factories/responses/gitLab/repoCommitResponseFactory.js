"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gitLabRepoCommitsResponseFactory = void 0;
const lodash_1 = __importDefault(require("lodash"));
exports.gitLabRepoCommitsResponseFactory = (params) => {
    return lodash_1.default.merge({
        id: '4eecfba1b1e2c35c13a7b34fc3d71e58cbb3645d',
        short_id: '4eecfba1',
        created_at: '2020-02-28T08:49:54.000+00:00',
        parent_ids: ['54cd52b6316d15f3124b7223fd7863e7c3d18185'],
        title: 'Conditionally cache Snippet content',
        message: 'Conditionally cache Snippet content\n\nNot all Snippets contain Markdown content and so\nthe `content` field should not always be cached.\n\nThis change will attempt to determine if the content\nis Markdown based on the Snippet filename and only cache\nif it is\n',
        author_name: 'Vijay Hawoldar',
        author_email: 'vhawoldar@gitlab.com',
        authored_date: '2020-02-26T17:15:11.000+00:00',
        committer_name: 'Vijay Hawoldar',
        committer_email: 'vhawoldar@gitlab.com',
        committed_date: '2020-02-28T08:49:54.000+00:00',
        stats: {
            additions: 65,
            deletions: 4,
            total: 69,
        },
        status: null,
        project_id: 278964,
        last_pipeline: null,
    }, params);
};
//# sourceMappingURL=repoCommitResponseFactory.js.map