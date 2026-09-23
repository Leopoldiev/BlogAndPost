import { PaginationAndSorting } from '../../../core/types/pagination-and-sorting';
import { UserSortFields } from './user-sort-fields';
import { UsersSearchFields } from './user-search-fileds';

export type UserQueryInput = PaginationAndSorting<UserSortFields> &
  UsersSearchFields;
