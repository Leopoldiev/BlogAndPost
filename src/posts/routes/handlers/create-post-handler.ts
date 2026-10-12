import { Response } from 'express';
import { HTTP_STATUSES } from '../../../core/types/http-statuses';
import { PostCreateUpdateDto } from '../../application/dtos/post-create-update.dto';
import { postsService } from '../../application/posts.service';
import { RequestWithBody } from '../../../core/types/requests';
import { ResultStatus } from '../../../core/result/resultCode';
import { resultCodeToHttpException } from '../../../core/result/resultCodeToHttpException';

export const createPostHandler = async (
  req: RequestWithBody<PostCreateUpdateDto>,
  res: Response,
) => {
  const result = await postsService.create(req.body);

  if (result.status !== ResultStatus.Success) {
    return res
      .status(resultCodeToHttpException(result.status))
      .send(result.extensions);
  }

  res.status(HTTP_STATUSES.CREATED_201).send(result.data);
};
