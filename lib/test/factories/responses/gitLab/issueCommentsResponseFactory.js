"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gitLabIssueCommentsResponseFactory = void 0;
const lodash_1 = __importDefault(require("lodash"));
exports.gitLabIssueCommentsResponseFactory = (params) => {
    return lodash_1.default.merge({
        id: 299798113,
        type: null,
        body: 'test comment',
        attachment: null,
        author: {
            id: 3045721,
            name: 'Adela',
            username: 'Homolova',
            state: 'active',
            avatar_url: 'https://secure.gravatar.com/avatar/3e007e2a4f00c4a02ba6bc28431f4a20?s=80&d=identicon',
            web_url: 'https://gitlab.com/Homolova',
        },
        created_at: '2020-03-05T15:07:35.386Z',
        updated_at: '2020-03-05T15:07:35.386Z',
        system: false,
        noteable_id: 31618511,
        noteable_type: 'Issue',
        resolvable: false,
        noteable_iid: 1,
    }, params);
};
//# sourceMappingURL=issueCommentsResponseFactory.js.map