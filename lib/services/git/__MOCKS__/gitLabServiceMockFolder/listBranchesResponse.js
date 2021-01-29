"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listBranchesResponse = void 0;
exports.listBranchesResponse = (items, pagination) => {
    const defaultItems = [
        {
            name: 'master',
            type: 'default',
        },
    ];
    return {
        items: items || defaultItems,
        totalCount: (items === null || items === void 0 ? void 0 : items.length) || 1,
        hasNextPage: true,
        hasPreviousPage: false,
        page: (pagination === null || pagination === void 0 ? void 0 : pagination.page) || 1,
        perPage: (pagination === null || pagination === void 0 ? void 0 : pagination.perPage) || 1,
    };
};
//# sourceMappingURL=listBranchesResponse.js.map