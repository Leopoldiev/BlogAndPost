import { Response } from 'express';
import { HTTP_STATUSES } from '../../../core/types/http-statuses';
import { BlogCreateUpdateDto } from '../../application/dtos/blog-create-update.dto';
import { blogsService } from '../../application/blogs.service';
import { RequestWithParamsAndBody } from '../../../core/types/requests';
import { ResultStatus } from '../../../core/result/resultCode';
import { resultCodeToHttpException } from '../../../core/result/resultCodeToHttpException';

export const updateBlogHandler = async (
  req: RequestWithParamsAndBody<{ id: string }, BlogCreateUpdateDto>,
  res: Response,
) => {
  const id = req.params.id;

  const result = await blogsService.update(id, req.body);

  if (result.status !== ResultStatus.Success) {
    return res
      .status(resultCodeToHttpException(result.status))
      .send(result.extensions);
  }

  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  return;
};
