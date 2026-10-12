import { Response } from 'express';
import { HTTP_STATUSES } from '../../../core/types/http-statuses';
import { PostCreateUpdateDto } from '../../application/dtos/post-create-update.dto';
import { postsService } from '../../application/posts.service';
import { RequestWithParamsAndBody } from '../../../core/types/requests';
import { ResultStatus } from '../../../core/result/resultCode';
import { resultCodeToHttpException } from '../../../core/result/resultCodeToHttpException';

export const updatePostHandler = async (
  req: RequestWithParamsAndBody<{ id: string }, PostCreateUpdateDto>,
  res: Response,
) => {
  const result = await postsService.update(req.params.id, req.body);

  if (result.status !== ResultStatus.Success) {
    return res
      .status(resultCodeToHttpException(result.status))
      .send(result.extensions);
  }

  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  return;
};
