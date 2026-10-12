import { RequestWithParamsAndUserID } from '../../../core/types/requests';
import { Response } from 'express';
import { ResultStatus } from '../../../core/result/resultCode';
import { resultCodeToHttpException } from '../../../core/result/resultCodeToHttpException';
import { HTTP_STATUSES } from '../../../core/types/http-statuses';
import { commentsService } from '../../application/comments.service';

export const deleteCommentHandler = async (
  req: RequestWithParamsAndUserID<{ id: string }>,
  res: Response,
) => {
  const id = req.params.id;
  const userId = req.user.id;

  const result = await commentsService.delete(id, userId);

  if (result.status !== ResultStatus.Success) {
    return res
      .status(resultCodeToHttpException(result.status))
      .send(result.extensions);
  }
  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
};
