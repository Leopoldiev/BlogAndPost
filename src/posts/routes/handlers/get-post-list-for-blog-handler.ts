import { Request, Response } from 'express';
import { PaginatedViewModelOutput } from '../../../core/types/paginated-view-model.output';
import { PostViewModel } from '../../types/postViewModel';
import { PostQueryInput } from '../../input/post-query.input';
import { HTTP_STATUSES } from '../../../core/types/http-statuses';
import { errorsHandler } from '../../../core/exceptions/errors.handler';
import { blogsQueryRepository } from '../../../blogs/repositories/blogs.query-repository';
import { postsQueryRepository } from '../../repositories/posts.query-repository';

export const getPostListForBlogHandler = async (
  req: Request<{ id: string }, {}, {}, PostQueryInput>,
  res: Response<PaginatedViewModelOutput<PostViewModel>>,
) => {
  try {
    const queryInput = req.query;
    const id = req.params.id;

    await blogsQueryRepository.findByIdOrFail(id);

    const { items, totalCount } = await postsQueryRepository.findManyByBlogId(
      id,
      queryInput,
    );

    const postList = postsQueryRepository.mapToPostPaginatedOutput(items, {
      pageNumber: queryInput.pageNumber,
      pageSize: queryInput.pageSize,
      totalCount,
    });

    res.status(HTTP_STATUSES.OK_200).send(postList);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
};
