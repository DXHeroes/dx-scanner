import { Paginated } from '.';
import _ from 'lodash';
import { injectable } from 'inversify';

/**
 * List features for inspectors
 */
@injectable()
export abstract class ListableUtils {
  /**
   * Abstract function to list all items
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listAlll<TParam extends any[], TResult>(fn: (...args: TParam) => Promise<Paginated<TResult>>, count = 50) {
    return async (...args: TParam): Promise<Paginated<TResult>> => {
      let items: TResult[] = [];
      let hasNextPage = true;
      let i = 1;

      while (hasNextPage) {
        // Max 50 items per page because of API limits
        const fnArgsWithPg = _.merge({ ...args }, { options: { page: i, perPage: 50 } });
        console.log(typeof args);
        console.log(args);
        const listRes = await fn.apply(this, args);

        // Add pull requstes to the existing array of PRs from another page
        items = _.merge(items, listRes.items);

        if (items.length >= count) {
          break;
        }

        hasNextPage = listRes.hasNextPage;
        i++;
      }

      //Get maximum n newest pull requests
      items = _.take(items, count);

      return {
        hasNextPage: false,
        hasPreviousPage: false,
        items,
        totalCount: items.length,
        page: 1,
        perPage: items.length,
      };
    };
  }
}
