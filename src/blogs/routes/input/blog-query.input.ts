import { PaginationAndSorting } from '../../../core/types/pagination-and-sorting';
import { BlogsSearchFields } from './blog-search-fileds';
import { BlogSortFields } from './blog-sort-fields';

export type BlogQueryInput = PaginationAndSorting<BlogSortFields> &
  BlogsSearchFields;
