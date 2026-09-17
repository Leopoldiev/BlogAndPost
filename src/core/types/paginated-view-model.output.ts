export type PaginatedViewModelOutput<I> = {
  page: number;
  pageSize: number;
  pagesCount: number;
  totalCount: number;
  items: I[];
};
