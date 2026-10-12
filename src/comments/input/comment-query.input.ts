import { PaginationAndSorting } from '../../core/types/pagination-and-sorting';
import { CommentSortFields } from './comment-sort-fields';

export type CommentQueryInput = PaginationAndSorting<CommentSortFields>;
