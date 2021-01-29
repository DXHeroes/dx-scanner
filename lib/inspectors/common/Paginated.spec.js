"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Paginated_1 = require("./Paginated");
describe('paginate', () => {
    it('returns the page number', async () => {
        const { page } = Paginated_1.paginate([1, 2, 3, 4, 5, 6], { page: 1, perPage: 2 });
        expect(page).toStrictEqual(1);
    });
    it('returns the per page number', async () => {
        const { perPage } = Paginated_1.paginate([1, 2, 3, 4, 5, 6], { page: 1, perPage: 2 });
        expect(perPage).toStrictEqual(2);
    });
    it('returns selected items', async () => {
        const { items } = Paginated_1.paginate([1, 2, 3, 4, 5, 6], { page: 1, perPage: 2 });
        expect(items).toStrictEqual([3, 4]);
    });
    it('returns remaining items if params specify a greater subset', async () => {
        const { items } = Paginated_1.paginate([1, 2, 3, 4, 5, 6], { page: 0, perPage: 7 });
        expect(items).toStrictEqual([1, 2, 3, 4, 5, 6]);
    });
    it('returns all items if params are undefined', async () => {
        const { items } = Paginated_1.paginate([1, 2, 3, 4, 5, 6]);
        expect(items).toStrictEqual([1, 2, 3, 4, 5, 6]);
    });
    it('returns the total count', async () => {
        const { totalCount } = Paginated_1.paginate([1, 2, 3, 4, 5, 6], { page: 1, perPage: 2 });
        expect(totalCount).toStrictEqual(6);
    });
    it('returns true if there is a next page', async () => {
        const { hasNextPage } = Paginated_1.paginate([1, 2, 3, 4, 5, 6], { page: 1, perPage: 2 });
        expect(hasNextPage).toStrictEqual(true);
    });
    it('returns false if there is no next page', async () => {
        const { hasNextPage } = Paginated_1.paginate([1, 2, 3, 4, 5, 6], { page: 2, perPage: 2 });
        expect(hasNextPage).toStrictEqual(false);
    });
    it('returns true if there is a previous page', async () => {
        const { hasPreviousPage } = Paginated_1.paginate([1, 2, 3, 4, 5, 6], { page: 1, perPage: 2 });
        expect(hasPreviousPage).toStrictEqual(true);
    });
    it('returns false if there is no previous page', async () => {
        const { hasPreviousPage } = Paginated_1.paginate([1, 2, 3, 4, 5, 6], { page: 0, perPage: 2 });
        expect(hasPreviousPage).toStrictEqual(false);
    });
});
//# sourceMappingURL=Paginated.spec.js.map