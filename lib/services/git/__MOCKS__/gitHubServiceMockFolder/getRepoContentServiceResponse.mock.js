"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRepoContentServiceResponseFile = exports.getRepoContentServiceResponseDir = void 0;
const model_1 = require("../../model");
exports.getRepoContentServiceResponseDir = [
    {
        name: 'mockFile.ts',
        path: 'mockFolder/mockFile.ts',
        size: 0,
        sha: '980a0d5f19a64b4b30a87d4206aade58726b60e3',
        type: model_1.RepoContentType.file,
    },
];
exports.getRepoContentServiceResponseFile = {
    name: 'README',
    path: 'README',
    size: 13,
    sha: '980a0d5f19a64b4b30a87d4206aade58726b60e3',
    type: model_1.RepoContentType.file,
    content: 'SGVsbG8gV29ybGQhCg==',
    encoding: 'base64',
};
//# sourceMappingURL=getRepoContentServiceResponse.mock.js.map