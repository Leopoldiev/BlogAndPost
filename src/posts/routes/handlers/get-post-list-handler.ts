import { Response } from 'express';
import { HTTP_STATUSES } from '../../../core/types/http-statuses';
import { PostViewModel } from '../../types/postViewModel';
import { PostQueryInput } from '../../input/post-query.input';
import { PaginatedViewModelOutput } from '../../../core/types/paginated-view-model.output';
import { postsQueryRepository } from '../../repositories/posts.query-repository';
import { RequestWithQuery } from '../../../core/types/requests';

export const getPostListHandler = async (
  req: RequestWithQuery<PostQueryInput>,
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
  } catch {
    res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
  }
};
