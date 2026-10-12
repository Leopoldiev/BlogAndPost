import { Response } from 'express';
import { HTTP_STATUSES } from '../../../core/types/http-statuses';
import { usersService } from '../../application/users.service';
import { RequestWithParams } from '../../../core/types/requests';
import { ResultStatus } from '../../../core/result/resultCode';
import { resultCodeToHttpException } from '../../../core/result/resultCodeToHttpException';

export const deleteUserHandler = async (
  req: RequestWithParams<{ id: string }>,
  res: Response,
) => {
  const id = req.params.id;
  const result = await usersService.delete(id);

  if (result.status !== ResultStatus.Success) {
    return res
      .status(resultCodeToHttpException(result.status))
      .send(result.extensions);
  }

  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
};
