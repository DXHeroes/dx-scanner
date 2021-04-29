"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gitLabListContributorsResponseFactory = void 0;
const lodash_1 = __importDefault(require("lodash"));
exports.gitLabListContributorsResponseFactory = (params) => {
    return lodash_1.default.merge({
        name: 'adela',
        email: 'adela@gitlab.com',
        commits: 1,
    }, params);
};
//# sourceMappingURL=listContributorsResponseFactory.js.map