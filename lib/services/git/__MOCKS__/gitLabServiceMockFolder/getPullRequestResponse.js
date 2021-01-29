"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPullRequestResponse = void 0;
const lodash_1 = __importDefault(require("lodash"));
exports.getPullRequestResponse = (params) => {
    return lodash_1.default.merge({
        user: {
            id: '4087042',
            login: 'nkipling',
            url: 'https://gitlab.com/nkipling',
        },
        url: 'https://gitlab.com/gitlab-org/gitlab/-/merge_requests/26291',
        title: 'WIP: Add package_name as option to packages API',
        sha: '75074a52c203db3fab5e9d32e6e548a11fc01aba',
        createdAt: '2020-03-02T14:43:01.355Z',
        updatedAt: '2020-03-02T14:52:49.309Z',
        closedAt: null,
        mergedAt: null,
        state: 'opened',
        id: 26291,
        base: {
            repo: {
                url: 'gitlab.com/gitlab-org/gitlab',
                name: 'gitlab',
                id: '278964',
                owner: {
                    id: '9970',
                    login: 'gitlab-org',
                    url: 'https://gitlab.com/groups/gitlab-org',
                },
            },
        },
    }, params);
};
//# sourceMappingURL=getPullRequestResponse.js.map