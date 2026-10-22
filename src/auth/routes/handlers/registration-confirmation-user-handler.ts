import { RequestWithBody } from '../../../core/types/requests';
import { Response } from 'express';
import { authUserService } from '../../application/auth.service';
import { ResultStatus } from '../../../core/result/resultCode';
import { resultCodeToHttpException } from '../../../core/result/resultCodeToHttpException';
import { HTTP_STATUSES } from '../../../core/types/http-statuses';

export const registrationConfirmationUserHandler = async (
  req: RequestWithBody<string>,
  res: Response,
) => {
  const result = await authUserService.registrationConfirmation(req.body);

  if (result.status !== ResultStatus.Success) {
    return res
      .status(resultCodeToHttpException(result.status))
      .send(result.extensions);
  }

  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
};
