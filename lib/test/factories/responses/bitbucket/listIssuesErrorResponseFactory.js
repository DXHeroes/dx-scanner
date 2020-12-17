"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bitbucketListIssuesErrorResponseFactory = void 0;
exports.bitbucketListIssuesErrorResponseFactory = () => {
    return { type: 'error', error: { message: 'Repository has no issue tracker.' } };
};
//# sourceMappingURL=listIssuesErrorResponseFactory.js.map