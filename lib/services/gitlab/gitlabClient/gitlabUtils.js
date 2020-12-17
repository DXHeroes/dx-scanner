"use strict";
// https://github.com/jdalrymple/gitbeaker/blob/master/src/core/infrastructure/Utils.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseResponse = exports.GitLabClient = exports.bundler = void 0;
const MergeRequests_1 = require("./resources/MergeRequests");
const Issues_1 = require("./resources/Issues");
const Commits_1 = require("./resources/Commits");
const Projects_1 = require("./resources/Projects");
const UsersOrGroups_1 = require("./resources/UsersOrGroups");
const Version_1 = require("./resources/Version");
const Branches_1 = require("./resources/Branches");
exports.bundler = (services) => {
    return function Bundle(options) {
        Object.entries(services || {}).forEach(([name, Ser]) => {
            this[name] = new Ser(options);
        });
    };
};
// Initialize Gitlab Client
exports.GitLabClient = exports.bundler({ MergeRequests: MergeRequests_1.MergeRequests, Issues: Issues_1.Issues, Commits: Commits_1.Commits, Projects: Projects_1.Projects, Users: UsersOrGroups_1.Users, Version: Version_1.Version, Branches: Branches_1.Branches });
exports.parseResponse = (response) => {
    const { headers } = response;
    const { data } = response;
    const pagination = {
        total: parseInt(headers['x-total']),
        next: parseInt(headers['x-next-page']) || null,
        current: parseInt(headers['x-page']) || 1,
        previous: parseInt(headers['x-prev-page']) || null,
        perPage: parseInt(headers['x-per-page']),
        totalPages: parseInt(headers['x-total-pages']),
    };
    return { headers, data, pagination };
};
//# sourceMappingURL=gitlabUtils.js.map