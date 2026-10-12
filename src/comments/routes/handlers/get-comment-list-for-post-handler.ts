import { RequestWithParamsAndQuery } from '../../../core/types/requests';
import { Response } from 'express';
import { HTTP_STATUSES } from '../../../core/types/http-statuses';
import { CommentQueryInput } from '../../input/comment-query.input';
import { ResultStatus } from '../../../core/result/resultCode';
import { resultCodeToHttpException } from '../../../core/result/resultCodeToHttpException';
import { commentsQueryRepository } from '../../repositories/comments.query-repository';
import { postsQueryRepository } from '../../../posts/repositories/posts.query-repository';

export const getCommentListForPostHandler = async (
  req: RequestWithParamsAndQuery<{ id: string }, CommentQueryInput>,
  res: Response,
) => {
  try {
    const queryInput = req.query;
    const id = req.params.id;

    const result = await postsQueryRepository.findById(id);

    if (result.status !== ResultStatus.Success) {
      return res
        .status(resultCodeToHttpException(result.status))
        .send(result.extensions);
    }

    const { items, totalCount } =
      await commentsQueryRepository.findManyByPostId(id, queryInput);

    const commentList = commentsQueryRepository.mapToCommentPaginatedOutput(
      items,
      {
        pageNumber: queryInput.pageNumber,
        pageSize: queryInput.pageSize,
        totalCount,
      },
    );

    res.status(HTTP_STATUSES.OK_200).send(commentList);
  } catch {
    res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
  }
};
