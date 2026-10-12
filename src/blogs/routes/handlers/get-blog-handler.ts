import { Response } from 'express';
import { HTTP_STATUSES } from '../../../core/types/http-statuses';
import { blogsQueryRepository } from '../../repositories/blogs.query-repository';
import { RequestWithParams } from '../../../core/types/requests';
import { ResultStatus } from '../../../core/result/resultCode';
import { resultCodeToHttpException } from '../../../core/result/resultCodeToHttpException';

export const getBlogHandler = async (
  req: RequestWithParams<{ id: string }>,
  res: Response,
) => {
  const id = req.params.id;
  const result = await blogsQueryRepository.findById(id);

  if (result.status !== ResultStatus.Success) {
    return res
      .status(resultCodeToHttpException(result.status))
      .send(result.extensions);
  }

  res.status(HTTP_STATUSES.OK_200).send(result.data);
};
