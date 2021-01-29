"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listIssueCommentsResponse = void 0;
exports.listIssueCommentsResponse = (items, pagination) => {
    const defaultItems = [
        {
            user: {
                id: '3045721',
                login: 'Homolova',
                url: 'https://gitlab.com/Homolova',
            },
            url: 'gitlab.com/projects/homolova/ted_ontouml_kom/notes/299798113',
            body: 'test comment',
            createdAt: '2020-03-05T15:07:35.386Z',
            updatedAt: '2020-03-05T15:07:35.386Z',
            authorAssociation: 'Homolova',
            id: 299798113,
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
//# sourceMappingURL=listIssueComments.js.map