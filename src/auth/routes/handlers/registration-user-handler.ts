import { RequestWithBody } from '../../../core/types/requests';
import { Response } from 'express';
import { authUserService } from '../../application/auth.service';
import { ResultStatus } from '../../../core/result/resultCode';
import { resultCodeToHttpException } from '../../../core/result/resultCodeToHttpException';
import { HTTP_STATUSES } from '../../../core/types/http-statuses';
import { UserRegistrationDto } from '../../application/dtos/user-registration.dto';

export const registrationUserHandler = async (
  req: RequestWithBody<UserRegistrationDto>,
  res: Response,
) => {
  const result = await authUserService.registration(req.body);

  if (result.status !== ResultStatus.Success) {
    return res
      .status(resultCodeToHttpException(result.status))
      .send(result.extensions);
  }

  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
};
