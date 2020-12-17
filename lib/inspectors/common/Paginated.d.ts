/**
 * Paginated response
 */
export interface Paginated<T> {
    page?: number;
    perPage?: number;
    items: T[];
    totalCount: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}
/**
 * Used pagination params
 */
export declare type PaginationParams = {
    page?: number;
    perPage?: number;
};
/**
 * Turn an array into a page.
 *
 * @param items The array of items.
 * @param params A specification of the subset of all the items to be paginated.
 * @returns The page of the specified items.
 */
export declare const paginate: <T>(items: T[], params?: PaginationParams | undefined) => Paginated<T>;
//# sourceMappingURL=Paginated.d.ts.map