import { RequestWithParams } from '../../../core/types/requests';
import { Response } from 'express';
import { HTTP_STATUSES } from '../../../core/types/http-statuses';
import { commentsQueryRepository } from '../../repositories/comments.query-repository';
import { ResultStatus } from '../../../core/result/resultCode';
import { resultCodeToHttpException } from '../../../core/result/resultCodeToHttpException';

export const getCommentHandler = async (
  req: RequestWithParams<{ id: string }>,
  res: Response,
) => {
  const id = req.params.id;
  console.log(id);
  const result = await commentsQueryRepository.findById(id);

  if (result.status !== ResultStatus.Success) {
    return res
      .status(resultCodeToHttpException(result.status))
      .send(result.extensions);
  }

  res.status(HTTP_STATUSES.OK_200).send(result.data);
};
