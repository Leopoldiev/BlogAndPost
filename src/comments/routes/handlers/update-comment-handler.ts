import { RequestWithParamsAndBodyAndUserId } from '../../../core/types/requests';
import { Response } from 'express';
import { ResultStatus } from '../../../core/result/resultCode';
import { resultCodeToHttpException } from '../../../core/result/resultCodeToHttpException';
import { HTTP_STATUSES } from '../../../core/types/http-statuses';
import { CommentCreateUpdateDto } from '../../application/dtos/comment-create-update.dto';
import { commentsService } from '../../application/comments.service';

export const updateCommentHandler = async (
  req: RequestWithParamsAndBodyAndUserId<
    { id: string },
    CommentCreateUpdateDto
  >,
  res: Response,
) => {
  const result = await commentsService.update(
    req.params.id,
    req.body,
    req.user.id,
  );

  if (result.status !== ResultStatus.Success) {
    return res
      .status(resultCodeToHttpException(result.status))
      .send(result.extensions);
  }

  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  return;
};
