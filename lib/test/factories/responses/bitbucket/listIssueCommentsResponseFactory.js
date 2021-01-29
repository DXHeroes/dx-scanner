"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bitbucketListIssueCommentsResponseFactory = void 0;
exports.bitbucketListIssueCommentsResponseFactory = (items = []) => {
    return {
        values: items,
        next: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/issues/3086/comments?page=2',
        previous: '//TODO: "previous" is not present when it is a first page',
        page: 1,
        pagelen: items.length,
        size: items.length,
    };
};
//# sourceMappingURL=listIssueCommentsResponseFactory.js.map