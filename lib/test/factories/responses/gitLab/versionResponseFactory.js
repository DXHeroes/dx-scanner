"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gitLabVersionResponseFactory = void 0;
const lodash_1 = __importDefault(require("lodash"));
exports.gitLabVersionResponseFactory = (params) => {
    return lodash_1.default.merge({ version: '1.0.0', revision: '225c2e' }, params);
};
//# sourceMappingURL=versionResponseFactory.js.map