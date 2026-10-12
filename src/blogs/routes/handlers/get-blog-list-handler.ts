import { Response } from 'express';
import { BlogViewModel } from '../output/blog.view-model';
import { HTTP_STATUSES } from '../../../core/types/http-statuses';
import { BlogQueryInput } from '../input/blog-query.input';
import { PaginatedViewModelOutput } from '../../../core/types/paginated-view-model.output';
import { blogsQueryRepository } from '../../repositories/blogs.query-repository';
import { RequestWithQuery } from '../../../core/types/requests';

export const getBlogListHandler = async (
  req: RequestWithQuery<BlogQueryInput>,
  res: Response<PaginatedViewModelOutput<BlogViewModel>>,
) => {
  try {
    const queryInput = req.query;

    const { items, totalCount } =
      await blogsQueryRepository.findMany(queryInput);

    const blogList = blogsQueryRepository.mapToBlogPaginatedOutput(items, {
      pageNumber: queryInput.pageNumber,
      pageSize: queryInput.pageSize,
      totalCount,
    });

    res.status(HTTP_STATUSES.OK_200).send(blogList);
  } catch {
    res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
  }
};
