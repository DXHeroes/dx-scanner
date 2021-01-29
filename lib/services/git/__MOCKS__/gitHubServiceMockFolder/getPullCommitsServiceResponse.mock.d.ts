export declare const getPullCommitsServiceResponse: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    items: {
        commit: {
            author: {
                date: string;
                email: string;
                name: string;
            };
            message: string;
            tree: {
                sha: string;
                url: string;
            };
            url: string;
            verified: boolean;
        };
        sha: string;
    }[];
    page: number;
    perPage: number;
    totalCount: number;
};
//# sourceMappingURL=getPullCommitsServiceResponse.mock.d.ts.map