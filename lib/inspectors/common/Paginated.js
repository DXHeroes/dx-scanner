"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginate = void 0;
/**
 * Turn an array into a page.
 *
 * @param items The array of items.
 * @param params A specification of the subset of all the items to be paginated.
 * @returns The page of the specified items.
 */
exports.paginate = (items, params) => {
    const page = (params === null || params === void 0 ? void 0 : params.page) || 0;
    const perPage = (params === null || params === void 0 ? void 0 : params.perPage) || items.length;
    const totalCount = items.length;
    const start = page * perPage;
    const end = start + perPage;
    items = items.slice(start, end);
    return {
        page,
        perPage,
        items,
        totalCount,
        hasNextPage: end < totalCount,
        hasPreviousPage: start > 0,
    };
};
//# sourceMappingURL=Paginated.js.map