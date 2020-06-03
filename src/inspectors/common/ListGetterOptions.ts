import { PaginationParams } from './Paginated';

// general purpose filtering options
export interface ListGetterOptions<Filter = Record<string, unknown>, SortOptions = Record<string, unknown>> {
  filter?: Filter; // specific options to filter by (for example "state" for Github PR'ss)
  pagination?: PaginationParams; // general purpose pagination
  sort?: SortOptions; // specific sorting options
}
