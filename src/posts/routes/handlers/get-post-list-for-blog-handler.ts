import { Response } from 'express';
import { PostQueryInput } from '../../input/post-query.input';
import { HTTP_STATUSES } from '../../../core/types/http-statuses';
import { blogsQueryRepository } from '../../../blogs/repositories/blogs.query-repository';
import { postsQueryRepository } from '../../repositories/posts.query-repository';
import { RequestWithParamsAndQuery } from '../../../core/types/requests';
import { ResultStatus } from '../../../core/result/resultCode';
import { resultCodeToHttpException } from '../../../core/result/resultCodeToHttpException';

export const getPostListForBlogHandler = async (
  req: RequestWithParamsAndQuery<{ id: string }, PostQueryInput>,
  res: Response,
) => {
  try {
    const queryInput = req.query;
    const id = req.params.id;

    const result = await blogsQueryRepository.findById(id);

    if (result.status !== ResultStatus.Success) {
      return res
        .status(resultCodeToHttpException(result.status))
        .send(result.extensions);
    }

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
  } catch {
    res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
  }
};
