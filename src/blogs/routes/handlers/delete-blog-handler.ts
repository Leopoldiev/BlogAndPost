import { Response } from 'express';
import { HTTP_STATUSES } from '../../../core/types/http-statuses';
import { blogsService } from '../../application/blogs.service';
import { RequestWithParams } from '../../../core/types/requests';
import { ResultStatus } from '../../../core/result/resultCode';
import { resultCodeToHttpException } from '../../../core/result/resultCodeToHttpException';

export const deleteBlogHandler = async (
  req: RequestWithParams<{ id: string }>,
  res: Response,
) => {
  const id = req.params.id;

  const result = await blogsService.delete(id);

  if (result.status !== ResultStatus.Success) {
    return res
      .status(resultCodeToHttpException(result.status))
      .send(result.extensions);
  }

  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
};
