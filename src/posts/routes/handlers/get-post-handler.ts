import { Response } from 'express';
import { HTTP_STATUSES } from '../../../core/types/http-statuses';
import { postsQueryRepository } from '../../repositories/posts.query-repository';
import { RequestWithParams } from '../../../core/types/requests';
import { ResultStatus } from '../../../core/result/resultCode';
import { resultCodeToHttpException } from '../../../core/result/resultCodeToHttpException';

export const getPostHandler = async (
  req: RequestWithParams<{ id: string }>,
  res: Response,
) => {
  const id = req.params.id;
  const result = await postsQueryRepository.findById(id);

  if (result.status !== ResultStatus.Success) {
    return res
      .status(resultCodeToHttpException(result.status))
      .send(result.extensions);
  }

  res.status(HTTP_STATUSES.OK_200).send(result.data);
};
