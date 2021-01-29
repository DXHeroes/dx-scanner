"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bitbucketListCommitResponseFactory = void 0;
const lodash_1 = __importDefault(require("lodash"));
exports.bitbucketListCommitResponseFactory = (params) => {
    return lodash_1.default.merge({
        values: [],
        next: null,
        previous: '//TODO: "previous" is not present when it is a first page',
        page: 1,
        pagelen: 0,
        size: 0,
    }, params);
};
//# sourceMappingURL=listRepoCommitsResponseFactory.js.map