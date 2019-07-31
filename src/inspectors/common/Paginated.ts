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
export type PaginationParams = {
  page: number;
  perPage: number;
};

/**
 * Turn an array into a page.
 *
 * @param items The array of items.
 * @param params A specification of the subset of all the items to be paginated.
 * @returns The page of the specified items.
 */
export const paginate = <T>(items: T[], params?: PaginationParams): Paginated<T> => {
  const { page, perPage } = params !== undefined ? params : { page: 0, perPage: items.length };
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
