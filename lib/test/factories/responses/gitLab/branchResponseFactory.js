"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gitLabBranchResponseFactory = void 0;
const lodash_1 = __importDefault(require("lodash"));
exports.gitLabBranchResponseFactory = (params) => {
    return lodash_1.default.merge({
        name: 'master',
        default: true,
    }, params);
};
//# sourceMappingURL=branchResponseFactory.js.map