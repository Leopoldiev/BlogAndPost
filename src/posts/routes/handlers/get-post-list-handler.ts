import { Request, Response } from 'express';
import { HTTP_STATUSES } from '../../../core/types/http-statuses';
import { PostViewModel } from '../../types/postViewModel';
import { PostQueryInput } from '../../input/post-query.input';
import { PaginatedViewModelOutput } from '../../../core/types/paginated-view-model.output';
import { errorsHandler } from '../../../core/exceptions/errors.handler';
import { postsQueryRepository } from '../../repositories/posts.query-repository';

export const getPostListHandler = async (
  req: Request<{}, {}, {}, PostQueryInput>,
  res: Response<PaginatedViewModelOutput<PostViewModel>>,
) => {
  try {
    const queryInput = req.query;
    const { items, totalCount } =
      await postsQueryRepository.findMany(queryInput);
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
