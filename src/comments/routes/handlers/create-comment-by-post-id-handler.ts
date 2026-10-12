import { RequestWithParamsAndBodyAndUserId } from '../../../core/types/requests';
import { Response } from 'express';
import { ResultStatus } from '../../../core/result/resultCode';
import { resultCodeToHttpException } from '../../../core/result/resultCodeToHttpException';
import { HTTP_STATUSES } from '../../../core/types/http-statuses';
import { CommentCreateUpdateDto } from '../../application/dtos/comment-create-update.dto';
import { commentsService } from '../../application/comments.service';

export const createCommentByPostIdHandler = async (
  req: RequestWithParamsAndBodyAndUserId<
    { id: string },
    CommentCreateUpdateDto
  >,
  res: Response,
) => {
  const inputDto = req.body;
  const postId = req.params.id;
  const userId = req.user.id;

  const result = await commentsService.createCommentByPostId(
    postId,
    inputDto,
    userId,
  );

  if (result.status !== ResultStatus.Success) {
    return res
      .status(resultCodeToHttpException(result.status))
      .send(result.extensions);
  }

  res.status(HTTP_STATUSES.CREATED_201).send(result.data);
};
